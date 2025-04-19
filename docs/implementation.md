# 📈 Project PRD: Kepler Agent Investment Explorer

## 1. Overview

Build an interactive property investment tool where users can ask natural language questions and:

- Get intelligent responses from an AI agent.
- See live updates on an interactive Kepler.gl map.

**Primary use cases:**

- Identifying rental yield hotspots.
- Analysing risks by location.
- Forecasting investment returns.
- Exploring tenant demographics and trends.

**User experience:**

- Chat-like input.
- Dynamic map visualisation.
- Instant feedback loop (text + map updates).

---

## 2. Goals

- Enable real estate investors to explore markets interactively.
- Make complex datasets accessible through natural conversation.
- Deliver actionable insights visually and textually.

---

## 3. Core Features

| Feature                              | Description                                                     |
| :----------------------------------- | :-------------------------------------------------------------- |
| **Chat Interface**                   | Users type questions; agent responds with text + map updates.   |
| **Kepler Map View**                  | Interactive, zoomable map displaying investment data points.    |
| **Dynamic Dataset Injection**        | Backend agent generates Kepler-compatible datasets/configs.     |
| **Zustand Store**                    | Frontend state management for map data (datasets, config).      |
| **Agent Backend**                    | FastAPI service with AI agent or dummy logic for first version. |
| **Simple Authentication (optional)** | If needed for saving sessions/bookmarks.                        |

---

## 4. Technical Architecture

```plaintext
React + Vite (Frontend)
  |-- Kepler.gl integration (via KeplerGl component)
  |-- Zustand state store (datasets + config)
  |-- Axios client for backend communication

FastAPI (Backend)
  |-- Endpoint: POST /api/ask
  |-- Agent logic: parse question, return text + map data
  |-- Dummy or real data generation

Kepler.gl
  |-- Embedded map component
  |-- Dynamically updated via Redux dispatch (through Zustand watcher)
```

---

## 5. Implementation Plan

### Phase 1: Project Scaffold

- [x] Create Vite + React + TypeScript frontend.
- [x] Install Kepler.gl, Zustand, Axios.
- [x] Setup basic FastAPI backend server.
- [x] Setup proxy/API route handling between frontend and backend.

### Phase 2: Core Functionality

- [x] Build Zustand store: `datasets`, `config`, `setKeplerData()`
- [x] Build `MapView` and `MapUpdater` components.
- [x] Build `ChatBox` component for user input and displaying messages.
- [x] Connect `AgentClient` (Axios) to backend.
- [x] Generate fake data in backend (GeoJSON + config).
- [x] Return map data + text from backend on question.

### Phase 3: Frontend Enhancement

- [ ] Style chat and map layout (CSS or Tailwind).
- [ ] Animate map updates smoothly.
- [ ] Add loading indicators during agent response time.

### Phase 4: Backend Enhancement

- [ ] Replace fake data with dynamic property database queries.
- [ ] Integrate LLM or RAG pipeline for real agent responses.
- [ ] Add caching layer for frequent questions.

### Phase 5: Finalisation & Deployment

- [ ] Prepare production builds for frontend.
- [ ] Deploy backend to Vercel, Railway, or AWS.
- [ ] Setup domain, SSL, and environment variables.

---

## 6. Milestones

| Milestone                                      | Estimated Time |
| :--------------------------------------------- | :------------- |
| Basic working prototype                        | 2 days         |
| Functional MVP with fake data                  | 4-5 days       |
| Full production version with real data and LLM | 2-3 weeks      |

---

## 7. Success Criteria

- User can ask natural questions and see immediate map + chat updates.
- System responds within 2-5 seconds.
- Map accurately visualises the data discussed.
- Codebase is modular, clean, and scalable.

---

## 8. Future Enhancements (Post-MVP)

- Multi-language support.
- User account system (save searches/bookmarks).
- Comparison mode (split screen maps).
- Deeper data overlays (mortgage rates, renovation ROI heatmaps).
- Alerts/subscriptions for investors based on criteria.
