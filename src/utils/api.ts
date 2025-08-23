const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function convertAPI(from: string, to: string, amount: number) {
  const res = await fetch(`${API}/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${amount}`);
  if (!res.ok) throw new Error('Convert failed');
  return res.json();
}

export async function historyAPI(from: string, to: string, days: number) {
  const res = await fetch(`${API}/history?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&days=${days}`);
  if (!res.ok) throw new Error('History failed');
  return res.json();
}

export async function forecastAPI(from: string, to: string, days: number) {
  const res = await fetch(`${API}/forecast?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&days=${days}`);
  if (!res.ok) throw new Error('Forecast failed');
  return res.json();
}


