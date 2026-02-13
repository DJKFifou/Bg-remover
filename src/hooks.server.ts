import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.request.method === 'POST') {
		const contentLength = event.request.headers.get('content-length');
		const maxSize = 22 * 1024 * 1024; // 22 Mo
		if (contentLength && parseInt(contentLength) > maxSize) {
			return new Response('Payload too large', { status: 413 });
		}
	}
	return resolve(event);
};
