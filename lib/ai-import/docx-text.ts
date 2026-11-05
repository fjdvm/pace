import mammoth from "mammoth";

export async function docxToText(data: Buffer) {
  const { value } = await mammoth.extractRawText({ buffer: data });
  return value.trim();
}
