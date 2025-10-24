# Fetisch Dating Plattform - ML Services

Python-basierte ML-Services für Character Generation und Object Recognition.

## 🚀 Features

- **Character Generator**: Erstellt Profile aus 200+ Mikro-Entscheidungen
- **Object Recognition**: Erkennt Fetisch-Objekte in Fotos (YOLOv8)
- **Photo Validation**: Überprüft Foto-Qualität und NSFW-Content
- **REST API**: Flask-basiert für Integration mit Backend

## 🛠️ Setup

```bash
# Python 3.11+
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies
pip install -r requirements.txt

# Run
python main.py
# Server läuft auf http://localhost:3002
```

## 📡 API Endpoints

### Character Generator

```bash
POST /api/v1/character/generate
Content-Type: application/json

{
  "decisions": {
    "dominance_preference": "high",
    "role": "domme",
    "experience_level": "intermediate"
    // ... 200+ weitere Micro-Decisions
  }
}

Response:
{
  "archetype": "strict_domme",
  "dominance_level": 92,
  "submission_level": 8,
  "traits": ["authoritative", "confident"],
  "personality": {...},
  "lifestyle": {...}
}
```

### Object Recognition

```bash
POST /api/v1/photo/recognize
Content-Type: application/json

{
  "image_data": "base64_encoded_image"
}

Response:
{
  "detected_objects": [
    {"object": "whip", "confidence": 0.92},
    {"object": "rope", "confidence": 0.85}
  ],
  "suggested_tags": [
    {"tagId": "bdsm.impact.whip", "confidence": 0.92}
  ],
  "is_nsfw": false
}
```

## 📁 Struktur

```
config.py              # Configuration
logger.py             # Logging setup
main.py               # Flask API server
character_generator.py # Character Generator
object_recognition.py  # Object Recognition
requirements.txt      # Python dependencies
```

## 🔗 Integration mit Backend

ML-Services sind erreichbar über `http://ml:3002` in Docker Compose.

Backend ruft folgende Endpoints auf:
- `/api/v1/character/generate` - Charakter generieren
- `/api/v1/photo/recognize` - Objekte in Foto erkennen
- `/api/v1/photo/validate` - Foto validieren

## 🤖 ML Models

- **Character Generator**: Scikit-learn basiert
- **Object Recognition**: YOLOv8 (später trainiert)

## 📝 TODO

- [ ] Echte YOLOv8 Integration
- [ ] NSFW-Detection trainieren
- [ ] Character Generator mit echtem ML-Modell
- [ ] Model Caching mit Redis
- [ ] Batch Processing

---

**Status**: MVP Development  
**Version**: 1.0.0
