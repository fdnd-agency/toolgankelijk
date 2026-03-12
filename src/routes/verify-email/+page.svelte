<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<h1>Verifieer uw e-mailadres</h1>
<p>We hebben een 8-cijferige code gestuurd naar {data.email}!</p>
<form method="post" use:enhance action="?/verify">
	<label for="verify-code">Code</label>
	<input id="verify-code" name="code" required />
	<button>Verifiëren</button>
	<p>{form?.verify?.message ?? ''}</p>
</form>
<form method="post" use:enhance action="?/resend">
	<button>Code opnieuw versturen</button>
	<p>{form?.resend?.message ?? ''}</p>
</form>
