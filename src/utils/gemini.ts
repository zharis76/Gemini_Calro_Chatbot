// Client-side helper: call the local server endpoint `/api/gemini`.
// This avoids bundling the server-only `@google/generative-ai` library
// into the browser and keeps the API key on the server.
export async function getGeminiResponse(userQuery: string) {
    if (!userQuery || !userQuery.trim()) return '';

    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userQuery }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Server returned error for /api/gemini:', err || res.statusText);
            return '';
        }

        const data = await res.json();
        if (!data) return '';
        return String(data.response ?? data.result ?? '');
    } catch (err) {
        console.error('getGeminiResponse client error:', err);
        return '';
    }
}