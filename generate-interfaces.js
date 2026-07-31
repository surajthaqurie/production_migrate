const fs = require("fs");
const path = require("path");

/**
 * Enhanced Migration-based TypeScript Interface Generator
 * Generates Kysely interfaces from migration files without database connection
 */
class MigrationInterfaceGenerator {
  constructor() {
    this.tables = new Map();
    this.enums = new Map();
    this.baseTypes = `import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;
export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<number, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;
`;
  }

  async parseMigrations(migrationType = "tenant") {
    const migrationDir = path.join(process.cwd(), "database", "migrations", migrationType);

    if (!fs.existsSync(migrationDir)) {
      console.error(`Migration directory not found: ${migrationDir}`);
      return;
    }

    const files = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".ts") && !file.includes("index"))
      .sort();

    console.log(`Found ${files.length} migration files in ${migrationDir}`);

    for (const file of files) {
      const filePath = path.join(migrationDir, file);
      await this.parseMigrationFile(filePath);
    }
  }

  async parseMigrationFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const upContent = this.extractUpMigrationContent(content);
    if (!upContent) return;

    // --- createTable ---
    const tableMatches = [...upContent.matchAll(/\.createTable\(["'](\w+)["']\)/g)];
    for (const match of tableMatches) {
      this.parseTableDefinition(upContent, match[1]);
    }

    // --- alterTable ---
    const alterTableMatches = [...upContent.matchAll(/\.alterTable\(["'](\w+)["']\)/g)];
    for (const match of alterTableMatches) {
      this.parseAlterTableDefinition(upContent, match[1], match.index, match[0].length);
    }

    // --- enums ---
    const enumMatches = [...upContent.matchAll(/CREATE TYPE\s+(\w+)\s+AS\s+ENUM\s*\(([\s\S]*?)\)/gi)];
    for (const match of enumMatches) {
      const [, enumName, valuesString] = match;
      this.parseEnumDefinition(enumName, valuesString);
    }
  }

  extractUpMigrationContent(content) {
    const upStartRegex = /export\s+async\s+function\s+up\s*\([^)]*\)\s*:\s*Promise<void>\s*\{/;
    const upStartMatch = content.match(upStartRegex);
    if (!upStartMatch) return "";

    const startIndex = upStartMatch.index + upStartMatch[0].length;
    let braceCount = 1;
    let inString = false;
    let stringChar = "";

    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];

      if (!inString && char === "/" && content[i + 1] === "/") {
        const newlineIndex = content.indexOf("\n", i);
        i = newlineIndex === -1 ? content.length : newlineIndex;
        continue;
      }

      if (!inString && (char === '"' || char === "'" || char === "`")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && content[i - 1] !== "\\") {
        inString = false;
        stringChar = "";
      } else if (!inString) {
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;
        if (braceCount === 0) return content.slice(startIndex, i);
      }
    }

    return "";
  }

  parseTableDefinition(content, tableName) {
    // FIX: Use matchAll so we handle every occurrence (e.g. the table appears
    // in both a createTable and an earlier reference), and always take the
    // createTable-specific one.
    const tableStartRegex = new RegExp(`\\.createTable\\(["']${tableName}["']\\)`, "g");
    const allMatches = [...content.matchAll(tableStartRegex)];
    if (allMatches.length === 0) return;

    // Use the last createTable match to pick up re-definitions in later migrations
    const tableStartMatch = allMatches[allMatches.length - 1];
    const startIndex = tableStartMatch.index + tableStartMatch[0].length;
    const tableDefinition = this.extractSchemaChain(content, startIndex);

    if (!tableDefinition) return;

    const columns = this.extractColumns(tableDefinition, tableName);

    if (columns.size > 0) {
      this.tables.set(tableName, columns);
      console.log(`Parsed table: ${tableName} (${columns.size} columns)`);
    } else {
      console.warn(`⚠️  No columns found for table: ${tableName} — check addColumn syntax`);
    }
  }

  parseAlterTableDefinition(content, tableName, matchIndex, matchLength) {
    const tableDefinition = this.extractSchemaChain(content, matchIndex + matchLength);
    if (!tableDefinition) return;

    const existingColumns = this.tables.get(tableName) || new Map();

    const addedColumns = this.extractColumns(tableDefinition, tableName);
    for (const [columnName, column] of addedColumns.entries()) {
      existingColumns.set(columnName, column);
    }

    const droppedColumns = this.extractDroppedColumns(tableDefinition);
    for (const columnName of droppedColumns) {
      existingColumns.delete(columnName);
    }

    if (existingColumns.size > 0) {
      this.tables.set(tableName, existingColumns);
    }

    if (addedColumns.size > 0 || droppedColumns.length > 0) {
      console.log(`Parsed alter table: ${tableName} (+${addedColumns.size}, -${droppedColumns.length})`);
    }
  }

  extractSchemaChain(content, startIndex) {
    let braceCount = 0;
    let parenCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let stringChar = "";
    let found = false;

    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];

      if (!inString && char === "/" && content[i + 1] === "/") {
        const newlineIndex = content.indexOf("\n", i);
        i = newlineIndex === -1 ? content.length : newlineIndex;
        continue;
      }

      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && content[i - 1] !== "\\") {
        inString = false;
        stringChar = "";
      } else if (!inString) {
        if (char === "(") parenCount++;
        if (char === ")") parenCount--;
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;

        if (parenCount === 0 && braceCount === 0) {
          const remaining = content.slice(i);
          if (remaining.startsWith(".execute()")) {
            endIndex = i + ".execute()".length;
            found = true;
            break;
          }
        }
      }
    }

    if (!found) return "";
    return content.slice(startIndex, endIndex);
  }

  extractDroppedColumns(tableDefinition) {
    const droppedColumns = [];
    const dropColumnRegex = /\.dropColumn\s*\(\s*["'](\w+)["']\s*\)/g;
    let match;
    while ((match = dropColumnRegex.exec(tableDefinition)) !== null) {
      droppedColumns.push(match[1]);
    }
    return droppedColumns;
  }

  /**
   * FIX: Two-pass column extraction.
   *
   * Pass 1 – collect every .addColumn() call with its raw arguments.
   * Pass 2 – resolve type and constraints for each collected column.
   *
   * The old single-regex approach failed when:
   *   • the column options callback spanned multiple lines
   *   • a later .addColumn started before the previous lookahead boundary
   *   • sql`` template literals contained special characters
   */
  extractColumns(tableDefinition, tableNameForDebug = "") {
    const columns = new Map();

    // Step 1: Locate every .addColumn( position
    const addColumnPositions = [];
    const addColSearch = /\.addColumn\s*\(/g;
    let m;
    while ((m = addColSearch.exec(tableDefinition)) !== null) {
      addColumnPositions.push(m.index + m[0].length - 1); // index of the opening '('
    }

    for (const openParenPos of addColumnPositions) {
      // Step 2: Extract the full argument list for this .addColumn(...)
      const args = this.extractBalancedParens(tableDefinition, openParenPos);
      if (!args) continue;

      // Step 3: Parse column name (first arg)
      const columnNameMatch = args.match(/^\s*["'](\w+)["']/);
      if (!columnNameMatch) continue;
      const columnName = columnNameMatch[1];

      // Step 4: Parse column type (second arg — string or sql`...`)
      let columnType = null;

      // Try sql`` template literal first
      const sqlTypeMatch = args.match(/["']\w[^"']*["']\s*,\s*sql`([^`]+)`/);
      if (sqlTypeMatch) {
        columnType = sqlTypeMatch[1].trim();
      } else {
        // Plain string type
        const stringTypeMatch = args.match(/["']\w[^"']*["']\s*,\s*["']([^"']+)["']/);
        if (stringTypeMatch) {
          columnType = stringTypeMatch[1].trim();
        }
      }

      if (!columnType) {
        console.warn(`  ⚠️  Could not parse type for column "${columnName}" in "${tableNameForDebug}"`);
        continue;
      }

      // Step 5: Extract options callback body (third arg, if present)
      let columnOptions = "";
      // Find the third argument by locating the second comma at top-level depth
      let commaCount = 0;
      let depth = 0;
      let inStr = false;
      let strCh = "";
      let thirdArgStart = -1;

      for (let i = 0; i < args.length; i++) {
        const ch = args[i];
        if (!inStr && (ch === '"' || ch === "'" || ch === "`")) {
          inStr = true;
          strCh = ch;
        } else if (inStr && ch === strCh && args[i - 1] !== "\\") {
          inStr = false;
          strCh = "";
        } else if (!inStr) {
          if (ch === "(" || ch === "{" || ch === "[") depth++;
          else if (ch === ")" || ch === "}" || ch === "]") depth--;
          else if (ch === "," && depth === 0) {
            commaCount++;
            if (commaCount === 2) {
              thirdArgStart = i + 1;
              break;
            }
          }
        }
      }

      if (thirdArgStart !== -1) {
        columnOptions = args.slice(thirdArgStart).trim();
      }

      // Step 6: Build column object
      const column = {
        name: columnName,
        type: this.mapPostgresType(columnType),
        nullable: true,
        generated: false,
        primary: false,
        default: false,
        references: null
      };

      if (columnOptions) {
        this.parseColumnOptions(column, columnOptions, columnName, columnType);
      }

      this.applyColumnConventions(column, columnName, columnType);

      columns.set(columnName, column);
    }

    return columns;
  }

  /**
   * Given the index of an opening '(' in `str`, return the content inside
   * the matching closing ')' (exclusive of the outer parens themselves).
   */
  extractBalancedParens(str, openIndex) {
    let depth = 0;
    let inString = false;
    let stringChar = "";
    let start = -1;

    for (let i = openIndex; i < str.length; i++) {
      const ch = str[i];

      if (!inString && ch === "/" && str[i + 1] === "/") {
        const newlineIndex = str.indexOf("\n", i);
        i = newlineIndex === -1 ? str.length : newlineIndex;
        continue;
      }

      if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
        inString = true;
        stringChar = ch;
      } else if (inString && ch === stringChar && str[i - 1] !== "\\") {
        inString = false;
        stringChar = "";
      } else if (!inString) {
        if (ch === "(") {
          depth++;
          if (depth === 1) start = i + 1;
        } else if (ch === ")") {
          depth--;
          if (depth === 0) return str.slice(start, i);
        }
      }
    }

    return null; // unbalanced
  }

  parseColumnOptions(column, options, columnName, columnType) {
    const cleanOptions = options.replace(/\s+/g, " ").trim();

    if (cleanOptions.includes("primaryKey()")) {
      column.primary = true;
      column.nullable = false;
    }

    if (cleanOptions.includes("notNull()")) {
      column.nullable = false;
    }

    if (cleanOptions.includes("unique()")) {
      column.unique = true;
    }

    if (cleanOptions.includes("defaultTo(")) {
      column.default = true;

      if (cleanOptions.includes("gen_random_uuid()")) {
        column.generated = true;
        column.type = "Generated<string>";
      } else if (cleanOptions.includes("CURRENT_TIMESTAMP") || cleanOptions.includes("now()")) {
        column.generated = true;
        column.type = columnType.includes("timestamp") ? "Generated<Timestamp>" : "Generated<string>";
      } else if (/defaultTo\s*\(\s*(false|true)\s*\)/.test(cleanOptions)) {
        column.generated = true;
        column.type = "Generated<boolean>";
      } else if (/defaultTo\s*\(\s*\d+\s*\)/.test(cleanOptions)) {
        column.generated = true;
        column.type = "Generated<number>";
      }
    }

    const referencesMatch = cleanOptions.match(/references\s*\(\s*["']([^"']+)["']\s*\)/);
    if (referencesMatch) {
      column.references = referencesMatch[1];
    }
  }

  applyColumnConventions(column, columnName, columnType) {
    // id uuid → Generated<string>
    if (columnName === "id" && columnType === "uuid") {
      column.type = "Generated<string>";
      column.generated = true;
      column.nullable = false;
      column.primary = true;
      return;
    }

    // foreign key uuids
    if (columnName.endsWith("Id") && columnType === "uuid") {
      column.type = column.nullable ? "string | null" : "string";
      return;
    }

    // enum types
    if (this.enums.has(columnType)) {
      const enumTypeName = this.toPascalCase(columnType);
      column.type = column.nullable ? `${enumTypeName} | null` : enumTypeName;
      return;
    }

    // timestamps
    if (columnType.includes("timestamp") || columnType === "timestamptz" || columnType === "date") {
      if (columnName === "createdAt" || columnName === "updatedAt") {
        column.type = "Generated<Timestamp>";
        column.generated = true;
        column.nullable = false;
      } else {
        column.type = column.nullable ? "Timestamp | null" : "Timestamp";
      }
      return;
    }

    // boolean
    if (columnType === "boolean") {
      if (column.default) {
        column.type = "Generated<boolean>";
        column.generated = true;
      } else {
        column.type = column.nullable ? "boolean | null" : "boolean";
      }
      return;
    }

    // json / jsonb
    if (columnType === "json" || columnType === "jsonb") {
      column.type = column.nullable ? "Json | null" : "Json";
      return;
    }

    // arrays (e.g. text[], integer[])
    if (columnType.endsWith("[]")) {
      const baseTs = this.mapPostgresType(columnType); // already mapped in constructor
      if (column.default) {
        column.type = `Generated<${baseTs}>`;
        column.generated = true;
      } else {
        column.type = column.nullable ? `${baseTs} | null` : baseTs;
      }
      return;
    }

    // integers / numerics with defaults
    const numericTypes = new Set(["integer", "int2", "int4", "int8", "smallint", "smallserial", "serial", "bigserial", "bigint", "double precision", "numeric", "decimal"]);
    if (numericTypes.has(columnType) && column.default) {
      column.type = "Generated<number>";
      column.generated = true;
      return;
    }

    // FIX: varchar / text — only overwrite if we haven't already set a special type
    // (previously this block ran unconditionally and clobbered Generated<> values)
    if (columnType.startsWith("varchar") || columnType === "text") {
      if (!column.generated) {
        column.type = column.nullable ? "string | null" : "string";
      }
      return;
    }
  }

  parseEnumDefinition(enumName, valuesString) {
    if (!enumName || !valuesString) {
      console.warn("Invalid enum definition: missing name or values");
      return;
    }

    const values = [];
    const rawValues = valuesString.split(",").map((v) => v.trim());

    for (const rawValue of rawValues) {
      const valueMatch = rawValue.match(/['"]([^'"]*)['"]/);
      if (valueMatch && valueMatch[1]) {
        const cleanValue = valueMatch[1].trim();
        if (cleanValue) values.push(cleanValue);
      }
    }

    if (values.length > 0) {
      this.enums.set(enumName, values);
      console.log(`Parsed enum: ${enumName} (${values.length} values)`);
    } else {
      console.warn(`No valid values found for enum: ${enumName}`);
    }
  }

  mapPostgresType(pgType) {
    if (!pgType) return "unknown";

    const typeMap = {
      uuid: "string",
      varchar: "string",
      text: "string",
      boolean: "boolean",
      integer: "number",
      int2: "number",
      int4: "number",
      int8: "number",
      smallint: "number",
      smallserial: "number",
      serial: "number",
      bigserial: "number",
      bigint: "number",
      "double precision": "number",
      numeric: "number",
      decimal: "number",
      timestamptz: "Timestamp",
      "timestamp with time zone": "Timestamp",
      "timestamp without time zone": "Timestamp",
      timestamp: "Timestamp",
      date: "Timestamp",
      json: "Json",
      jsonb: "Json"
    };

    // arrays
    if (pgType.endsWith("[]")) {
      const baseType = pgType.slice(0, -2).trim();
      const mappedBase = typeMap[baseType] || "string";
      return `${mappedBase}[]`;
    }

    // strip length specifiers e.g. varchar(255)
    const baseType = pgType.split("(")[0].trim().toLowerCase();
    return typeMap[baseType] || "string";
  }

  generateEnumTypes() {
    if (this.enums.size === 0) return "";

    let enumCode = "";
    const sortedEnums = Array.from(this.enums.entries()).sort(([a], [b]) => a.localeCompare(b));

    for (const [enumName, values] of sortedEnums) {
      const tsEnumName = this.toPascalCase(enumName);
      enumCode += `export enum ${tsEnumName} {\n`;
      for (const value of values) {
        const enumKey = value.replace(/[^A-Z0-9_]/gi, "_").toUpperCase();
        enumCode += `  ${enumKey} = "${value.replace(/"/g, '\\"')}",\n`;
      }
      enumCode += `}\n\n`;
    }

    return enumCode;
  }

  generateTableInterfaces() {
    let interfaceCode = "";

    for (const [tableName, columns] of this.tables) {
      const interfaceName = this.toPascalCase(tableName);
      interfaceCode += `\nexport interface ${interfaceName} {\n`;

      for (const [columnName, column] of columns) {
        interfaceCode += `  ${columnName}: ${column.type};\n`;
      }

      interfaceCode += "}\n";
    }

    return interfaceCode;
  }

  generateDBInterface() {
    let dbInterface = "\nexport interface DB {\n";

    for (const [tableName] of this.tables) {
      const interfaceName = this.toPascalCase(tableName);
      dbInterface += `  ${tableName}: ${interfaceName};\n`;
    }

    dbInterface += "}\n";
    return dbInterface;
  }

  generateInterfaceFile() {
    let content = `/**\n * This file was generated by migration-interface-generator.\n * Please do not edit it manually.\n */\n\n`;
    content += this.baseTypes;
    content += "\n// Enum types\n";
    content += this.generateEnumTypes();
    content += "\n// Table interfaces\n";
    content += this.generateTableInterfaces();
    content += "\n// Database interface\n";
    content += this.generateDBInterface();
    return content;
  }

  toCamelCase(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  toPascalCase(str) {
    const camelCase = this.toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  async generate(migrationType = "tenant") {
    console.log(`\nGenerating ${migrationType} database interfaces from migrations...`);
    console.log("=".repeat(60));

    await this.parseMigrations(migrationType);

    if (this.tables.size === 0) {
      console.log("No tables found. Please check your migration files.");
      return;
    }

    const interfaceContent = this.generateInterfaceFile();
    const outputPath = path.join(process.cwd(), "src", `${migrationType}-db.interface.ts`);

    fs.writeFileSync(outputPath, interfaceContent);

    console.log("=".repeat(60));
    console.log(`Summary: ${this.tables.size} tables, ${this.enums.size} enums`);
    console.log("=".repeat(60));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const migrationType = args[0] || "tenant";

  try {
    const generator = new MigrationInterfaceGenerator();
    await generator.generate(migrationType);
  } catch (error) {
    console.error("Error generating interfaces:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { MigrationInterfaceGenerator };
