/**
 * Per-platform CSV export formats for major microstock sites.
 * Headers, column order and separators follow each platform's official
 * upload-metadata template (ported from CSV Tree).
 */

export interface PlatformFormat {
  id: string;
  name: string;
  description: string;
  headers: string[];
  separator: string;
  fields: CsvField[];
}

export type CsvField =
  | "filename"
  | "title"
  | "description"
  | "keywords"
  | "category"
  | "prompt"
  | "baseModel";

export const PLATFORMS: PlatformFormat[] = [
  {
    id: "general",
    name: "General",
    description: "Standard 5-column metadata.",
    headers: ["Filename", "Title", "Description", "Keywords", "Category"],
    separator: ",",
    fields: ["filename", "title", "description", "keywords", "category"],
  },
  {
    id: "adobestock",
    name: "Adobe Stock",
    description: "Filename, Title, Keywords, Category.",
    headers: ["Filename", "Title", "Keywords", "Category"],
    separator: ",",
    fields: ["filename", "title", "keywords", "category"],
  },
  {
    id: "shutterstock",
    name: "Shutterstock",
    description: "Filename, Description, Keywords (description doubles as title).",
    headers: ["Filename", "Description", "Keywords"],
    separator: ",",
    fields: ["filename", "description", "keywords"],
  },
  {
    id: "freepik",
    name: "Magnific (freepik)",
    description: "Semicolon-delimited; includes Prompt + Base-Model columns.",
    headers: ["File name", "Title", "Keywords", "Prompt", "Base-Model"],
    separator: ";",
    fields: ["filename", "title", "keywords", "prompt", "baseModel"],
  },
  {
    id: "vecteezy",
    name: "Vecteezy",
    description: "Standard 4-column metadata.",
    headers: ["Filename", "Title", "Description", "Keywords"],
    separator: ",",
    fields: ["filename", "title", "description", "keywords"],
  },
  {
    id: "123rf",
    name: "123RF",
    description: "Standard 4-column metadata.",
    headers: ["Filename", "Title", "Description", "Keywords"],
    separator: ",",
    fields: ["filename", "title", "description", "keywords"],
  },
  {
    id: "dreamstime",
    name: "Dreamstime",
    description: "Standard 4-column metadata.",
    headers: ["Filename", "Title", "Description", "Keywords"],
    separator: ",",
    fields: ["filename", "title", "description", "keywords"],
  },
  {
    id: "depositphotos",
    name: "Depositphotos",
    description: "Standard 4-column metadata.",
    headers: ["Filename", "Title", "Description", "Keywords"],
    separator: ",",
    fields: ["filename", "title", "description", "keywords"],
  },
  {
    id: "pond5",
    name: "Pond5",
    description: "Standard metadata for Pond5 footage.",
    headers: ["Filename", "Title", "Description", "Keywords"],
    separator: ",",
    fields: ["filename", "title", "description", "keywords"],
  },
];

export function getPlatform(id: string): PlatformFormat {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

export interface CsvRow {
  filename: string;
  title?: string;
  description?: string;
  keywords?: string[];
  category?: string;
  prompt?: string;
  baseModel?: string;
}

/** Replace/add a filename extension (no dot), e.g. 'eps'. */
export function changeExtension(filename: string, target: string): string {
  if (!filename || !target) return filename;
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  return `${stem}.${target}`;
}

function quote(value: string): string {
  return `"${(value ?? "").toString().replace(/"/g, '""')}"`;
}

function valueFor(field: CsvField, row: CsvRow, exportExt: string): string {
  switch (field) {
    case "filename":
      return exportExt ? changeExtension(row.filename || "", exportExt) : row.filename || "";
    case "title":
      return row.title || "";
    case "description":
      return row.description || "";
    case "keywords":
      return Array.isArray(row.keywords) ? row.keywords.join(",") : row.keywords || "";
    case "category":
      return row.category || "";
    case "prompt":
      return row.prompt || "";
    case "baseModel":
      return row.baseModel || "";
    default:
      return "";
  }
}

export function buildCSV(platformId: string, rows: CsvRow[], options?: { exportExt?: string }): string {
  const platform = getPlatform(platformId);
  const sep = platform.separator;
  const ext = options?.exportExt || "";
  const headerLine = platform.headers.map(quote).join(sep);
  const dataLines = (rows || []).map((row) =>
    platform.fields.map((f) => quote(valueFor(f, row, ext))).join(sep)
  );
  return [headerLine, ...dataLines].join("\r\n");
}

/** Plain text of all prompts separated by blank lines (CSV Tree parity). */
export function buildPromptTxt(rows: CsvRow[]): string {
  return (rows || [])
    .map((r) => r.prompt || r.title || "")
    .map((s) => s.replace(/^\s*(prompt|description|title)\s*:\s*/i, "").trim())
    .filter(Boolean)
    .join("\n\n");
}

/** One prompt per CSV row with blank rows between (CSV Tree parity). */
export function buildPromptCsv(rows: CsvRow[]): string {
  const lines = (rows || [])
    .map((r) => r.prompt || r.title || "")
    .map((s) => s.replace(/^\s*(prompt|description|title)\s*:\s*/i, "").trim())
    .filter(Boolean);
  return lines
    .flatMap((line, i) => (i === lines.length - 1 ? [line] : [line, ""]))
    .join("\r\n");
}

export function buildJSON(rows: CsvRow[]): string {
  return JSON.stringify(
    (rows || []).map((row) => ({
      filename: row.filename,
      title: row.title,
      description: row.description,
      keywords: Array.isArray(row.keywords) ? row.keywords.join(", ") : row.keywords,
      category: row.category,
      ...(row.prompt ? { prompt: row.prompt } : {}),
      ...(row.baseModel ? { baseModel: row.baseModel } : {}),
    })),
    null,
    2
  );
}

export function buildTXT(rows: CsvRow[]): string {
  return (rows || [])
    .map((row) =>
      [
        `File: ${row.filename}`,
        `Title: ${row.title}`,
        `Description: ${row.description}`,
        `Keywords: ${Array.isArray(row.keywords) ? row.keywords.join(", ") : row.keywords}`,
        row.category ? `Category: ${row.category}` : "",
        row.prompt ? `Prompt: ${row.prompt}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}
