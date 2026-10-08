// URL-scheme allowlist for fields that may render as href/src.
// Allows: relative paths starting with '/', http:, https:, and (optionally) mailto:.
// Rejects everything else (javascript:, data:, vbscript:, protocol-relative '//', ...).
export function safeUrl(value, { allowMailto = false } = {}) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.startsWith('/')) {
    // '//' is protocol-relative; '/\' is treated the same by browser URL parsers.
    if (trimmed[1] === '/' || trimmed[1] === '\\') return null;
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (allowMailto && /^mailto:/i.test(trimmed)) return trimmed;
  return null;
}
