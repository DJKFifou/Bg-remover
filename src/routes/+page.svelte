<script>
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
</script>

<section
	class="min-h-[calc(100lvh-5rem)] w-full flex flex-col items-center justify-center gap-10 text-center"
>
	<div class="flex flex-col gap-20 w-full justify-center items-center">
		<div class="flex flex-col w-full justify-center items-center gap-6">
			<h1 class="text-4xl font-bold">Welcome to Bg Remover</h1>
			<p class="max-w-2xl">
				Bg Remover is a free online tool that allows you to remove the background from your images
				in just a few seconds. Whether you want to create a transparent background for your product
				photos, profile pictures, or any other image, Bg Remover has got you covered.
			</p>
		</div>
		<div class="flex justify-center items-center gap-20 w-full">
			<BeforeAfterSlider
				beforeSrc="/src/lib/assets/no-removed-bg.jpg"
				afterSrc="/src/lib/assets/removed-bg.webp"
				classes="max-w-xs border-2"
			/>
			<div class="flex flex-col items-center gap-8">
				<div class="flex flex-col gap-4">
					<p>You'll control your file such as :</p>
					<ul class="max-w-xs text-start list-disc pl-6">
						<li>Choosing the format</li>
						<li>Managing the size</li>
						<li>Previewing the final image</li>
					</ul>
				</div>
				<!-- <p class="max-w-xs">
					Control the options of the background removal process, such as the format or the size of
					your file. You can also preview the results with the before/after slider before
					downloading the final image.
				</p> -->
				<div class="relative">
					<img
						src="/svgs/left_arrow.svg"
						alt="Right arrow"
						class="absolute -left-1/2 top-1/2 -translate-y-1/2 rotate-180 w-10 animate-arrow-converge"
					/>
					<a
						href="/remove"
						class="px-4 py-2 bg-black text-white border rounded-xl hover:bg-white hover:text-black"
						>Remove here</a
					>
					<img
						src="/svgs/left_arrow.svg"
						alt="Left arrow"
						class="absolute -right-1/2 top-1/2 -translate-y-1/2 w-10 animate-arrow-converge"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
