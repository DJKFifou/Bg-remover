import { API_SECRET_KEY } from '$env/static/private';

export const config = {
	body: {
		maxSize: '22mb'
	}
};

export async function POST({ request }) {
	const contentLength = request.headers.get('content-length');
	const maxSize = 22 * 1024 * 1024; // 22 Mo
	if (contentLength && parseInt(contentLength) > maxSize) {
		return new Response('Payload too large', { status: 413 });
	}

	const formData = await request.formData();
	const image = formData.get('image');

	if (!image) {
		return new Response('No file uploaded', { status: 400 });
	}

	const apiForm = new FormData();
	apiForm.append('size', 'auto');
	apiForm.append('image_file', image);

	const response = await fetch('https://api.remove.bg/v1.0/removebg', {
		method: 'POST',
		headers: {
			'X-Api-Key': API_SECRET_KEY
		},
		body: apiForm
	});

	if (!response.ok) {
		const err = await response.text();
		return new Response('Error from API: ' + err, { status: 500 });
	}

	const arrayBuffer = await response.arrayBuffer();
	return new Response(arrayBuffer, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
}
