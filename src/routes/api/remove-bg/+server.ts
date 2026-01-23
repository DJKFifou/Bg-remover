import { API_SECRET_KEY } from '$env/static/private';

export async function POST({ request }) {
	console.log('Requête reçue dans /api/remove-bg');

	// On récupère le body entier sans limite de SvelteKit
	const arrayBuffer = await request.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	console.log('Taille du fichier reçu :', buffer.length);

	if (!buffer.length) {
		return new Response('No file uploaded', { status: 400 });
	}

	// Création d'un FormData compatible avec fetch API pour remove.bg
	const apiForm = new FormData();
	apiForm.append('size', 'auto');
	// remove.bg attend un Blob ou File
	apiForm.append('image_file', new Blob([buffer]));

	console.log('Envoi à remove.bg…');

	const response = await fetch('https://api.remove.bg/v1.0/removebg', {
		method: 'POST',
		headers: {
			'X-Api-Key': API_SECRET_KEY
		},
		body: apiForm
	});

	if (!response.ok) {
		const err = await response.text();
		console.log('Erreur API remove.bg :', err);
		return new Response('Error from API: ' + err, { status: 500 });
	}

	const resultArrayBuffer = await response.arrayBuffer();
	return new Response(resultArrayBuffer, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
}
