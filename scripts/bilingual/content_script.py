en_script = """# Technical Defense Presentation Script · EduPulse v2.3
### Software Engineering, UI/UX Design, and Cereza Conversational Agent
**Bachelor in Computer Science Education · University of Córdoba**

| Field | Detail |
| :--- | :--- |
| **Software Product** | EduPulse v2.3: Hybrid Web Platform and Intelligent Dialogic Agent |
| **Presenters (Developers)** | José Daniel Durango Caballero & Jefersson Ramírez Oviedo |
| **Project Director** | Mag. Juan Carlos Giraldo Cardozo |
| **Slide Decks** | `EduPulse_Development_and_Design_Final.pptx` / `EduPulse_Final_Defense_Presentation.pptx` (14 widescreen 16:9 slides) |
| **Production Environment** | [edupulse-575b.onrender.com](https://edupulse-575b.onrender.com) |
| **Estimated Exposition Time** | 15 to 18 minutes (followed by live demo and jury Q&A) |

---

## Slide Index and Timing Distribution

```text
Slide 01: Technical Cover & System Identity                     [01:00 min]
Slide 02: Software Vision & Engineering Challenges              [01:15 min]
Slide 03: Full-Stack Technical Architecture & Ecosystem         [01:30 min]
Slide 04: Frutiger Aero Modern Glassmorphism Design System      [01:30 min]
Slide 05: Mobile User Experience (UX) & Reactive Ergonomics     [01:15 min]
Slide 06: Conversational Agent Design: Cereza & Socratic Model  [01:45 min]
Slide 07: Prompt Engineering: ROCAS Framework on Backend        [01:30 min]
Slide 08: Development Timeline: Iterative Sprints (1 to 5)      [01:15 min]
Slide 09: Audio System Evolution: Dual-Engine Voice with AI     [01:45 min]
Slide 10: Questionnaire Module: Row-by-Row Guided Validation    [01:15 min]
Slide 11: Data Resilience: Race Condition Resolution            [01:30 min]
Slide 12: Google Forms-Style Visual Analytics Suite & Radar     [01:30 min]
Slide 13: Data Governance, RBAC Security, and Google OAuth 2.0  [01:15 min]
Slide 14: Live Production Demonstration & Technical Closure     [01:15 min]
                                            TOTAL ESTIMATE: ~18:00 min
```

---

## Detailed Slide-by-Slide Script

### Slide 01 · Technical Cover & System Identity
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"Good morning / afternoon, respected evaluation committee, Professor Juan Carlos Giraldo, and jurors. Today, we are proud to present the technical defense of **EduPulse v2.3**, a reactive web platform and intelligent conversational agent conceived and built from the ground up to transform data collection, diagnostic assessment, and qualitative and quantitative analysis in higher education.  
  > In this presentation, we will not limit ourselves to thematic context; rather, we will thoroughly break down our software engineering process, full-stack architectural decisions, Frutiger Aero Modern Glassmorphism interface design, Cereza's conversational engine, and the data resilience solutions that enabled us to deploy this platform to real production."*

### Slide 02 · Software Vision & Engineering Challenges
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"What technical challenge motivated EduPulse? Historically, complex perceptions have been gathered through static web surveys (Google Forms, Typeform, etc.). However, in educational research, these tools suffer from three severe engineering drawbacks: textbook answers skewed by social desirability bias, survey abandonment due to cognitive fatigue, and zero ability to probe when an answer is vague or contradictory.  
  > EduPulse's engineering vision was to replace rigid surveys with an interactive dialogic experience: an intelligent agent capable of reasoning in real time, detecting contradictions, applying reflective probing, and synthesizing findings in structured formats without sacrificing quantitative rigor."*

### Slide 03 · Full-Stack Technical Architecture & Ecosystem
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"EduPulse's architecture is anchored on a modern, decoupled full-stack ecosystem:  
  > * On the **Frontend**, we implemented React 19 with strict TypeScript, Tailwind CSS v4 for atomic design, and Lucide Icons, optimized for ultra-fast bundling through Vite 6.  
  > * On the **Backend**, we designed a Node.js and Express server that acts as a secure intermediary layer orchestrating the Google Gemini API (utilizing the multimodal 2.5 Flash family), safeguarding API credentials and locking inference temperature at 0.4 for deterministic accuracy.  
  > * For **Persistence**, we combined real-time Google Cloud Firestore with reactive offline-first `localStorage` caching.  
  > * In **Cloud Integrations**, we connected Google Cloud OAuth 2.0 for automated direct exports to Google Sheets and Google Drive with JWT tokens."*

### Slide 04 · Frutiger Aero Modern Glassmorphism Design System
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"In visual design, we deliberately broke away from flat, corporate minimalism. We revived and modernized **Frutiger Aero** combined with **Glassmorphism**:  
  > * Atmospheric color palette: Space Cyan (`#06B6D4`), deep oceanic navy (`#070D18`), validation emerald (`#10B981`), and accent magenta.  
  > * Translucent frosted glass components using `backdrop-blur-xl`, bioluminescent borders, and subtle light refractions.  
  > * An animated brand emblem symbolizing temporal control and academic reflection, granting dynamism and warmth to the interface without impairing readability."*

### Slide 05 · Mobile User Experience (UX) & Reactive Ergonomics
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"Over 75% of pre-service teachers access the web from mobile smartphones. Therefore, we crafted first-class mobile ergonomics:  
  > * A fixed bottom navigation bar (`MobileBottomNav`) with generous touch targets and tactile visual feedback.  
  > * Explicit on-screen return buttons (`ArrowLeft`) across all modal views and secondary panels.  
  > * A critical UX solution: **`popstate` event trapping**. On Android and iOS, native back-swipe gestures previously closed the active session prematurely. Our system intercepts browser history and displays an in-app confirmation modal, safeguarding the active interview from accidental loss."*

### Slide 06 · Conversational Agent Design: Cereza & Socratic Model
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"The heart of interaction is **Cereza**, our Socratic conversational agent. Unlike generic assistants, Cereza was modeled with a distinct, poised, and sharp persona:  
  > * She speaks as an intellectual colleague, establishing approachable peer-to-peer rapport.  
  > * When a student provides an evasive or textbook answer, Cereza challenges them Socratically with contrast probing, seeking lived anecdotes.  
  > * She utilizes reflective mirroring, echoing the student's own words to guide deeper inquiry.  
  > * Crucially, she possesses an **autonomous saturation engine**: rather than sticking to a static question count, she algorithmically tracks response density, concluding the dialogue organically between 6 and 8 substantive turns (`isInterviewFinished: true`)."*

### Slide 07 · Prompt Engineering: ROCAS Framework on Backend
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"To govern Cereza's reasoning on every conversational turn, we engineered in `server.ts` a system prompt structured under the **ROCAS** framework:  
  > * **Role:** Insightful reflective mentor in educational technology.  
  > * **Objective:** Explore teacher AI adoption while detecting the 'crutch effect' and intellectual agency.  
  > * **Context:** Pre-service teachers at UniCórdoba across diverse semesters and campuses.  
  > * **Actions:** Atomic single-question formulation, knowing wit upon clichés, and concurrent quote extraction.  
  > * **Output:** A strict JSON schema (`reply`, `dimension`, `identifiedNeed`, `directQuote`, `isInterviewFinished`).  
  > Thanks to temperature locking at 0.4 and Gemini 2.5 Flash, response latency remains under 1.2 seconds with 100% JSON contract compliance."*

### Slide 08 · Development Timeline: Iterative Sprints (1 to 5)
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"EduPulse was engineered following an agile iterative methodology across 5 major sprints:  
  > * **Sprint 1:** Base architecture, TypeScript/Vite scaffolding, and initial Google Gemini connectivity.  
  > * **Sprint 2:** Cereza agent modeling, Socratic prompt formulation, and turn management.  
  > * **Sprint 3:** Psychometric Likert module with reactive persistence in Cloud Firestore.  
  > * **Sprint 4:** Modern Frutiger Aero redesign, mobile bottom navigation, and PIN-secured admin portal.  
  > * **Sprint 5 (Version 2.3):** Dual-engine multimodal voice engine, row-by-row questionnaire validation, resilient local heuristic fallback, and Google Forms-style visual analytics."*

### Slide 09 · Audio System Evolution: Dual-Engine Voice with Multimodal AI
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"One of our greatest engineering challenges was voice input:  
  > * The browser's native `webkitSpeechRecognition` frequently crashed or lacked support on mobile browsers like Brave or iOS Safari.  
  > * To solve this permanently, we engineered a **Dual Voice Engine**:  
  >   1. Built `LiveMicVisualizer` using Web Audio API and HTML5 Canvas, visualizing real-time sinusoidal frequency waves.  
  >   2. Captured audio streams via native `MediaRecorder` in compressed webm/ogg format.  
  >   3. Streamed audio blobs to `/api/transcribe-audio`, where Gemini multimodal transcription accurately decodes speech without arbitrary timeouts."*

### Slide 10 · Questionnaire Module: Row-by-Row Guided Validation
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"In traditional web forms, missing an item in a 10-row matrix produces a generic error, forcing the user to search blindly.  
  > In EduPulse, we implemented **interactive guided validation**:  
  > * When a user attempts to submit with missing answers, an interactive banner surfaces dynamic **jump pills**.  
  > * Clicking any pill smoothly scrolls to the exact row and highlights it with an animated warning halo.  
  > * Matrix tables visually tag unanswered rows with a visible badge: 'Answer required'."*

### Slide 11 · Data Resilience: Race Condition Resolution
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"In earlier versions, closing the tab right when Cereza completed an interview could trigger a race condition before synthesis finished.  
  > We built the **Resilient Qualitative Synthesis Engine (`qualitativeSynthesis.ts`)**:  
  > * Enforces an asynchronous UI lock (`isSynthesizing`) until synthesis resolves.  
  > * If the network drops or the external API times out, the client automatically triggers a **deterministic local heuristic algorithm** that extracts quotes, computes sentiment, and generates the findings matrix. Result: **zero data loss**."*

### Slide 12 · Google Forms-Style Visual Analytics Suite & Radar
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"For data visualization, we engineered an analytics suite inspired by the ergonomic clarity of Google Forms:  
  > * **General Level:** Interactive SVG demographic donut charts and horizontal percentage frequency bars.  
  > * **Individual Level:** Select any participant code (`E01`...`E40`) to display their **Technopedagogical Competency Radar**, speech-turn sentiment, and categorized quote matrix.  
  > * One-click exports to CSV, TSV, and 3-tab Google Sheets."*

### Slide 13 · Data Governance, RBAC Security, and Google OAuth 2.0
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"In security and data governance:  
  > * **Habeas Data & Anonymity:** Students participate under alphanumeric codes (`E01`...`E40`); private contact channels are masked in the public interface.  
  > * **Two-Factor Access Control (RBAC):** Research views are guarded by Google OAuth whitelist verification and an ephemeral **Master PIN (`0412`)**.  
  > * **Google Cloud OAuth 2.0 Governance:** Normalized authorized origins (`edupulse-575b.onrender.com` and `localhost`) allow `/api/export-sheets` to export 3-tab spreadsheets directly to Google Drive."*

### Slide 14 · Live Production Demonstration & Technical Closure
* **Suggested Speaker (Joint):**
  > *"EduPulse is not a local lab prototype; it is a live web application in real production deployed on **`https://edupulse-575b.onrender.com`**.  
  > We will now proceed with a live demonstration of Cereza's dialogue, voice transcription with dynamic wave visualizer, and the visual analytics suite.  
  > We thank our project director, Mag. Juan Carlos Giraldo Cardozo, the faculty, and the students of Computer Science Education. We welcome your questions."*

---

## Technical Jury Q&A Bank

1. **How do you guarantee Cereza does not hallucinate quotes in the final matrix?**
   * *Answer:* Direct quotes originate exclusively from the student's text entries. The backend extracts verbatim strings under strict JSON constraints, cross-verified deterministically by `qualitativeSynthesis.ts` against the original transcript.

2. **Why build a dual voice engine instead of third-party libraries?**
   * *Answer:* Third-party tools often rely on subscription APIs or unstable Web Speech implementations on mobile. Our architecture (`MediaRecorder` + Gemini Multimodal in `/api/transcribe-audio`) provides total control, noise cancellation visual feedback, and zero additional operational cost.

3. **What security measures prevent unauthorized access to student records?**
   * *Answer:* Three-tier defense: Cloud Firestore rules allowing anonymous writes only with consent; Google OAuth email whitelist; and an ephemeral Master PIN for unlocking analytics dashboards.

4. **How does the system handle abrupt network disconnects?**
   * *Answer:* Offline-first architecture with reactive `localStorage` autosave. In-progress dialogue turns and Likert selections remain preserved in the browser, resuming synchronization automatically when connection restores.
"""
