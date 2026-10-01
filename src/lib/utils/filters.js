/**
 * Builds a filter for the subheader from the url search params.
 * Only values that exist in the options are accepted, anything else falls back to the first option.
 * The load function of a page returns these filters, the subheader shows them as selects in a GET form.
 *
 * @param {URL} url
 * @param {{ name: string, label: string, options: { value: string, label: string }[] }} filter
 * @returns {{ name: string, label: string, options: { value: string, label: string }[], value: string }}
 */
export function createFilter(url, { name, label, options }) {
	const requested = url.searchParams.get(name);
	const value = options.some((option) => option.value === requested)
		? requested
		: options[0]?.value ?? '';

	return { name, label, options, value };
}

/**
 * Sorts items alphabetically on a text field, `z-a` reverses the order.
 *
 * @template T
 * @param {T[]} items
 * @param {string} field
 * @param {string} order `a-z` or `z-a`
 * @returns {T[]}
 */
export function sortByText(items = [], field, order) {
	const sorted = [...items].sort((a, b) =>
		String(a?.[field] ?? '').localeCompare(String(b?.[field] ?? ''), 'nl')
	);
	return order === 'z-a' ? sorted.reverse() : sorted;
}

export const sortOptions = [
	{ value: 'a-z', label: 'A-Z' },
	{ value: 'z-a', label: 'Z-A' }
];
