<script lang="ts">
	import {
		downloadImage,
		getImageDimensions,
		ecommercePresets,
		type ImageFormat,
		type ExportOptions,
		type EcommercePreset
	} from '$lib/services/imageExporter';

	interface Props {
		imageUrl: string;
		filename?: string;
	}

	let { imageUrl, filename = 'bg-removed' }: Props = $props();

	type ExportMode = 'custom' | 'ecommerce';

	let mode: ExportMode = $state('custom');
	let format: ImageFormat = $state('png');
	let quality: number = $state(90);
	let scale: number = $state(1);
	let selectedPreset: EcommercePreset | null = $state(null);
	let isExporting: boolean = $state(false);
	let dimensions: { width: number; height: number } | null = $state(null);

	const formatOptions: { value: ImageFormat; label: string }[] = [
		{ value: 'png', label: 'PNG' },
		{ value: 'jpeg', label: 'JPEG' },
		{ value: 'webp', label: 'WebP' }
	];

	const scaleOptions = [
		{ value: 1, label: '100%' },
		{ value: 0.75, label: '75%' },
		{ value: 0.5, label: '50%' },
		{ value: 0.25, label: '25%' }
	];

	$effect(() => {
		if (imageUrl) {
			getImageDimensions(imageUrl).then((dims) => {
				dimensions = dims;
			});
		}
	});

	async function handleExport() {
		isExporting = true;
		try {
			let options: ExportOptions;

			if (mode === 'ecommerce' && selectedPreset) {
				options = {
					format: selectedPreset.format,
					quality: quality / 100,
					width: selectedPreset.width,
					height: selectedPreset.height,
					backgroundColor: selectedPreset.backgroundColor
				};
			} else {
				options = {
					format,
					quality: quality / 100,
					scale
				};
			}

			const exportFilename =
				mode === 'ecommerce' && selectedPreset ? `${filename}-${selectedPreset.id}` : filename;

			await downloadImage(imageUrl, exportFilename, options);
		} catch (error) {
			console.error('Export failed:', error);
		}
		isExporting = false;
	}

	function selectPreset(preset: EcommercePreset) {
		selectedPreset = preset;
	}

	function getExportSummary(): string {
		if (mode === 'ecommerce' && selectedPreset) {
			return `${selectedPreset.label} • ${selectedPreset.format.toUpperCase()}`;
		}
		const scaleLabel = scaleOptions.find((s) => s.value === scale)?.label ?? '100%';
		return `${format.toUpperCase()} • ${scaleLabel}`;
	}
</script>

<details class="group w-full max-w-80 border border-gray-200 rounded-xl bg-white overflow-hidden">
	<summary
		class="flex items-center gap-2 py-3.5 px-4 cursor-pointer list-none select-none bg-gray-50 [&::-webkit-details-marker]:hidden"
	>
		<span class="text-sm font-semibold text-gray-900">Export Options</span>
		<span class="ml-auto text-xs font-medium text-blue-500">{getExportSummary()}</span>
		<svg
			class="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</summary>

	<div class="flex flex-col gap-3.5 p-4 border-t border-gray-200">
		<!-- Mode Toggle -->
		<div class="flex bg-gray-100 rounded-lg p-1">
			<button
				type="button"
				class="flex-1 py-2 px-3 text-sm font-medium border-none rounded-md cursor-pointer transition-all duration-150 {mode ===
				'custom'
					? 'bg-white text-gray-900 shadow-sm'
					: 'bg-transparent text-gray-500'}"
				onclick={() => (mode = 'custom')}
			>
				Custom
			</button>
			<button
				type="button"
				class="flex-1 py-2 px-3 text-sm font-medium border-none rounded-md cursor-pointer transition-all duration-150 {mode ===
				'ecommerce'
					? 'bg-white text-gray-900 shadow-sm'
					: 'bg-transparent text-gray-500'}"
				onclick={() => (mode = 'ecommerce')}
			>
				E-commerce
			</button>
		</div>

		{#if mode === 'custom'}
			<!-- Format -->
			<div class="flex flex-col gap-2">
				<span class="text-sm font-medium text-gray-700">Format</span>
				<div class="flex gap-1.5">
					{#each formatOptions as option}
						<button
							type="button"
							class="flex-1 py-2 px-2 text-sm font-medium border rounded-md cursor-pointer transition-all duration-150 {format ===
							option.value
								? 'bg-blue-500 border-blue-500 text-white'
								: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
							onclick={() => (format = option.value)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Quality slider (only for lossy formats) -->
			{#if format !== 'png'}
				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium text-gray-700" for="quality">Quality: {quality}%</label>
					<input
						type="range"
						id="quality"
						bind:value={quality}
						min="10"
						max="100"
						step="5"
						class="w-full h-1.5 rounded bg-gray-200 appearance-none cursor-pointer accent-blue-500"
					/>
				</div>
			{/if}

			<!-- Size -->
			<div class="flex flex-col gap-2">
				<span class="text-sm font-medium text-gray-700">Size</span>
				<div class="flex gap-1.5">
					{#each scaleOptions as option}
						<button
							type="button"
							class="flex-1 py-2 px-2 text-sm font-medium border rounded-md cursor-pointer transition-all duration-150 {scale ===
							option.value
								? 'bg-blue-500 border-blue-500 text-white'
								: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
							onclick={() => (scale = option.value)}
						>
							{option.label}
						</button>
					{/each}
				</div>
				{#if dimensions}
					<span class="text-xs text-gray-500 text-center">
						{Math.round(dimensions.width * scale)} × {Math.round(dimensions.height * scale)}px
					</span>
				{/if}
			</div>
		{:else}
			<!-- E-commerce Presets -->
			<div class="flex flex-col gap-2">
				<span class="text-sm font-medium text-gray-700">Platform</span>
				<div class="flex flex-col gap-1.5">
					{#each ecommercePresets as preset}
						<button
							type="button"
							class="flex justify-between items-center py-2.5 px-3 border rounded-md cursor-pointer transition-all duration-150 {selectedPreset?.id ===
							preset.id
								? 'bg-blue-50 border-blue-500'
								: 'bg-white border-gray-200 hover:bg-gray-50'}"
							onclick={() => selectPreset(preset)}
						>
							<span
								class="text-sm font-medium {selectedPreset?.id === preset.id
									? 'text-blue-500'
									: 'text-gray-900'}"
							>
								{preset.label}
							</span>
							<span class="text-xs text-gray-500">
								{preset.width}×{preset.height} • {preset.format.toUpperCase()}
							</span>
						</button>
					{/each}
				</div>
			</div>

			{#if selectedPreset}
				<div class="flex justify-center gap-1.5 text-xs text-gray-500 py-2 bg-gray-50 rounded-md">
					<span>{selectedPreset.width} × {selectedPreset.height}px</span>
					<span>•</span>
					<span>{selectedPreset.format.toUpperCase()}</span>
					<span>•</span>
					<span>{selectedPreset.backgroundColor ? 'White bg' : 'Transparent'}</span>
				</div>
			{/if}
		{/if}

		<button
			type="button"
			class="py-2.5 px-4 text-sm font-semibold border-none rounded-lg bg-blue-500 text-white cursor-pointer transition-colors duration-150 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
			onclick={handleExport}
			disabled={isExporting || (mode === 'ecommerce' && !selectedPreset)}
		>
			{isExporting ? 'Exporting...' : 'Download'}
		</button>
	</div>
</details>
