<script lang="ts">
	interface Props {
		beforeSrc: string;
		afterSrc: string;
		beforeAlt?: string;
		afterAlt?: string;
		classes?: string;
	}

	let {
		beforeSrc,
		afterSrc,
		beforeAlt = 'Before',
		afterAlt = 'After',
		classes = ''
	}: Props = $props();

	let sliderPosition = $state(50);
	let isDragging = $state(false);
	let containerRef: HTMLDivElement;

	function updateSliderPosition(clientX: number) {
		if (!containerRef) return;

		const rect = containerRef.getBoundingClientRect();
		const x = clientX - rect.left;
		const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
		sliderPosition = percentage;
	}

	function handleMouseDown() {
		isDragging = true;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		updateSliderPosition(event.clientX);
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging) return;
		updateSliderPosition(event.touches[0].clientX);
	}

	function handleClick(event: MouseEvent) {
		updateSliderPosition(event.clientX);
	}
</script>

<svelte:window
	onmouseup={handleMouseUp}
	onmousemove={handleMouseMove}
	ontouchmove={handleTouchMove}
	ontouchend={handleMouseUp}
/>

<div
	bind:this={containerRef}
	class={`${classes} relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl shadow-md cursor-ew-resize select-none`}
	role="slider"
	aria-valuenow={sliderPosition}
	aria-valuemin={0}
	aria-valuemax={100}
	tabindex="0"
	onclick={handleClick}
	onkeydown={(e) => {
		if (e.key === 'ArrowLeft') sliderPosition = Math.max(0, sliderPosition - 5);
		if (e.key === 'ArrowRight') sliderPosition = Math.min(100, sliderPosition + 5);
	}}
>
	<img
		src={afterSrc}
		alt={afterAlt}
		class="absolute inset-0 w-full h-full object-contain bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)_50%/20px_20px]"
		draggable="false"
	/>

	<div
		class="absolute inset-0 w-full h-full"
		style="clip-path: inset(0 {100 - sliderPosition}% 0 0);"
	>
		<img
			src={beforeSrc}
			alt={beforeAlt}
			class="absolute inset-0 w-full h-full object-contain bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)_50%/20px_20px]"
			draggable="false"
		/>
	</div>

	<div
		class="absolute top-0 bottom-0 w-1 -translate-x-1/2 cursor-ew-resize"
		style="left: {sliderPosition}%;"
		onmousedown={handleMouseDown}
		ontouchstart={handleMouseDown}
		role="presentation"
	>
		<div
			class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2 shadow-[0_0_4px_rgba(0,0,0,0.3)]"
		></div>

		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
		>
			<svg
				class="w-3.5 h-3.5 text-gray-500"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
			<svg
				class="w-3.5 h-3.5 text-gray-500"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</div>
	</div>
</div>
