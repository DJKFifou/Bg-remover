<script>
	let loading = false;

	async function onFileChange(event) {
		const file = event.target.files?.[0];

		if (!file) return;

		loading = true;

		const formData = new FormData();
		formData.append('image', file);

		try {
			const response = await fetch('/api/remove-bg', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				loading = false;
				return;
			}

			const blob = await response.blob();

			const url = URL.createObjectURL(blob);

			const link = document.getElementById('download-link');
			if (link) {
				link.href = url;
				link.classList.remove('hidden');
			}
		} catch (err) {
			console.log(err);
		}

		loading = false;
	}
</script>

<section class="h-screen w-full flex flex-col items-center justify-center gap-8 text-center">
	<h1 class="text-3xl font-bold">Remove your background !</h1>

	<div class="relative h-50 w-50 rounded-xl border border-dashed border-gray-400 overflow-hidden">
		<input
			type="file"
			accept="image/*"
			on:change={onFileChange}
			class="absolute inset-0 h-full w-full bg-gray-100 hover:cursor-pointer hover:bg-gray-200 text-transparent"
		/>
		<h3 class="absolute top-1/2 left-1/2 -translate-1/2 pointer-events-none">Upload an image</h3>
		<a id="download-link" href="/" download class="hidden text-blue-500 underline"
			>Télécharger l'image</a
		>
		{#if loading}
			<p>⏳ Traitement en cours…</p>
		{/if}
	</div>
</section>
