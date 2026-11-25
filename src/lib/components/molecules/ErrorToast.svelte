<script>
    let { description } = $props();
</script>

<div class="toast-error" role="alert">
    <svg width="22" height="22" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="43" height="43" rx="21.5" stroke-width="4" stroke="#B10000"/><rect x="21" y="35" width="4" height="4" rx="2" fill="#B10000" stroke-width="2" stroke="#B10000"/><rect x="21" y="7" width="4" height="24" rx="2" fill="#B10000"/><rect x="21" y="7" width="4" height="24" rx="2" fill="#B10000"/></svg>

    <div class="toast-content">
		<p class="toast-title">Opslaan is mislukt</p>
		<p class="toast-description">
			({description})
		</p>
	</div>
</div>

<style>
    .toast-error {
            display: flex;
            align-items: center;
            border-radius: 4px;
            padding: 0.5rem;
            animation: bounce .8s ease-in-out;
            gap: .3em;


            .toast-content {
                height: 1.5rem;
                width: 19rem;
                
                .toast-title {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    font-weight: 600;
                    width: 40ch;
                    color: var(--color-accent-error);
                }

                .toast-description {
                    font-style: italic;
                    color: var(--color-primary-darkest);
                    width: max-content;
                }
            }
        }

        @keyframes bounce {
            0% {
                scale: 1;
            }
            50% {
                scale: 1.1;
            }
            100% {
                scale: 1;
            }
        }
</style>