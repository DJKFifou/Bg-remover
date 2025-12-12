import * as env from '$env/static/private';
console.log(env);
import { API_SECRET_KEY } from '$env/static/private';

export async function POST({ request }) {
	console.log('📥 Requête reçue dans /api/remove-bg');

	const formData = await request.formData();
	console.log('📦 FormData reçu :', formData);

	const image = formData.get('image');
	console.log('📸 Fichier image reçu :', image);

	if (!image) {
		console.log('❌ Aucun fichier envoyé');
		return new Response('No file uploaded', { status: 400 });
	}

	const apiForm = new FormData();
	apiForm.append('size', 'auto');
	apiForm.append('image_file', image);

	console.log('➡️ Envoi à remove.bg…');

	const response = await fetch('https://api.remove.bg/v1.0/removebg', {
		method: 'POST',
		headers: {
			'X-Api-Key': API_SECRET_KEY
		},
		body: apiForm
	});

	console.log('📡 Réponse remove.bg :', response.status, response.statusText);

	if (!response.ok) {
		const err = await response.text();
		console.log('💥 Erreur API remove.bg :', err);
		return new Response('Error from API: ' + err, { status: 500 });
	}

	const arrayBuffer = await response.arrayBuffer();
	console.log('📦 Image traitée reçue (arrayBuffer length)', arrayBuffer.byteLength);

	return new Response(arrayBuffer, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
}
