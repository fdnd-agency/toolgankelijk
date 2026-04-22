/**
 * Normalize and validate an absolute http(s) URL.
 *
 * @param {unknown} value
 * @returns {string | null}
 */
export function normalizeHttpUrl(value) {
	if (typeof value !== 'string') return null;
	const candidate = value.trim();
	if (!candidate) return null;

	try {
		const parsed = new URL(candidate);
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
			return null;
		}
		return parsed.href;
	} catch {
		return null;
	}
}
