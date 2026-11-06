const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const LENGTH = 6;

export function makeRespondentCode(bytes: Uint8Array = crypto.getRandomValues(new Uint8Array(LENGTH))) {
  return `R-${Array.from(bytes.slice(0, LENGTH), (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}
