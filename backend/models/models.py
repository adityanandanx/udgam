from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID


@dataclass
class User:
    id: UUID
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: Optional[datetime] = None


@dataclass
class Idea:
    id: UUID
    user_id: UUID
    title: str
    status: str
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    target_market: Optional[str] = None
    validation_score: Optional[float] = None
    tags: Optional[List[str]] = None
    related_ideas: Optional[List[UUID]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class ValidationResult:
    score: float
    market_fit_score: float
    feasibility_score: float
    innovation_score: float
    insights: Optional[List[Dict[str, Any]]] = None


@dataclass
class MarketInsight:
    location: str
    problems: List[Dict[str, Any]]
    demographics: Optional[Dict[str, Any]] = None
    competitor_count: Optional[int] = None


@dataclass
class Document:
    id: UUID
    idea_id: UUID
    type: str
    content: str
    format: str
    created_at: Optional[datetime] = None
