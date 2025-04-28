from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    firstName = db.Column(db.String(50), nullable=True)
    lastName = db.Column(db.String(50), nullable=True)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "createdAt": self.createdAt.isoformat() + "Z",
        }


class Idea(db.Model):
    __tablename__ = "ideas"
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    short_desc = db.Column(db.String(300), nullable=False)
    nodes = db.Column(db.Text, nullable=True)
    edges = db.Column(db.Text, nullable=True)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_markdown():
        pass


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
