export default function getQueryNiveaus() {
	return `
		query Levels {
			toolgankelijk_level {
				id
				level
				slug
			}
		}
	`;
}
