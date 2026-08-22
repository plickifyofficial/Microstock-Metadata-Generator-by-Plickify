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
  | "category";

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
    description: "Filename, Title, Keywords, Category (no description column).",
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
    name: "Freepik",
    description: "Standard metadata columns for Freepik uploads.",
    headers: ["File name", "Title", "Keywords", "Category"],
    separator: ";",
    fields: ["filename", "title", "keywords", "category"],
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
    description: "Standard 4-column metadata for Pond5 footage.",
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
}

function quote(value: string): string {
  return `"${(value ?? "").toString().replace(/"/g, '""')}"`;
}

function valueFor(field: CsvField, row: CsvRow): string {
  switch (field) {
    case "filename":
      return row.filename || "";
    case "title":
      return row.title || "";
    case "description":
      return row.description || "";
    case "keywords":
      return Array.isArray(row.keywords) ? row.keywords.join(",") : row.keywords || "";
    case "category":
      return row.category || "";
    default:
      return "";
  }
}

export function buildCSV(platformId: string, rows: CsvRow[]): string {
  const platform = getPlatform(platformId);
  const sep = platform.separator;
  const headerLine = platform.headers.map(quote).join(sep);
  const dataLines = (rows || [])
    .map((row) => platform.fields.map((f) => quote(valueFor(f, row))).join(sep));
  return [headerLine, ...dataLines].join("\r\n");
}

export function buildJSON(rows: CsvRow[]): string {
  return JSON.stringify(
    (rows || []).map((row) => ({
      filename: row.filename,
      title: row.title,
      description: row.description,
      keywords: Array.isArray(row.keywords)
        ? row.keywords.join(", ")
        : row.keywords,
      category: row.category,
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
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}
