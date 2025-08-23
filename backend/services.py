from __future__ import annotations
from datetime import date, timedelta
from typing import Dict, List, Tuple

# Mock base USD rates (replace with a real provider later)
MOCK_BASE_USD_RATES: Dict[str, float] = {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.78,
    "JPY": 150.0,
    "CAD": 1.35,
    "AUD": 1.50,
    "CHF": 0.86,
    "CNY": 7.2,
}


def normalize_currency(code: str) -> str:
    return code.strip().upper()


def supported(code: str) -> bool:
    return normalize_currency(code) in MOCK_BASE_USD_RATES


def get_cross_rate(from_code: str, to_code: str) -> float:
    f = normalize_currency(from_code)
    t = normalize_currency(to_code)
    if f == t:
        return 1.0
    if not supported(f) or not supported(t):
        raise ValueError(f"Unsupported currency pair: {f}->{t}")
    usd_to_t = MOCK_BASE_USD_RATES[t]
    usd_to_f = MOCK_BASE_USD_RATES[f]
    return usd_to_t / usd_to_f


def convert_amount(amount: float, rate: float) -> float:
    return round(amount * rate, 2)


def generate_history(from_code: str, to_code: str, days: int) -> List[Tuple[date, float]]:
    base_rate = get_cross_rate(from_code, to_code)
    today = date.today()
    series: List[Tuple[date, float]] = []
    for i in range(days):
        d = today - timedelta(days=days - i)
        wiggle = 1.0 + (0.005 * ((i % 7) - 3) / 3.0)
        r = round(base_rate * wiggle, 6)
        series.append((d, r))
    return series


def generate_forecast(from_code: str, to_code: str, days: int) -> List[Tuple[date, float]]:
    base_rate = get_cross_rate(from_code, to_code)
    start = date.today() + timedelta(days=1)
    out: List[Tuple[date, float]] = []
    for i in range(days):
        d = start + timedelta(days=i)
        trend = 1.0 + (0.0015 * i)
        r = round(base_rate * trend, 6)
        out.append((d, r))
    return out


