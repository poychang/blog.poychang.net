const CsharpSchemaConverterApi = (function initCsharpSchemaConverter(globalScope) {
  const INTEGER_TYPES = new Set([
    "byte",
    "sbyte",
    "short",
    "ushort",
    "int",
    "uint",
    "long",
    "ulong",
  ]);

  const NUMBER_TYPES = new Set(["float", "double", "decimal"]);
  const COLLECTION_TYPES = new Set([
    "List",
    "IList",
    "IReadOnlyList",
    "ICollection",
    "IEnumerable",
  ]);
  const DICTIONARY_TYPES = new Set([
    "Dictionary",
    "IDictionary",
    "IReadOnlyDictionary",
    "SortedDictionary",
  ]);
  const UNSUPPORTED_TYPES = new Set(["object", "dynamic"]);
  const ALLOWED_SCHEMA_KEYS = new Set([
    "type",
    "properties",
    "required",
    "additionalProperties",
    "items",
    "enum",
    "anyOf",
    "$defs",
    "$ref",
    "description",
  ]);
  const ALLOWED_TYPES = new Set([
    "string",
    "number",
    "integer",
    "boolean",
    "object",
    "array",
    "null",
  ]);
  const CSHARP_KEYWORDS = new Set([
    "abstract",
    "as",
    "base",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "delegate",
    "do",
    "else",
    "enum",
    "event",
    "false",
    "finally",
    "for",
    "foreach",
    "get",
    "if",
    "in",
    "init",
    "interface",
    "internal",
    "is",
    "namespace",
    "new",
    "null",
    "out",
    "override",
    "private",
    "protected",
    "public",
    "readonly",
    "record",
    "required",
    "return",
    "sealed",
    "set",
    "static",
    "struct",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "using",
    "virtual",
    "void",
    "while",
  ]);
  const CSHARP_BUILTIN_TYPES = new Set([
    "bool",
    "byte",
    "char",
    "DateOnly",
    "DateTime",
    "DateTimeOffset",
    "decimal",
    "double",
    "dynamic",
    "float",
    "Guid",
    "int",
    "long",
    "object",
    "sbyte",
    "short",
    "string",
    "TimeOnly",
    "TimeSpan",
    "uint",
    "ulong",
    "ushort",
  ]);
  const CSHARP_TOKEN_PATTERN =
    /\/\/\/[^\r\n]*|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|@"(?:""|[^"])*"|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[{}()[\];,.<>?=:+*/-]/g;
  const JSON_TOKEN_PATTERN =
    /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}[\],:]/g;

  const DEFAULT_OPTIONS = {
    includeFields: false,
    propertyNamingPolicy: "camelCase",
  };

  const EMPTY_OUTPUT = "Paste a C# class to generate JSON Schema.";

  const DEFAULT_SAMPLE = [
    "using System.ComponentModel;",
    "using System.Text.Json.Serialization;",
    "",
    "public sealed class CalendarEventResponse",
    "{",
    "    [JsonPropertyName(\"event_name\")]",
    "    [Description(\"Name of the calendar event.\")]",
    "    public required string Name { get; init; }",
    "",
    "    [Description(\"Event date. Use yyyy-MM-dd.\")]",
    "    public required DateOnly Date { get; init; }",
    "",
    "    public string? Location { get; init; }",
    "",
    "    public required List<Person> Participants { get; init; }",
    "}",
    "",
    "public sealed class Person",
    "{",
    "    public required string Name { get; init; }",
    "    public string? Email { get; init; }",
    "}",
  ].join("\n");

  class SchemaConversionError extends Error {
    constructor(code, path, message) {
      super(message);
      this.name = "SchemaConversionError";
      this.code = code;
      this.path = path;
    }
  }

  function convertCsharpToJsonSchema(source, options) {
    const normalizedOptions = normalizeOptions(options);
    const parsed = parseCsharpSource(source, normalizedOptions);

    if (!parsed.rootModel) {
      throw new SchemaConversionError(
        "RootMustBeObject",
        "$",
        "Input must contain at least one C# class, record class, or record model.",
      );
    }

    const context = {
      options: normalizedOptions,
      rootName: parsed.rootModel.name,
      modelsByName: parsed.modelsByName,
      enumsByName: parsed.enumsByName,
      defs: {},
      builtDefs: new Set(),
      buildingDefs: new Set(),
      propertyCount: 0,
      maxDepth: 1,
    };

    const schema = buildObjectSchema(parsed.rootModel, context, "$", 1);
    if (Object.keys(context.defs).length > 0) {
      schema.$defs = context.defs;
    }

    if (context.propertyCount > 100) {
      throw new SchemaConversionError(
        "ExceededPropertyLimit",
        "$",
        `Object property count ${context.propertyCount} exceeds the Azure OpenAI limit of 100.`,
      );
    }

    if (context.maxDepth > 5) {
      throw new SchemaConversionError(
        "ExceededNestingDepth",
        "$",
        `Object nesting depth ${context.maxDepth} exceeds the Azure OpenAI limit of 5.`,
      );
    }

    validateSchemaSubset(schema);
    return schema;
  }

  function normalizeOptions(options) {
    return Object.assign({}, DEFAULT_OPTIONS, options || {});
  }

  function parseCsharpSource(source, options) {
    const text = String(source || "");
    const masked = maskCommentsAndStrings(text);
    const declarations = findTypeDeclarations(text, masked);
    const enumModels = declarations
      .filter((declaration) => declaration.kind === "enum")
      .map((declaration) => ({
        name: declaration.name,
        values: parseEnumValues(declaration.body),
        declaration,
      }));

    const classModels = declarations
      .filter((declaration) => declaration.kind !== "enum")
      .map((declaration) => ({
        name: declaration.name,
        kind: declaration.kind,
        nested: isNestedDeclaration(declaration, declarations),
        members: parseModelMembers(text, declaration, declarations, options),
        declaration,
      }));

    const modelsByName = new Map();
    const enumsByName = new Map();

    for (const model of classModels) {
      if (!modelsByName.has(model.name)) {
        modelsByName.set(model.name, model);
      }
    }

    for (const model of enumModels) {
      if (!enumsByName.has(model.name)) {
        enumsByName.set(model.name, model);
      }
    }

    const rootModel =
      classModels.find((model) => !model.nested) || classModels[0] || null;

    return {
      rootModel,
      models: classModels,
      enums: enumModels,
      modelsByName,
      enumsByName,
    };
  }

  function findTypeDeclarations(source, masked) {
    const declarations = [];
    const typePattern =
      /\b(?:(?:public|internal|private|protected|sealed|abstract|static|partial|readonly|file|new)\s+)*(record\s+class|record|class|enum)\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s*<[^>{}()]+>)?/g;
    let match;

    while ((match = typePattern.exec(masked)) !== null) {
      const kind = match[1].replace(/\s+/g, " ");
      const name = match[2];
      const start = match.index;
      const afterName = typePattern.lastIndex;
      const primaryParams = readPrimaryConstructorParams(source, masked, afterName);
      const openBrace = masked.indexOf("{", afterName);
      const semicolon = masked.indexOf(";", afterName);

      if (openBrace === -1 || (semicolon !== -1 && semicolon < openBrace)) {
        if (kind === "record" && primaryParams) {
          declarations.push({
            kind,
            name,
            start,
            body: "",
            bodyStart: afterName,
            bodyEnd: afterName,
            end: primaryParams.end,
            primaryParams: primaryParams.text,
          });
        }
        continue;
      }

      const closeBrace = findMatchingBrace(masked, openBrace);
      if (closeBrace === -1) {
        continue;
      }

      declarations.push({
        kind,
        name,
        start,
        body: source.slice(openBrace + 1, closeBrace),
        bodyStart: openBrace + 1,
        bodyEnd: closeBrace,
        end: closeBrace + 1,
        primaryParams: primaryParams ? primaryParams.text : "",
      });
    }

    return declarations.sort((left, right) => left.start - right.start);
  }

  function readPrimaryConstructorParams(source, masked, startIndex) {
    let cursor = startIndex;
    while (cursor < masked.length && /\s/.test(masked[cursor])) {
      cursor += 1;
    }

    if (masked[cursor] !== "(") {
      return null;
    }

    const end = findMatchingParen(masked, cursor);
    if (end === -1) {
      return null;
    }

    return {
      text: source.slice(cursor + 1, end),
      end: end + 1,
    };
  }

  function isNestedDeclaration(declaration, declarations) {
    return declarations.some(
      (candidate) =>
        candidate !== declaration &&
        candidate.kind !== "enum" &&
        declaration.start > candidate.bodyStart &&
        declaration.end < candidate.bodyEnd,
    );
  }

  function parseEnumValues(body) {
    return splitTopLevel(body, ",")
      .map((segment) => {
        const enumMemberValue = extractAttributeString(
          segment,
          "EnumMember",
          "Value",
        );
        const cleaned = segment.replace(/\[[\s\S]*?\]/g, "").trim();
        const match = cleaned.match(/^([A-Za-z_][A-Za-z0-9_]*)/);
        if (!match) {
          return null;
        }

        return enumMemberValue || match[1];
      })
      .filter(Boolean);
  }

  function parseModelMembers(source, declaration, declarations, options) {
    const members = [];
    const primaryMembers = parsePrimaryRecordMembers(declaration.primaryParams);
    const body = declaration.body || "";
    const localNestedRanges = declarations
      .filter(
        (candidate) =>
          candidate !== declaration &&
          candidate.start > declaration.bodyStart &&
          candidate.end < declaration.bodyEnd,
      )
      .map((candidate) => ({
        start: candidate.start - declaration.bodyStart,
        end: candidate.end - declaration.bodyStart,
      }));
    const bodyWithoutNested = blankRanges(body, localNestedRanges);

    for (const member of primaryMembers) {
      addMemberIfSupported(members, member, options);
    }

    const propertyPattern =
      /(?<prefix>(?:(?:\s*\/\/\/[^\r\n]*(?:\r?\n|$))|(?:\s*\[[^\]]+\]\s*))*?)\bpublic\s+(?!static\b)(?:(?:virtual|override|abstract|sealed|new|required|readonly|unsafe|partial)\s+)*(?<type>[A-Za-z_][A-Za-z0-9_.:]*(?:\s*<[^;{}]+>)?(?:\s*\[\])?\s*\??)\s+(?<name>[A-Za-z_][A-Za-z0-9_]*)\s*\{(?<accessors>[^{}]*)\}/g;
    let match;

    while ((match = propertyPattern.exec(bodyWithoutNested)) !== null) {
      const groups = match.groups || {};
      const prefix = groups.prefix || "";
      const accessors = groups.accessors || "";

      if (!hasPublicGetter(accessors) || hasAttribute(prefix, "JsonIgnore")) {
        continue;
      }

      addMemberIfSupported(
        members,
        {
          name: groups.name,
          type: groups.type,
          attributes: prefix,
          description: extractDescription(prefix),
        },
        options,
      );
    }

    if (options.includeFields) {
      parsePublicFields(bodyWithoutNested, members, options);
    }

    return members;
  }

  function parsePrimaryRecordMembers(primaryParams) {
    if (!primaryParams) {
      return [];
    }

    return splitTopLevel(primaryParams, ",")
      .map((segment) => {
        const withoutDefault = stripTopLevelAssignment(segment).trim();
        if (!withoutDefault) {
          return null;
        }

        const attributes = (withoutDefault.match(/\[[\s\S]*?\]/g) || []).join(
          "\n",
        );
        const cleaned = withoutDefault.replace(/\[[\s\S]*?\]/g, "").trim();
        const match = cleaned.match(/^(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)$/);
        if (!match) {
          return null;
        }

        return {
          name: match[2],
          type: match[1],
          attributes,
          description: extractDescription(attributes),
        };
      })
      .filter(Boolean);
  }

  function parsePublicFields(body, members, options) {
    const fieldPattern =
      /(?<prefix>(?:(?:\s*\/\/\/[^\r\n]*(?:\r?\n|$))|(?:\s*\[[^\]]+\]\s*))*?)\bpublic\s+(?!static\b)(?:(?:readonly|required|new)\s+)*(?<type>[A-Za-z_][A-Za-z0-9_.:]*(?:\s*<[^;{}]+>)?(?:\s*\[\])?\s*\??)\s+(?<name>[A-Za-z_][A-Za-z0-9_]*)\s*(?:=\s*[^;]+)?;/g;
    let match;

    while ((match = fieldPattern.exec(body)) !== null) {
      const groups = match.groups || {};
      const prefix = groups.prefix || "";
      if (hasAttribute(prefix, "JsonIgnore")) {
        continue;
      }

      addMemberIfSupported(
        members,
        {
          name: groups.name,
          type: groups.type,
          attributes: prefix,
          description: extractDescription(prefix),
        },
        options,
      );
    }
  }

  function addMemberIfSupported(members, member, options) {
    const jsonName =
      extractAttributeString(member.attributes, "JsonPropertyName") ||
      applyNamingPolicy(member.name, options.propertyNamingPolicy);

    members.push({
      name: member.name,
      jsonName,
      type: member.type.trim(),
      description: member.description || "",
    });
  }

  function hasPublicGetter(accessors) {
    if (!/\bget\s*;/.test(accessors)) {
      return false;
    }

    return !/\b(?:private|protected|internal)\s+get\s*;/.test(accessors);
  }

  function hasAttribute(text, attributeName) {
    const pattern = new RegExp(`\\b${attributeName}(?:Attribute)?\\b`);
    return pattern.test(text || "");
  }

  function extractDescription(prefix) {
    return (
      extractAttributeString(prefix, "Description") ||
      extractXmlSummary(prefix) ||
      ""
    );
  }

  function extractAttributeString(text, attributeName, namedArgument) {
    if (!text) {
      return "";
    }

    const attributePattern = new RegExp(
      `${attributeName}(?:Attribute)?\\s*\\(([^\\)]*)\\)`,
      "s",
    );
    const match = text.match(attributePattern);
    if (!match) {
      return "";
    }

    const args = match[1];
    let valuePattern;
    if (namedArgument) {
      valuePattern = new RegExp(
        `\\b${namedArgument}\\s*=\\s*\"((?:\\\\.|[^\"\\\\])*)\"`,
        "s",
      );
    } else {
      valuePattern = /"((?:\\.|[^"\\])*)"/s;
    }

    const valueMatch = args.match(valuePattern);
    return valueMatch ? unescapeCsharpString(valueMatch[1]) : "";
  }

  function extractXmlSummary(prefix) {
    const lines = String(prefix || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("///"))
      .map((line) => line.replace(/^\/\/\/\s?/, "").trim());

    if (lines.length === 0) {
      return "";
    }

    const joined = lines.join(" ");
    const summaryMatch = joined.match(/<summary>\s*([\s\S]*?)\s*<\/summary>/);
    return normalizeSpaces(summaryMatch ? summaryMatch[1] : joined);
  }

  function unescapeCsharpString(value) {
    return value
      .replace(/\\"/g, "\"")
      .replace(/\\\\/g, "\\")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t");
  }

  function applyNamingPolicy(name, policy) {
    if (policy !== "camelCase") {
      return name;
    }

    if (!name) {
      return name;
    }

    return name[0].toLowerCase() + name.slice(1);
  }

  function buildObjectSchema(model, context, path, depth) {
    context.maxDepth = Math.max(context.maxDepth, depth);

    if (depth > 5) {
      throw new SchemaConversionError(
        "ExceededNestingDepth",
        path,
        `Object nesting depth ${depth} exceeds the Azure OpenAI limit of 5.`,
      );
    }

    const properties = {};
    const required = [];
    const seenNames = new Map();

    for (const member of model.members) {
      if (seenNames.has(member.jsonName)) {
        throw new SchemaConversionError(
          "SerializationNameConflict",
          `${path}.${member.jsonName}`,
          `Members '${seenNames.get(member.jsonName)}' and '${member.name}' both serialize as '${member.jsonName}'.`,
        );
      }

      seenNames.set(member.jsonName, member.name);
      properties[member.jsonName] = buildSchemaForType(
        parseType(member.type),
        context,
        `${path}.${member.jsonName}`,
        depth + 1,
      );

      if (member.description) {
        properties[member.jsonName].description = member.description;
      }

      required.push(member.jsonName);
    }

    context.propertyCount += required.length;

    return {
      type: "object",
      properties,
      required,
      additionalProperties: false,
    };
  }

  function buildSchemaForType(parsedType, context, path, objectDepth) {
    const schema = buildNonNullableSchemaForType(
      parsedType,
      context,
      path,
      objectDepth,
    );

    return applyNullable(schema, parsedType.nullable);
  }

  function buildNonNullableSchemaForType(parsedType, context, path, objectDepth) {
    if (parsedType.kind === "array") {
      return {
        type: "array",
        items: buildSchemaForType(
          parsedType.element,
          context,
          `${path}[]`,
          objectDepth,
        ),
      };
    }

    if (parsedType.kind === "generic") {
      if (DICTIONARY_TYPES.has(parsedType.name)) {
        throw new SchemaConversionError(
          "UnsupportedDictionary",
          path,
          `${parsedType.raw} cannot be represented because Structured Outputs requires additionalProperties: false. Use a key-value array model instead.`,
        );
      }

      if (COLLECTION_TYPES.has(parsedType.name)) {
        return {
          type: "array",
          items: buildSchemaForType(
            parsedType.args[0],
            context,
            `${path}[]`,
            objectDepth,
          ),
        };
      }

      throw new SchemaConversionError(
        "UnsupportedType",
        path,
        `${parsedType.raw} is not a supported generic model type.`,
      );
    }

    const name = parsedType.name;
    if (UNSUPPORTED_TYPES.has(name)) {
      throw new SchemaConversionError(
        "UnsupportedType",
        path,
        `${parsedType.raw} is not supported. Use a concrete model type instead.`,
      );
    }

    if (name === "string") {
      return { type: "string" };
    }

    if (name === "char") {
      return {
        type: "string",
        description: "Single character string.",
      };
    }

    if (name === "bool" || name === "Boolean") {
      return { type: "boolean" };
    }

    if (INTEGER_TYPES.has(name)) {
      return { type: "integer" };
    }

    if (NUMBER_TYPES.has(name)) {
      return { type: "number" };
    }

    if (name === "Guid") {
      return {
        type: "string",
        description: "GUID string.",
      };
    }

    if (name === "DateTime") {
      return {
        type: "string",
        description: "Date and time string.",
      };
    }

    if (name === "DateTimeOffset") {
      return {
        type: "string",
        description: "Date and time with offset string.",
      };
    }

    if (name === "DateOnly") {
      return {
        type: "string",
        description: "Date string.",
      };
    }

    if (name === "TimeOnly") {
      return {
        type: "string",
        description: "Time string.",
      };
    }

    if (name === "TimeSpan") {
      return {
        type: "string",
        description: "Time span string.",
      };
    }

    if (context.enumsByName.has(name)) {
      return {
        type: "string",
        enum: context.enumsByName.get(name).values,
      };
    }

    if (context.modelsByName.has(name)) {
      if (name === context.rootName) {
        return { $ref: "#" };
      }

      ensureDefinition(name, context, path, objectDepth);
      return { $ref: `#/$defs/${name}` };
    }

    throw new SchemaConversionError(
      "UnsupportedType",
      path,
      `${parsedType.raw} is not supported by the converter.`,
    );
  }

  function ensureDefinition(typeName, context, path, depth) {
    context.maxDepth = Math.max(context.maxDepth, depth);

    if (depth > 5) {
      throw new SchemaConversionError(
        "ExceededNestingDepth",
        path,
        `Object nesting depth ${depth} exceeds the Azure OpenAI limit of 5.`,
      );
    }

    if (context.builtDefs.has(typeName) || context.buildingDefs.has(typeName)) {
      return;
    }

    const model = context.modelsByName.get(typeName);
    if (!model) {
      throw new SchemaConversionError(
        "UnsupportedType",
        path,
        `${typeName} could not be resolved to a model type.`,
      );
    }

    context.buildingDefs.add(typeName);
    context.defs[typeName] = buildObjectSchema(model, context, path, depth);
    context.buildingDefs.delete(typeName);
    context.builtDefs.add(typeName);
  }

  function applyNullable(schema, nullable) {
    if (!nullable) {
      return schema;
    }

    if (schema.type === "string" && Array.isArray(schema.enum)) {
      return Object.assign({}, schema, {
        type: ["string", "null"],
        enum: schema.enum.concat([null]),
      });
    }

    if (
      schema.type === "string" ||
      schema.type === "number" ||
      schema.type === "integer" ||
      schema.type === "boolean"
    ) {
      return Object.assign({}, schema, {
        type: [schema.type, "null"],
      });
    }

    return {
      anyOf: [schema, { type: "null" }],
    };
  }

  function parseType(typeText) {
    let text = normalizeTypeText(typeText);
    let nullable = false;

    while (text.endsWith("?")) {
      nullable = true;
      text = text.slice(0, -1).trim();
    }

    if (text.endsWith("[]")) {
      return {
        kind: "array",
        raw: typeText.trim(),
        nullable,
        element: parseType(text.slice(0, -2)),
      };
    }

    const generic = parseGenericType(text);
    if (generic) {
      if (generic.name === "Nullable" && generic.args.length === 1) {
        const innerType = parseType(generic.args[0]);
        innerType.nullable = true;
        innerType.raw = typeText.trim();
        return innerType;
      }

      return {
        kind: "generic",
        raw: typeText.trim(),
        nullable,
        name: getSimpleTypeName(generic.name),
        args: generic.args.map((arg) => parseType(arg)),
      };
    }

    return {
      kind: "named",
      raw: typeText.trim(),
      nullable,
      name: getSimpleTypeName(text),
    };
  }

  function normalizeTypeText(typeText) {
    return String(typeText || "")
      .replace(/\bglobal::/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseGenericType(typeText) {
    const open = typeText.indexOf("<");
    if (open === -1 || !typeText.endsWith(">")) {
      return null;
    }

    const close = findMatchingAngle(typeText, open);
    if (close !== typeText.length - 1) {
      return null;
    }

    return {
      name: typeText.slice(0, open).trim(),
      args: splitTopLevel(typeText.slice(open + 1, close), ",").map((arg) =>
        arg.trim(),
      ),
    };
  }

  function getSimpleTypeName(name) {
    const withoutNullableAnnotation = name.replace(/\?$/, "");
    const parts = withoutNullableAnnotation.split(".");
    return parts[parts.length - 1];
  }

  function validateSchemaSubset(schema) {
    if (schema.anyOf) {
      throw new SchemaConversionError(
        "RootAnyOfNotAllowed",
        "$",
        "Root schema cannot be anyOf.",
      );
    }

    if (schema.type !== "object") {
      throw new SchemaConversionError(
        "RootMustBeObject",
        "$",
        "Root schema must be an object.",
      );
    }

    const defs = schema.$defs || {};
    walkSchema(schema, "$", defs);
  }

  function walkSchema(schema, path, defs) {
    if (!schema || typeof schema !== "object") {
      return;
    }

    for (const key of Object.keys(schema)) {
      if (!ALLOWED_SCHEMA_KEYS.has(key)) {
        throw new SchemaConversionError(
          "UnsupportedKeywordGenerated",
          path,
          `Generated unsupported JSON Schema keyword '${key}'.`,
        );
      }
    }

    if (schema.$ref) {
      validateReference(schema.$ref, path, defs);
      return;
    }

    validateTypeValue(schema.type, path);

    if (schema.type === "object") {
      if (schema.additionalProperties !== false) {
        throw new SchemaConversionError(
          "MissingAdditionalPropertiesFalse",
          path,
          "Every object schema must set additionalProperties: false.",
        );
      }

      const propertyNames = Object.keys(schema.properties || {});
      const required = schema.required || [];
      const missing = propertyNames.filter((name) => !required.includes(name));
      const extra = required.filter((name) => !propertyNames.includes(name));
      if (missing.length > 0 || extra.length > 0) {
        throw new SchemaConversionError(
          "RequiredNotComplete",
          path,
          "Every object schema must include every property key in required.",
        );
      }

      for (const propertyName of propertyNames) {
        walkSchema(schema.properties[propertyName], `${path}.${propertyName}`, defs);
      }
    }

    if (schema.items) {
      walkSchema(schema.items, `${path}[]`, defs);
    }

    if (Array.isArray(schema.anyOf)) {
      schema.anyOf.forEach((branch, index) => {
        walkSchema(branch, `${path}.anyOf[${index}]`, defs);
      });
    }

    if (schema.$defs) {
      for (const [name, definition] of Object.entries(schema.$defs)) {
        walkSchema(definition, `#/$defs/${name}`, defs);
      }
    }
  }

  function validateTypeValue(typeValue, path) {
    if (typeValue === undefined) {
      return;
    }

    if (Array.isArray(typeValue)) {
      for (const value of typeValue) {
        if (!ALLOWED_TYPES.has(value)) {
          throwUnsupportedTypeValue(path, value);
        }
      }
      return;
    }

    if (!ALLOWED_TYPES.has(typeValue)) {
      throwUnsupportedTypeValue(path, typeValue);
    }
  }

  function throwUnsupportedTypeValue(path, value) {
    throw new SchemaConversionError(
      "UnsupportedType",
      path,
      `Generated unsupported JSON Schema type '${value}'.`,
    );
  }

  function validateReference(ref, path, defs) {
    if (ref === "#") {
      return;
    }

    if (!ref.startsWith("#/$defs/")) {
      throw new SchemaConversionError(
        "UnresolvedReference",
        path,
        `Reference '${ref}' is not a supported local definition reference.`,
      );
    }

    const name = ref.slice("#/$defs/".length);
    if (!Object.prototype.hasOwnProperty.call(defs, name)) {
      throw new SchemaConversionError(
        "UnresolvedReference",
        path,
        `Reference '${ref}' could not be resolved.`,
      );
    }
  }

  function maskCommentsAndStrings(source) {
    let output = "";
    let index = 0;

    while (index < source.length) {
      const char = source[index];
      const next = source[index + 1];

      if (char === "/" && next === "/") {
        const end = source.indexOf("\n", index + 2);
        if (end === -1) {
          output += " ".repeat(source.length - index);
          break;
        }
        output += " ".repeat(end - index) + "\n";
        index = end + 1;
        continue;
      }

      if (char === "/" && next === "*") {
        const end = source.indexOf("*/", index + 2);
        const stop = end === -1 ? source.length : end + 2;
        output += source
          .slice(index, stop)
          .replace(/[^\r\n]/g, " ");
        index = stop;
        continue;
      }

      if (char === "@" && next === "\"") {
        const end = readVerbatimStringEnd(source, index + 2);
        output += " ".repeat(end - index);
        index = end;
        continue;
      }

      if (char === "\"") {
        const end = readStringEnd(source, index + 1);
        output += " ".repeat(end - index);
        index = end;
        continue;
      }

      output += char;
      index += 1;
    }

    return output;
  }

  function readStringEnd(source, index) {
    let escaped = false;
    while (index < source.length) {
      const char = source[index];
      if (!escaped && char === "\"") {
        return index + 1;
      }
      escaped = !escaped && char === "\\";
      if (char !== "\\") {
        escaped = false;
      }
      index += 1;
    }
    return source.length;
  }

  function readVerbatimStringEnd(source, index) {
    while (index < source.length) {
      if (source[index] === "\"" && source[index + 1] === "\"") {
        index += 2;
        continue;
      }
      if (source[index] === "\"") {
        return index + 1;
      }
      index += 1;
    }
    return source.length;
  }

  function findMatchingBrace(text, openIndex) {
    return findMatchingPair(text, openIndex, "{", "}");
  }

  function findMatchingParen(text, openIndex) {
    return findMatchingPair(text, openIndex, "(", ")");
  }

  function findMatchingAngle(text, openIndex) {
    return findMatchingPair(text, openIndex, "<", ">");
  }

  function findMatchingPair(text, openIndex, openChar, closeChar) {
    let depth = 0;
    for (let index = openIndex; index < text.length; index += 1) {
      if (text[index] === openChar) {
        depth += 1;
      } else if (text[index] === closeChar) {
        depth -= 1;
        if (depth === 0) {
          return index;
        }
      }
    }
    return -1;
  }

  function splitTopLevel(text, delimiter) {
    const parts = [];
    let depthAngle = 0;
    let depthParen = 0;
    let depthBracket = 0;
    let start = 0;
    let index = 0;
    let inString = false;
    let escaped = false;

    while (index < text.length) {
      const char = text[index];

      if (inString) {
        if (!escaped && char === "\"") {
          inString = false;
        }
        escaped = !escaped && char === "\\";
        if (char !== "\\") {
          escaped = false;
        }
        index += 1;
        continue;
      }

      if (char === "\"") {
        inString = true;
      } else if (char === "<") {
        depthAngle += 1;
      } else if (char === ">") {
        depthAngle -= 1;
      } else if (char === "(") {
        depthParen += 1;
      } else if (char === ")") {
        depthParen -= 1;
      } else if (char === "[") {
        depthBracket += 1;
      } else if (char === "]") {
        depthBracket -= 1;
      } else if (
        char === delimiter &&
        depthAngle === 0 &&
        depthParen === 0 &&
        depthBracket === 0
      ) {
        parts.push(text.slice(start, index));
        start = index + 1;
      }

      index += 1;
    }

    parts.push(text.slice(start));
    return parts;
  }

  function stripTopLevelAssignment(text) {
    let depthAngle = 0;
    let depthParen = 0;
    let depthBracket = 0;
    let inString = false;
    let escaped = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];

      if (inString) {
        if (!escaped && char === "\"") {
          inString = false;
        }
        escaped = !escaped && char === "\\";
        if (char !== "\\") {
          escaped = false;
        }
        continue;
      }

      if (char === "\"") {
        inString = true;
      } else if (char === "<") {
        depthAngle += 1;
      } else if (char === ">") {
        depthAngle -= 1;
      } else if (char === "(") {
        depthParen += 1;
      } else if (char === ")") {
        depthParen -= 1;
      } else if (char === "[") {
        depthBracket += 1;
      } else if (char === "]") {
        depthBracket -= 1;
      } else if (
        char === "=" &&
        depthAngle === 0 &&
        depthParen === 0 &&
        depthBracket === 0
      ) {
        return text.slice(0, index);
      }
    }

    return text;
  }

  function blankRanges(text, ranges) {
    if (!ranges.length) {
      return text;
    }

    const chars = text.split("");
    for (const range of ranges) {
      for (
        let index = Math.max(0, range.start);
        index < Math.min(chars.length, range.end);
        index += 1
      ) {
        chars[index] = chars[index] === "\n" || chars[index] === "\r"
          ? chars[index]
          : " ";
      }
    }
    return chars.join("");
  }

  function normalizeSpaces(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function formatSchema(schema) {
    return JSON.stringify(schema, null, 2);
  }

  function highlightCsharp(source) {
    return highlightWithPattern(
      source,
      CSHARP_TOKEN_PATTERN,
      classifyCsharpToken,
    );
  }

  function highlightJson(source) {
    return highlightWithPattern(source, JSON_TOKEN_PATTERN, classifyJsonToken);
  }

  function highlightWithPattern(source, pattern, classifyToken) {
    const text = String(source || "");
    let html = "";
    let cursor = 0;
    pattern.lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
      const token = match[0];
      const index = match.index || 0;
      html += escapeHtml(text.slice(cursor, index));

      const tokenClass = classifyToken(token, match, text);
      if (tokenClass) {
        html += `<span class="token ${tokenClass}">${escapeHtml(token)}</span>`;
      } else {
        html += escapeHtml(token);
      }

      cursor = index + token.length;
    }

    html += escapeHtml(text.slice(cursor));
    return html || " ";
  }

  function classifyCsharpToken(token) {
    if (token.startsWith("//") || token.startsWith("/*")) {
      return "comment";
    }

    if (
      token.startsWith("\"") ||
      token.startsWith("@\"") ||
      token.startsWith("'")
    ) {
      return "string";
    }

    if (/^\d/.test(token)) {
      return "number";
    }

    if (CSHARP_KEYWORDS.has(token)) {
      return "keyword";
    }

    if (CSHARP_BUILTIN_TYPES.has(token)) {
      return "type";
    }

    if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
      return "type";
    }

    if (/^[{}()[\];,.<>?=:+*/-]$/.test(token)) {
      return "punctuation";
    }

    return "";
  }

  function classifyJsonToken(token, match, source) {
    if (token.startsWith("\"")) {
      const nextText = source.slice((match.index || 0) + token.length);
      return /^\s*:/.test(nextText) ? "key" : "string";
    }

    if (/^-?\d/.test(token)) {
      return "number";
    }

    if (token === "true" || token === "false" || token === "null") {
      return "literal";
    }

    return "punctuation";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const api = {
    SchemaConversionError,
    convertCsharpToJsonSchema,
    formatSchema,
    highlightCsharp,
    highlightJson,
    parseCsharpSource,
    parseType,
    DEFAULT_SAMPLE,
    EMPTY_OUTPUT,
  };

  globalScope.CsharpSchemaConverter = api;

  if (!globalScope.document || !globalScope.customElements) {
    return api;
  }

  const template = document.createElement("template");

  template.innerHTML = `
    <style>
      :host {
        display: block;
      }

      .converter {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 20px;
        align-items: stretch;
      }

      .pane {
        min-width: 0;
      }

      label {
        display: block;
        margin: 0 0 8px;
        // color: #354258;
        font-size: 0.92rem;
        font-weight: 680;
      }

      .editor-shell,
      .output-shell {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        min-height: 560px;
        margin: 0;
        border: 1px solid #c8d0dd;
        border-radius: 8px;
        background: #ffffff;
        color: #172033;
        font: 0.92rem/1.52 "Cascadia Code", "Fira Code", Consolas, monospace;
        overflow: hidden;
      }

      .editor-shell {
        height: 560px;
        resize: vertical;
      }

      .editor-shell:focus-within {
        border-color: #2f6feb;
        box-shadow: 0 0 0 3px rgba(47, 111, 235, 0.15);
      }

      textarea,
      pre {
        font: inherit;
        tab-size: 2;
      }

      textarea,
      .highlight-layer {
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        border: 0;
        padding: 16px;
        white-space: pre;
        overflow: auto;
      }

      textarea {
        z-index: 1;
        display: block;
        background: transparent;
        color: transparent;
        caret-color: #172033;
        outline: none;
        resize: none;
      }

      textarea::selection {
        background: rgba(47, 111, 235, 0.24);
        color: transparent;
      }

      .highlight-layer {
        z-index: 0;
        pointer-events: none;
        scrollbar-width: none;
      }

      .highlight-layer::-webkit-scrollbar {
        display: none;
      }

      #output {
        box-sizing: border-box;
        width: 100%;
        min-height: inherit;
        margin: 0;
        border: 0;
        background: transparent;
        color: #172033;
        overflow: auto;
        padding: 48px 16px 16px;
        white-space: pre;
      }

      .token.keyword {
        color: #7a3fb0;
        font-weight: 700;
      }

      .token.type {
        color: #1558a6;
      }

      .token.string {
        color: #176844;
      }

      .token.number,
      .token.literal {
        color: #9a4d00;
      }

      .token.comment {
        color: #687385;
        font-style: italic;
      }

      .token.key {
        color: #0f6a78;
      }

      .token.punctuation {
        color: #59657a;
      }

      button {
        position: absolute;
        top: 10px;
        right: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 38px;
        height: 34px;
        border: 1px solid #bac5d5;
        border-radius: 7px;
        background: #eef3fa;
        color: #1f2c3f;
        cursor: pointer;
      }

      button:hover {
        background: #e2eaf5;
      }

      button[disabled] {
        cursor: not-allowed;
        opacity: 0.52;
      }

      button[data-copied="true"] {
        border-color: #1f8f5f;
        background: #e6f6ee;
        color: #176844;
      }

      button:focus-visible {
        outline: 3px solid rgba(47, 111, 235, 0.25);
        outline-offset: 2px;
      }

      .output-shell[data-state="error"] {
        border-color: #d45142;
        background: #fff7f5;
        color: #5b1d16;
      }

      .output-shell[data-state="error"] #output,
      .output-shell[data-state="error"] .token {
        color: #5b1d16;
      }

      svg {
        width: 17px;
        height: 17px;
      }

      @media (max-width: 860px) {
        .converter {
          grid-template-columns: 1fr;
        }

        .editor-shell,
        .output-shell {
          min-height: 420px;
          height: 420px;
        }

        .output-shell {
          height: auto;
        }
      }
    </style>

    <section class="converter">
      <div class="pane">
        <label for="source">Input: C# Class</label>
        <div class="editor-shell">
          <pre id="source-highlight" class="highlight-layer" aria-hidden="true"></pre>
          <textarea id="source" spellcheck="false" wrap="off"></textarea>
        </div>
      </div>
      <div class="pane">
        <label for="output">Output: JSON Schema</label>
        <div class="output-shell">
          <button type="button" title="Copy JSON Schema" aria-label="Copy JSON Schema">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            </svg>
          </button>
          <pre id="output">Paste a C# class to generate JSON Schema.</pre>
        </div>
      </div>
    </section>
  `;

  class CsharpJsonSchemaConverter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
      this.currentSchemaText = "";
      this.copyTimer = 0;
      this.handleInput = this.handleInput.bind(this);
      this.handleCopy = this.handleCopy.bind(this);
      this.handleSourceScroll = this.handleSourceScroll.bind(this);
    }

    connectedCallback() {
      this.source = this.shadowRoot.getElementById("source");
      this.sourceHighlight = this.shadowRoot.getElementById("source-highlight");
      this.output = this.shadowRoot.getElementById("output");
      this.outputShell = this.shadowRoot.querySelector(".output-shell");
      this.copyButton = this.shadowRoot.querySelector("button");

      if (!this.source.value.trim()) {
        this.source.value = this.getAttribute("value") || DEFAULT_SAMPLE;
      }

      this.source.addEventListener("input", this.handleInput);
      this.source.addEventListener("scroll", this.handleSourceScroll);
      this.copyButton.addEventListener("click", this.handleCopy);
      this.updateInputHighlight();
      this.updateSchema();
    }

    disconnectedCallback() {
      this.source.removeEventListener("input", this.handleInput);
      this.source.removeEventListener("scroll", this.handleSourceScroll);
      this.copyButton.removeEventListener("click", this.handleCopy);
      clearTimeout(this.copyTimer);
    }

    handleInput() {
      this.updateInputHighlight();
      this.updateSchema();
    }

    handleSourceScroll() {
      this.sourceHighlight.scrollTop = this.source.scrollTop;
      this.sourceHighlight.scrollLeft = this.source.scrollLeft;
    }

    updateInputHighlight() {
      this.sourceHighlight.innerHTML = `${highlightCsharp(this.source.value)}\n`;
      this.handleSourceScroll();
    }

    updateSchema() {
      const input = this.source.value.trim();

      if (!input) {
        this.currentSchemaText = "";
        this.output.textContent = EMPTY_OUTPUT;
        this.outputShell.dataset.state = "empty";
        this.copyButton.disabled = true;
        return;
      }

      try {
        const schema = convertCsharpToJsonSchema(input);
        this.currentSchemaText = formatSchema(schema);
        this.output.innerHTML = highlightJson(this.currentSchemaText);
        this.outputShell.dataset.state = "ready";
        this.copyButton.disabled = false;
      } catch (error) {
        const errorText = formatSchema(formatConversionError(error));
        this.currentSchemaText = "";
        this.output.innerHTML = highlightJson(errorText);
        this.outputShell.dataset.state = "error";
        this.copyButton.disabled = true;
      }
    }

    async handleCopy() {
      if (!this.currentSchemaText) {
        return;
      }

      await copyText(this.currentSchemaText);
      this.markCopied();
    }

    markCopied() {
      this.copyButton.dataset.copied = "true";
      this.copyButton.title = "Copied";
      this.copyButton.setAttribute("aria-label", "Copied");
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copyButton.dataset.copied = "false";
        this.copyButton.title = "Copy JSON Schema";
        this.copyButton.setAttribute("aria-label", "Copy JSON Schema");
      }, 1500);
    }
  }

  function formatConversionError(error) {
    if (error instanceof SchemaConversionError) {
      return {
        code: error.code,
        path: error.path,
        message: error.message,
      };
    }

    return {
      code: "UnexpectedError",
      path: "$",
      message: error && error.message
        ? error.message
        : "Unexpected conversion failure.",
    };
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  if (!globalScope.customElements.get("csharp-json-schema-converter")) {
    globalScope.customElements.define(
      "csharp-json-schema-converter",
      CsharpJsonSchemaConverter,
    );
  }
  return api;
})(typeof window !== "undefined" ? window : globalThis);

export const {
  SchemaConversionError,
  convertCsharpToJsonSchema,
  formatSchema,
  highlightCsharp,
  highlightJson,
  parseCsharpSource,
  parseType,
  DEFAULT_SAMPLE,
  EMPTY_OUTPUT,
} = CsharpSchemaConverterApi;

export default CsharpSchemaConverterApi;
