export interface HistoryItem {
	id: string;
	originalName: string;
	dataUrl: string;
	createdAt: number;
}

const STORAGE_KEY = 'bg-remover-history';
const MAX_HISTORY_ITEMS = 20;

export function getHistory(): HistoryItem[] {
	if (typeof localStorage === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

export async function addToHistory(blob: Blob, originalName: string): Promise<HistoryItem> {
	const dataUrl = await blobToDataUrl(blob);

	const item: HistoryItem = {
		id: generateId(),
		originalName: originalName.replace(/\.[^/.]+$/, ''),
		dataUrl,
		createdAt: Date.now()
	};

	const history = getHistory();
	history.unshift(item);

	if (history.length > MAX_HISTORY_ITEMS) {
		history.splice(MAX_HISTORY_ITEMS);
	}

	saveHistory(history);
	return item;
}

export function removeFromHistory(id: string): void {
	const history = getHistory().filter((item) => item.id !== id);
	saveHistory(history);
}

export function clearHistory(): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(STORAGE_KEY);
}

export async function downloadHistoryItem(item: HistoryItem): Promise<void> {
	const link = document.createElement('a');
	link.href = item.dataUrl;
	link.download = `${item.originalName}-bg-removed.png`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export async function downloadMultipleItems(items: HistoryItem[]): Promise<void> {
	for (let i = 0; i < items.length; i++) {
		await downloadHistoryItem(items[i]);
		if (i < items.length - 1) {
			await delay(300);
		}
	}
}

function saveHistory(history: HistoryItem[]): void {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	} catch {
		if (history.length > 1) {
			history.pop();
			saveHistory(history);
		}
	}
}

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
