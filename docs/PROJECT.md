# 🗂️ Project Board: Kepler Agent Investment Explorer

_Reference: [docs/implementation.md](docs/implementation.md)_

## Phases & Tasks

### Phase 1: Project Scaffold

- [ ] Create Vite + React + TypeScript frontend
- [ ] Install Kepler.gl, Zustand, Axios
- [ ] Setup basic FastAPI backend server
- [ ] Setup proxy/API route handling between frontend and backend

### Phase 2: Core Functionality

- [ ] Build Zustand store: `datasets`, `config`, `setKeplerData()`
- [ ] Build `MapView` and `MapUpdater` components
- [ ] Build `ChatBox` component for user input and displaying messages
- [ ] Connect `AgentClient` (Axios) to backend
- [ ] Generate fake data in backend (GeoJSON + config)
- [ ] Return map data + text from backend on question

### Phase 3: Frontend Enhancement

- [ ] Style chat and map layout (CSS or Tailwind)
- [ ] Animate map updates smoothly
- [ ] Add loading indicators during agent response time

### Phase 4: Backend Enhancement

- [ ] Replace fake data with dynamic property database queries
- [ ] Integrate LLM or RAG pipeline for real agent responses
- [ ] Add caching layer for frequent questions

### Phase 5: Finalisation & Deployment

- [ ] Prepare production builds for frontend
- [ ] Deploy backend to Vercel, Railway, or AWS
- [ ] Setup domain, SSL, and environment variables

---

## Milestones

- [ ] **Basic working prototype** (2 days)
- [ ] **Functional MVP with fake data** (4-5 days)
- [ ] **Full production version with real data and LLM** (2-3 weeks)

---

## Success Criteria

- [ ] User can ask natural questions and see immediate map + chat updates
- [ ] System responds within 2-5 seconds
- [ ] Map accurately visualises the data discussed
- [ ] Codebase is modular, clean, and scalable

---

## Future Enhancements (Post-MVP)

- [ ] Multi-language support
- [ ] User account system (save searches/bookmarks)
- [ ] Comparison mode (split screen maps)
- [ ] Deeper data overlays (mortgage rates, renovation ROI heatmaps)
- [ ] Alerts/subscriptions for investors based on criteria
