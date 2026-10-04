# OptiRoute AI – NLP-Based Prompt Complexity Analysis & Cost-Aware Multi-LLM Routing

![OptiRoute AI](https://img.shields.io/badge/OptiRoute%20AI-v1.0.0-3b82f6?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)

**OptiRoute AI** is a professional, full-stack SaaS platform designed to drastically reduce LLM API costs by dynamically analyzing prompt complexity, serving repeat queries from Redis cache, routing prompts to cost-effective models, verifying response quality, and auto-escalating when quality thresholds are breached.

---

## 🌟 Key Features

1. **13-Stage Real-Time Pipeline**: Seamless workflow from prompt input -> Redis cache check -> NLP feature extraction -> complexity classification -> LLM routing -> generation -> quality verification -> auto-escalation -> database logging.
2. **Scikit-learn Complexity Classifier**: Machine learning model (`RandomForestClassifier` + `TfidfVectorizer`) trained to categorize prompts into `SIMPLE`, `MODERATE`, or `COMPLEX` difficulty tiers with probability confidence scores.
3. **Redis & In-Memory Cache**: Hashes and normalizes incoming prompts to serve duplicate queries in ~0ms at $0 API cost. Includes fallback in-memory dictionary if Redis is offline.
4. **Intelligent Cost-Aware LLM Router**: Routes `SIMPLE` queries to ultra-low-cost models (e.g., `gpt-3.5-turbo` / `mock-fast`), `MODERATE` queries to balanced models (`gpt-4o-mini`), and `COMPLEX` queries to flagship models (`gpt-4o`).
5. **Quality Verification Engine**: Evaluates length, keyword coverage, syntax structure, and refusal triggers to score generated outputs (0-100%).
6. **Auto-Escalation Failsafe**: Automatically routes low-scoring responses to stronger model tiers up to `MAX_ESCALATIONS` times to guarantee response quality.
7. **Unified LLM Provider Abstraction**: Supports OpenAI, Anthropic, Ollama, and a built-in `MockLLMProvider` enabling 100% functionality out-of-the-box without paid API keys.
8. **Fixed Left Sidebar SaaS Dashboard**: Clean futuristic blue UI built with React, Vite, Tailwind CSS, Lucide icons, and Recharts.

---

## 🏗️ System Workflow Architecture

```
USER PROMPT
      ↓
FASTAPI BACKEND (/api/v1/prompt/process)
      ↓
CACHE MEMORY CHECK (Redis / Memory)
      ↓
CACHE HIT?
   YES ──> RETURN CACHED RESPONSE (Cost: $0, Latency: <10ms)
   NO
      ↓
NLP PROMPT FEATURE EXTRACTION (Length, Tokens, Instructions, Reasoning, Code)
      ↓
COMPLEXITY CLASSIFICATION (Scikit-learn: SIMPLE / MODERATE / COMPLEX)
      ↓
INTELLIGENT LLM ROUTER (Model selection based on complexity, cost, capability)
      ↓
PRIMARY LLM GENERATION (OpenAI / Anthropic / Ollama / Mock)
      ↓
QUALITY VERIFICATION (Relevance, completeness, format, score threshold)
      ↓
QUALITY GOOD?
   YES ──> SAVE METRICS & CACHE ──> RETURN RESPONSE
   NO
      ↓
AUTO-ESCALATION (Route to stronger LLM tier, max escalations check)
      ↓
SECONDARY LLM GENERATION & RE-VERIFICATION
      ↓
SAVE METRICS, CACHE & LOG REQUEST ──> RETURN RESPONSE & PROCESS SUMMARY
```

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS v3, Lucide React, Recharts, Axios, React Router v6
* **Backend**: Python 3.11+, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy 2.0, Alembic
* **Machine Learning**: Scikit-Learn, TF-IDF Vectorizer, Random Forest Classifier
* **Database & Cache**: PostgreSQL / SQLite, Redis / In-Memory Fallback
* **Testing & DevOps**: Pytest, Locust Load Testing, Docker, Docker Compose

---

## 📁 Directory Structure

```
optiroute-ai/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (Sidebar.jsx, Header.jsx, DashboardLayout.jsx)
│   │   │   ├── dashboard/ (StatCard.jsx, CostChart.jsx, UsageChart.jsx, QualityChart.jsx, RecentRequests.jsx)
│   │   │   └── playground/ (PromptInput.jsx, ProcessingSteps.jsx, ResponseCard.jsx)
│   │   ├── pages/ (Dashboard.jsx, Playground.jsx, Routing.jsx, Models.jsx, CacheMemory.jsx, Analytics.jsx, Feedback.jsx, Settings.jsx)
│   │   ├── services/ (api.js, promptService.js, analyticsService.js, modelService.js, cacheService.js, settingsService.js)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/ (prompt.py, routing.py, models.py, cache.py, analytics.py, feedback.py, settings.py, health.py)
│   │   ├── core/ (config.py, database.py, redis.py)
│   │   ├── models/ (llm_model.py, request_log.py, feedback.py, cache_entry.py, system_setting.py)
│   │   ├── schemas/ (prompt.py, routing.py, feedback.py, analytics.py, settings.py)
│   │   ├── services/ (prompt_analyzer.py, complexity_classifier.py, llm_router.py, llm_service.py, quality_verifier.py, escalation_service.py, cache_service.py, cost_tracker.py, feedback_service.py)
│   │   ├── ml/ (train_classifier.py, predict.py, model/complexity_model.pkl)
│   │   └── providers/ (base_provider.py, openai_provider.py, anthropic_provider.py, ollama_provider.py, mock_provider.py)
│   ├── tests/ (test_prompt_api.py, locustfile.py)
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/
│   ├── alembic.ini
│   └── migrations/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Installation

### Option 1: Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory:
   ```bash
   cd optiroute-ai
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Launch all services (PostgreSQL, Redis, FastAPI Backend, React Frontend):
   ```bash
   docker compose up --build
   ```

4. Access the platform:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Standalone Local Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Train the ML complexity model
python app/ml/train_classifier.py

# Start FastAPI server
python app/main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing & Load Benchmarking

### Unit & API Integration Tests
```bash
cd backend
python -m pytest -v
```

### Locust Load Testing
```bash
cd backend
locust -f tests/locustfile.py --headless -u 10 -r 2 -t 15s --host http://localhost:8000
```

---

## 📌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health check (DB, Cache, ML status) |
| `POST` | `/api/v1/prompt/process` | Executes 13-stage prompt analysis & routing pipeline |
| `POST` | `/api/v1/routing/test` | Test prompt complexity classification & router decision |
| `GET` | `/api/v1/models` | List active LLM models and token pricing tiers |
| `GET` | `/api/v1/cache/stats` | Retrieve Redis cache hit/miss statistics |
| `DELETE`| `/api/v1/cache/clear` | Flush cache memory |
| `GET` | `/api/v1/analytics/overview`| Fetch dashboard overview stats & chart datasets |
| `POST` | `/api/v1/feedback` | Submit user rating (+1/-1) and comment |
| `GET` | `/api/v1/settings` | Get system thresholds & configuration |

---

## 🔮 Future Improvements

- Semantic caching via vector database embeddings (e.g. Qdrant / FAISS).
- Fine-tuning a domain-specific BERT / Llama classifier for complex prompt routing.
- Real-time WebSocket streaming for LLM token generation.

---
License: MIT
Developed for Final Year AI/ML Capstone Project.
