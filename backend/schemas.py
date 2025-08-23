from datetime import date
from typing import List
from pydantic import BaseModel, Field, conint, confloat


class ConvertResponse(BaseModel):
    from_currency: str = Field(..., alias="from")
    to_currency: str = Field(..., alias="to")
    amount: confloat(ge=0)
    rate: confloat(gt=0)
    converted: confloat(ge=0)


class RatePoint(BaseModel):
    date: date
    rate: confloat(gt=0)


class HistoryResponse(BaseModel):
    from_currency: str = Field(..., alias="from")
    to_currency: str = Field(..., alias="to")
    days: conint(ge=1, le=365)
    series: List[RatePoint]


class ForecastResponse(BaseModel):
    from_currency: str = Field(..., alias="from")
    to_currency: str = Field(..., alias="to")
    days: conint(ge=1, le=365)
    series: List[RatePoint]


