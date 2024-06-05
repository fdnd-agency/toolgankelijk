import { PUBLIC_API_KEY } from '$env/static/public';
import { fail } from "@sveltejs/kit";
import { request as graphqlRequest } from "graphql-request";
import { gql } from "graphql-request";
import { hygraph } from "$lib/utils/hygraph.js";
 
export const prerender = false;
 
// Data naar Hygraph sturen
export const actions = {
    default: async ({ request, url }) => {
 
        const formData = await request.formData();
 
        let name = formData.get("name");
        let email = formData.get("email");
        let vraag = formData.get("vraag");
        // Maak nieuwe content aan voor Hygraph
        const mutation = `
        mutation {
            createContact(data: { name: "${name}", email: "${email}", vraag: "${vraag}" }) {
                name
                email
                vraag
            }
        }
        `;
 
        // Hygraph url
        const endpoint =
            "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clbe0zp4u2fkz01uj486xdza4/master";
 
        // Hygraph autorisatie
        const HYGRAPH_TOKEN = import.meta.env.HYGRAPH_KEY;
        const headers = {
            Authorization: `Bearer ${HYGRAPH_TOKEN}`,
        };
 
        // Voer de mutatie uit
        const postData = await graphqlRequest(
            endpoint,
            mutation,
            undefined,
            headers
        );
        return { success: true, postData };
    },
};