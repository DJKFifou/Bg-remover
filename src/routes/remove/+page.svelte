<script lang="ts">
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import loader from '$lib/assets/Loader.webm';

	let loading: boolean = $state(false);
	let previewUploadUrl: string | null = $state(null);
	let processedUrl: string | null = $state(null);
	let error: string | null = $state(null);

	async function onFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (file.size > 22 * 1024 * 1024) {
			error = 'Fichier trop volumineux (max 22 Mo)';
			return;
		}

		previewUploadUrl = URL.createObjectURL(file);
		processedUrl = null;
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
			processedUrl = URL.createObjectURL(blob);
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
			onchange={onFileChange}
			class="absolute inset-0 h-full w-full bg-gray-100 hover:bg-gray-200 text-transparent hover:cursor-pointer"
		/>
		<h3 class="absolute top-1/2 left-1/2 -translate-1/2 pointer-events-none">
			Upload an image <br /> <span class="text-xs">(Max 512 Ko)</span>
		</h3>
	</div>
	{#if previewUploadUrl && processedUrl}
		<BeforeAfterSlider beforeSrc={previewUploadUrl} afterSrc={processedUrl} />
		<a href={processedUrl} download="bg-removed.png" class="text-blue-500 underline">
			Télécharger l'image
		</a>
	{:else if previewUploadUrl}
		<img src={previewUploadUrl} alt="Uploaded preview" class="w-60 rounded-lg shadow" />
	{/if}
	{#if loading}
		<video src={loader} autoplay loop muted playsinline></video>
	{/if}
</section>
