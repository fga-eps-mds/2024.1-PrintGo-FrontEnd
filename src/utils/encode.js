export default function encodeSpecialChars(originalString) {
  return originalString.replace('/', '%2F');
}