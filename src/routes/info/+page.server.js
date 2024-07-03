import { PUBLIC_API_KEY } from '$env/static/public';
import { fail } from "@sveltejs/kit";
import { request as graphqlRequest } from "graphql-request";
import { gql } from "graphql-request";
import { hygraph } from "$lib/utils/hygraph.js";
 

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const vraag = formData.get("vraag");

        if (!name || !email || !vraag) {
            return fail(400, {
                error: "Vul alle vereiste velden in.",
                values: { name, email, vraag },
            });
        }

        const mutation = `
        mutation {
            createContact(data: { name: "${name}", email: "${email}", vraag: "${vraag}" }) {
                name
                email
                vraag
            }
        }
        `;

        const endpoint = "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clbe0zp4u2fkz01uj486xdza4/master";
        const HYGRAPH_TOKEN = import.meta.env.VITE_HYGRAPH_KEY;
        const headers = {
            Authorization: `Bearer ${HYGRAPH_TOKEN}`,
        };

        try {
            const postData = await graphqlRequest(endpoint, mutation, undefined, headers);
            return { success: true, data: { message: "Verzonden!" } };
        } catch (err) {
            return fail(500, {
                error: "Er is een fout opgetreden. Probeert u het alstublieft opnieuw.",
                values: { name, email, vraag },
            });
        }
    },
};