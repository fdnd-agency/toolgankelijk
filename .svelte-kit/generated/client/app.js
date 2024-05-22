export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~3],
		"/account": [8],
		"/addPartner": [~9],
		"/info": [~10],
		"/login": [11],
		"/[websiteUID]": [~4,[2]],
		"/[websiteUID]/addUrl": [~7,[2]],
		"/[websiteUID]/[urlUID]": [~5,[2]],
		"/[websiteUID]/[urlUID]/[principeUID]": [~6,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';