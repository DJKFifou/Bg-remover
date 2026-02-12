<script lang="ts">
	interface Props {
		beforeSrc: string;
		afterSrc: string;
		beforeAlt?: string;
		afterAlt?: string;
	}

	let { beforeSrc, afterSrc, beforeAlt = 'Before', afterAlt = 'After' }: Props = $props();

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
	class="before-after-slider"
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
	<img src={afterSrc} alt={afterAlt} class="after-image" draggable="false" />

	<div class="before-container" style="clip-path: inset(0 {100 - sliderPosition}% 0 0);">
		<img src={beforeSrc} alt={beforeAlt} class="before-image" draggable="false" />
	</div>

	<div
		class="slider-handle"
		style="left: {sliderPosition}%;"
		onmousedown={handleMouseDown}
		ontouchstart={handleMouseDown}
		role="presentation"
	>
		<div class="slider-line"></div>
		<div class="slider-button">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</div>
	</div>
</div>

<style>
	.before-after-slider {
		position: relative;
		width: 100%;
		max-width: 500px;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: 0.75rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		cursor: ew-resize;
		user-select: none;
	}

	.after-image,
	.before-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50% / 20px 20px;
	}

	.before-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.slider-handle {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 4px;
		transform: translateX(-50%);
		cursor: ew-resize;
	}

	.slider-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		background: white;
		transform: translateX(-50%);
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
	}

	.slider-button {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 40px;
		height: 40px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.slider-button svg {
		width: 14px;
		height: 14px;
		color: #666;
	}
</style>
