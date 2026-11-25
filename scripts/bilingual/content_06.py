en_06 = """DOCUMENT 06 | SYSTEM ARCHITECTURE AND FUNCTIONAL SPECIFICATION

# DOCUMENT — 06
# System Architecture and Functional Specification
### Comprehensive Platform for Mixed Research on Teacher Education and AI · Version 2.3

| Field | Detail |
| :--- | :--- |
| **Project** | Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba |
| **Implementation Context** | University of Córdoba · Faculty of Education and Human Sciences · Bachelor in Computer Science Education |
| **Researchers** | José Daniel Durango Caballero and Jefersson Ramírez Oviedo |
| **Project Director** | Juan Carlos Giraldo Cardozo |
| **Document Scope** | Software architecture, functional requirements specification, three-layer data pipeline, Express endpoints, Google Cloud OAuth 2.0 integration, and security |
| **Document** | 06 — System Architecture (Version 2.3) |
| **Update Date** | November 2026 |

*Technical document for the holistic architectural articulation of Documents 01 through 08 of EduPulse.*

---

## 1. System Scope

### General Definition
**EduPulse** is defined as an intelligent web platform and conversational co-pilot designed to mediate the collection, structuring, quantitative analysis, and hermeneutic synthesis of pre-service teacher testimonies. It integrates prompt engineering under the ROCAS framework, Google Gemini language model cascades, Socratic dialogic interaction with **Cereza**, diagnostic Likert scale questionnaires, and robust security protocols.

### 1.1 Positive Scope: What It IS
* Guides adaptive semi-structured interviews through intelligent agent **Cereza**, tailoring dialogue to semester (1st-10th) and regional campus.
* Dynamically evaluates qualitative data saturation (`isInterviewFinished`) after 6+ substantive turns across 4 organic inquiry dimensions.
* Incorporates a **Resilient Qualitative Synthesis Engine (`qualitativeSynthesis.ts`)** resolving race conditions upon completion and offering a deterministic fallback.
* Provides structured quantitative instruments (Likert scales and frequency matrices) with guided row-by-row validation and offline draft autosave (`localStorage`).
* Features a **Google Forms-style Visual Analytics Suite** with general demographic charts and individualized qualitative analytics (competency radar and dialogue sentiment).
* Implements a **Dual Voice Engine** combining native `MediaRecorder` capture, real-time audio visualizer (`LiveMicVisualizer`), and backend multimodal transcription (`/api/transcribe-audio`).
* Integrates **Google OAuth 2.0 and Google Sheets API v4** (`/api/export-sheets`), generating 3-tab structured spreadsheets directly in the researcher's Google Drive.
* Implements Role-Based Access Control (RBAC) with researcher 2FA (Google OAuth whitelist + Master PIN `0412`).
* Offers responsive mobile navigation (`MobileBottomNav.tsx`, universal `ArrowLeft` return buttons, and `popstate` gesture guards).

### 1.2 Boundaries: What It IS NOT
* **Not an assessment or grading system:** Does not assign grades or judge student academic standing.
* **Not a generic chatbot:** Strictly focused on the pedagogical and curricular context of Computer Science Education at UniCórdoba.
* **Does not replace human researcher analysis:** Pre-categorizes and streamlines data collection; final hermeneutic interpretation belongs exclusively to thesis authors.
* **Does not store sensitive PII:** Does not collect national ID cards, private phone numbers, or passwords.

### 1.3 Architectural Flow

```text
Multimodal Input (Voice / Text / Likert Questionnaire)
                        │
                        ▼
Profile Interpretation (Student Model + Semester + Campus)
                        │
                        ▼
Epistemic Ontology & Script (Knowledge Model + Law 2626)
                        │
                        ▼
Socratic Reasoning & Probing (Tutor Model + ROCAS Rules)
                        │
                        ▼
Resilient Inference Cascade (gemini-2.5-flash -> fallbacks)
                        │
                        ▼
Reactive Persistence (Cloud Firestore: sessions & instrument_responses)
                        │
                        ▼
Mixed Triangulation & CAQDAS (SummaryView · ResponsesViewer · Sheets)
```

---

## 2. Traceability of the Eight System Components (01 to 08)
* **01. Tutor Model:** Defines the Socratic dialectical engine, Cereza persona, probing rules, and closure criteria.
* **02. Knowledge Model:** Epistemic corpus, TPACK, DigCompEdu, UNESCO guidelines, and Law 2626 of 2026.
* **03. Student Model:** Contextual filter, formative stages (Foundation, Didactic, Advanced), and turn tracking.
* **04. World Model:** Frutiger Aero glassmorphism UI, `MobileBottomNav`, popstate guard, and dual voice engine.
* **05. Master Prompt ROCAS:** Dual-language system instructions (ES/EN) in `server.ts`, strict JSON schema, temperature 0.4.
* **06. System Architecture:** Three-layer pipeline, Express endpoints, full TypeScript/Vite stack, and cloud deployment.
* **07. Instruments & Triangulation:** Likert questionnaires, statistical descriptive viewer, and mixed triangulation matrix.
* **08. Security & Access Control:** RBAC, 2FA (OAuth + PIN `0412`), Firestore rules, and Law 1581 Habeas Data compliance.

---

## 3. Three-Layer Data Pipeline
1. **Raw Ingestion Layer:** Dual voice capture (`MediaRecorder` + Web Audio API), multimodal transcription (`/api/transcribe-audio`), and raw Likert responses with ISO 8601 timestamps in Firestore.
2. **Transformation, Synthesis, and Privacy Layer:** Sequential pseudonymization (`E01`...`E40`), dual-engine qualitative synthesis (Gemini + local fallback), and PII email masking.
3. **Analysis, Triangulation, and CAQDAS Layer:** Semantic pre-coding, competency radar, Google Forms-style charts, Google Sheets 3-tab export, and interoperable CSV/TSV for ATLAS.ti and NVivo.

---

## 4. Backend API Endpoints (`server.ts`)

| Endpoint | Method | Security Level | Primary Function |
| :--- | :--- | :--- | :--- |
| `/api/chat` | POST | Session Token | Processes dialogue turn, executes Gemini cascade, and returns Cereza's structured JSON. |
| `/api/analyze-interview` | POST | Researchers Only | Runs hermeneutic analysis, extracting categorized verbatim quotes and sentiment. |
| `/api/transcribe-audio` | POST | Active Session | Receives audio blob, executes multimodal transcription, and returns accurate text. |
| `/api/export-sheets` | POST | Google OAuth 2.0 | Generates a 3-tab Google Sheet in the researcher's Google Drive via Sheets API v4. |
| `/api/health` | GET | Public (Anonymized) | Health check verifying AI engine readiness (`hasGeminiKey`) without exposing credentials. |
| `/api/global-analysis` | POST | Researchers Only | Generates consolidated macro-synthesis report triangulating all sessions and diagnostics. |

---

## 5. Technology Stack
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Web Audio API (`AudioContext`, `AnalyserNode`), Google Identity Services (GIS).
* **Backend:** Node.js, Express, TypeScript (`tsx`), Google Sheets API v4 REST client.
* **Artificial Intelligence:** Google GenAI SDK (`@google/genai`) with model cascade (`gemini-2.5-flash`, fallbacks).
* **Database & Auth:** Google Cloud Firestore (real-time) and Firebase Authentication.
* **Hosting & Deployment:** Cloud production deployment on Render.

---

## 6. Academic References
Standardized under APA 7th edition guidelines on software architecture, educational systems engineering, and mixed methods data processing.
"""
