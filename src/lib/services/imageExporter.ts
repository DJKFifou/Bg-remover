export type ImageFormat = 'png' | 'jpeg' | 'webp';

export interface ExportOptions {
	format: ImageFormat;
	quality: number;
	scale?: number;
	width?: number;
	height?: number;
	backgroundColor?: string | null;
}

export interface EcommercePreset {
	id: string;
	label: string;
	platform: string;
	width: number;
	height: number;
	backgroundColor: string | null;
	format: ImageFormat;
}

export const ecommercePresets: EcommercePreset[] = [
	{
		id: 'amazon',
		label: 'Amazon',
		platform: 'Amazon',
		width: 1000,
		height: 1000,
		backgroundColor: '#ffffff',
		format: 'jpeg'
	},
	{
		id: 'shopify',
		label: 'Shopify',
		platform: 'Shopify',
		width: 2048,
		height: 2048,
		backgroundColor: '#ffffff',
		format: 'png'
	},
	{
		id: 'ebay',
		label: 'eBay',
		platform: 'eBay',
		width: 1600,
		height: 1600,
		backgroundColor: '#ffffff',
		format: 'jpeg'
	},
	{
		id: 'etsy',
		label: 'Etsy',
		platform: 'Etsy',
		width: 2000,
		height: 2000,
		backgroundColor: '#ffffff',
		format: 'jpeg'
	},
	{
		id: 'transparent',
		label: 'Transparent',
		platform: 'Custom',
		width: 1000,
		height: 1000,
		backgroundColor: null,
		format: 'png'
	}
];

export const defaultExportOptions: ExportOptions = {
	format: 'png',
	quality: 0.9,
	scale: 1.0,
	backgroundColor: null
};

export async function exportImage(
	imageUrl: string,
	options: ExportOptions = defaultExportOptions
): Promise<Blob> {
	const img = await loadImage(imageUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Could not get canvas context');
	}

	let outputWidth: number;
	let outputHeight: number;

	if (options.width && options.height) {
		outputWidth = options.width;
		outputHeight = options.height;
	} else {
		const scale = options.scale ?? 1;
		outputWidth = img.width * scale;
		outputHeight = img.height * scale;
	}

	canvas.width = outputWidth;
	canvas.height = outputHeight;

	if (options.backgroundColor) {
		ctx.fillStyle = options.backgroundColor;
		ctx.fillRect(0, 0, outputWidth, outputHeight);
	}

	const imgAspect = img.width / img.height;
	const canvasAspect = outputWidth / outputHeight;

	let drawWidth: number;
	let drawHeight: number;
	let drawX: number;
	let drawY: number;

	if (options.width && options.height) {
		if (imgAspect > canvasAspect) {
			drawWidth = outputWidth;
			drawHeight = outputWidth / imgAspect;
		} else {
			drawHeight = outputHeight;
			drawWidth = outputHeight * imgAspect;
		}
		drawX = (outputWidth - drawWidth) / 2;
		drawY = (outputHeight - drawHeight) / 2;
	} else {
		drawWidth = outputWidth;
		drawHeight = outputHeight;
		drawX = 0;
		drawY = 0;
	}

	ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

	const mimeType = getMimeType(options.format);
	const quality = options.format === 'png' ? undefined : options.quality;

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error('Failed to create blob'));
				}
			},
			mimeType,
			quality
		);
	});
}

export async function downloadImage(
	imageUrl: string,
	filename: string,
	options: ExportOptions = defaultExportOptions
): Promise<void> {
	const blob = await exportImage(imageUrl, options);
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${filename}.${options.format}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}

export async function getImageDimensions(
	imageUrl: string
): Promise<{ width: number; height: number }> {
	const img = await loadImage(imageUrl);
	return { width: img.width, height: img.height };
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
}

function getMimeType(format: ImageFormat): string {
	const mimeTypes: Record<ImageFormat, string> = {
		png: 'image/png',
		jpeg: 'image/jpeg',
		webp: 'image/webp'
	};
	return mimeTypes[format];
}
