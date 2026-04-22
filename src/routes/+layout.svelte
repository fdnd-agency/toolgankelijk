<script>
    import { onNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import Header from '$lib/components/header.svelte';

    let { children } = $props();

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

{#if $page.url.pathname !== '/login'}
    <Header/>
{/if}

<main id="main">
    {@render children?.()}
</main>