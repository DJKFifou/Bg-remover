<script lang="ts">
	import {
		getHistory,
		removeFromHistory,
		clearHistory,
		downloadHistoryItem,
		downloadMultipleItems,
		type HistoryItem
	} from '$lib/services/processingHistory';

	let history: HistoryItem[] = $state([]);
	let selectedIds: Set<string> = $state(new Set());
	let isDownloading: boolean = $state(false);

	$effect(() => {
		history = getHistory();
	});

	export function refresh() {
		history = getHistory();
	}

	function toggleSelect(id: string) {
		const newSet = new Set(selectedIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		selectedIds = newSet;
	}

	function selectAll() {
		selectedIds = new Set(history.map((item) => item.id));
	}

	function deselectAll() {
		selectedIds = new Set();
	}

	function handleRemove(id: string) {
		removeFromHistory(id);
		selectedIds.delete(id);
		selectedIds = new Set(selectedIds);
		history = getHistory();
	}

	function handleClearHistory() {
		clearHistory();
		selectedIds = new Set();
		history = [];
	}

	async function handleDownloadSelected() {
		const selectedItems = history.filter((item) => selectedIds.has(item.id));
		if (selectedItems.length === 0) return;

		isDownloading = true;
		await downloadMultipleItems(selectedItems);
		isDownloading = false;
	}

	async function handleDownloadSingle(item: HistoryItem) {
		await downloadHistoryItem(item);
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

{#if history.length > 0}
	<details class="group w-full max-w-md border border-gray-200 rounded-xl bg-white overflow-hidden">
		<summary
			class="flex items-center gap-2 py-3 px-4 cursor-pointer list-none select-none bg-gray-50 [&::-webkit-details-marker]:hidden"
		>
			<span class="text-sm font-semibold text-gray-900">History</span>
			<span
				class="ml-auto flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
			>
				{history.length}
			</span>
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

		<div class="flex flex-col border-t border-gray-200">
			<!-- Actions bar -->
			<div class="flex items-center justify-between gap-2 p-3 bg-gray-50 border-b border-gray-200">
				<div class="flex items-center gap-2">
					{#if selectedIds.size === history.length}
						<button
							type="button"
							class="text-xs text-gray-500 hover:text-gray-700"
							onclick={deselectAll}
						>
							Deselect all
						</button>
					{:else}
						<button
							type="button"
							class="text-xs text-gray-500 hover:text-gray-700"
							onclick={selectAll}
						>
							Select all
						</button>
					{/if}
					{#if selectedIds.size > 0}
						<span class="text-xs text-gray-400">({selectedIds.size} selected)</span>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					{#if selectedIds.size > 0}
						<button
							type="button"
							class="px-2.5 py-1 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
							onclick={handleDownloadSelected}
							disabled={isDownloading}
						>
							{isDownloading ? 'Downloading...' : `Download (${selectedIds.size})`}
						</button>
					{/if}
					<button
						type="button"
						class="px-2.5 py-1 text-xs font-medium text-red-500 hover:text-red-600"
						onclick={handleClearHistory}
					>
						Clear
					</button>
				</div>
			</div>

			<!-- History items -->
			<div class="flex flex-col max-h-64 overflow-y-auto">
				{#each history as item (item.id)}
					<div
						class="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
					>
						<!-- Checkbox -->
						<input
							type="checkbox"
							checked={selectedIds.has(item.id)}
							onchange={() => toggleSelect(item.id)}
							class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
						/>

						<!-- Thumbnail -->
						<img
							src={item.dataUrl}
							alt={item.originalName}
							class="w-12 h-12 object-contain rounded bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)_50%/8px_8px]"
						/>

						<!-- Info -->
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-900 truncate">{item.originalName}</p>
							<p class="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
						</div>

						<!-- Actions -->
						<div class="flex items-center gap-1">
							<button
								type="button"
								class="p-1.5 text-gray-400 hover:text-blue-500 rounded-md hover:bg-gray-100"
								onclick={() => handleDownloadSingle(item)}
								title="Download"
							>
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="7 10 12 15 17 10"></polyline>
									<line x1="12" y1="15" x2="12" y2="3"></line>
								</svg>
							</button>
							<button
								type="button"
								class="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100"
								onclick={() => handleRemove(item.id)}
								title="Remove"
							>
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="3 6 5 6 21 6"></polyline>
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</details>
{/if}
