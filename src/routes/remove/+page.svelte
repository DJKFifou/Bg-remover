<script lang="ts">
	let loading: boolean = false;
	let previewUploadUrl: string | null = null;
	let error: string | null = null;

	async function onFileChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.size > 22 * 1024 * 1024) {
			error = 'Fichier trop volumineux (max 22 Mo)';
			return;
		}

		previewUploadUrl = URL.createObjectURL(file);
		error = null;
		loading = true;

		const formData = new FormData();
		formData.append('image', file);

		try {
			const response = await fetch('/api/remove-bg', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				error = response.status === 413 ? 'Fichier trop volumineux' : 'Erreur serveur';
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

			const previewDownloadLink = document.getElementById('preview-download');
			if (previewDownloadLink) {
				previewDownloadLink.src = url;
				previewDownloadLink.classList.remove('hidden');
			}
		} catch (err) {
			error = 'Erreur réseau';
			console.log(err);
		}

		loading = false;
	}
</script>

<!-- ... reste de ton code ... -->
{#if error}
	<p class="text-red-500">{error}</p>
{/if}

<section class="h-screen w-full flex flex-col items-center justify-center gap-8 text-center">
	<a href="/" class="absolute top-6 left-6">
		<img src="/svgs/left_arrow.svg" alt="Left arrow" class="w-10" />
	</a>
	<h1 class="text-3xl font-bold">Remove your background !</h1>
	<div class="relative h-50 w-50 rounded-xl border border-dashed border-gray-400 overflow-hidden">
		<input
			type="file"
			accept=".jpg, .jpeg, .png, .webp"
			size="512"
			on:change={onFileChange}
			class="absolute inset-0 h-full w-full bg-gray-100 hover:bg-gray-200 text-transparent hover:cursor-pointer"
		/>
		<h3 class="absolute top-1/2 left-1/2 -translate-1/2 pointer-events-none">
			Upload an image <br /> <span class="text-xs">(Max 512 Ko)</span>
		</h3>
	</div>
	{#if previewUploadUrl}
		<div class="flex gap-4">
			<img src={previewUploadUrl} alt="Uploaded preview" class="w-40 rounded-lg shadow" />
			<img
				id="preview-download"
				src=""
				alt="Uploaded preview"
				class="hidden w-40 rounded-lg shadow"
			/>
		</div>
	{/if}
	<a id="download-link" href="/" download class="hidden text-blue-500 underline"
		>Télécharger l'image</a
	>
	{#if loading}
		<p>⏳ Traitement en cours…</p>
	{/if}
</section>
