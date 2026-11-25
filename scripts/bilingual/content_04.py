en_04 = """DOCUMENT 04 | WORLD MODEL (DESIGN.MD): INTERFACE AND CONVERSATIONAL ECOSYSTEM

# DOCUMENT — 04
# World Model (DESIGN.md): Interface and Conversational Ecosystem
### Human-Computer Interaction Design, Glassmorphic Aesthetics, and Mobile UX · Version 2.3

| Field | Detail |
| :--- | :--- |
| **Project** | Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba |
| **Implementation Context** | University of Córdoba · Faculty of Education and Human Sciences · Bachelor in Computer Science Education |
| **Researchers** | José Daniel Durango Caballero and Jefersson Ramírez Oviedo |
| **Project Director** | Juan Carlos Giraldo Cardozo |
| **Documented Component** | World Model (DESIGN.md: Graphical interface, reflective dialogue metaphor, responsive mobile design, gesture navigation, dual-engine voice, interactive validation, Google Forms-style visual analytics, and view inventory) |
| **Document** | 04 — World Model (Version 2.3) |
| **Update Date** | November 2026 |

*Technical document for the specification of the visual environment, interface metaphor, mobile architecture, contextual resilience, and HCI flow of EduPulse.*

---

## 1. System Metaphor and Visual Aesthetics

### 1.1 Core Metaphor: The Pedagogical Café and Reflective Dialogue Room
To encourage open dialectical expression and mitigate social desirability bias, the interface abandons bureaucratic forms and virtual exam appearances. It embraces the metaphor of an intellectual meeting among educational colleagues:
* The pre-service educator dialogues with **Cereza**, an intelligent conversational mentor characterized by sophistication, poise, and subtle academic wit.
* No answers are judged as right or wrong; the focus lies on uncovering lived experiences, didactic tensions, and pedagogical appropriation.
* Eliminates punitive countdown timers, evaluation clocks, and numerical scoreboards.

### 1.2 Visual Aesthetics: Frutiger Aero Modern Glassmorphism
EduPulse adopts a sophisticated visual design grounded in **Modern Frutiger Aero**:
* **Backgrounds & Depth:** Deep oceanic palette in midnight blues (`#070d18`, `#0a1526`) with cyan, emerald, and sapphire radial gradients.
* **Translucent Glassmorphism:** Cards and panels featuring `backdrop-blur-md`, subtle bioluminescent borders (`border-white/10`), and diffused shadows providing tactile lightness.
* **Symbolic Timepiece Brand Icon:** An animated visual emblem accompanying the agent's interventions, providing warmth and distinction to the interface without compromising readability.

---

## 2. Material Conditions and Regional Resilience (UniCórdoba)
Interaction design is tailored to actual connectivity and infrastructure conditions in Montería and regional tutorial centers (Lorica, Planeta Rica, Sahagún, Montelíbano):

### 2.1 Latency Tolerance and Connectivity Fluctuations
* **Informative Micro-states:** Status indicators during Google Gemini inference (*"Cereza is reflecting..."*, *"Listening attentively..."*).
* **Instant Local Persistence:** Messages and questionnaires persist in reactive memory and `localStorage` prior to remote Firestore confirmation, preventing data loss during power outages or mobile signal drops.
* **Model Cascade and Automatic Retry:** The backend orchestrates a graceful retry mechanism switching across Gemini model endpoints (`gemini-2.5-flash`, `gemini-3.5-flash-lite`) upon 503 saturation.

### 2.2 Accessible Multimodal Engine: Dual Voice Architecture with Multimodal AI
To overcome the fragility of native browser voice recognition on mobile devices (where `webkitSpeechRecognition` frequently fails in iOS Safari, Android Brave, or Firefox), EduPulse deploys a **two-engine dual voice architecture**:
1. **Engine A: Native MediaRecorder with Live Canvas Visualizer (`LiveMicVisualizer`):**
   * Captures raw audio stream via `navigator.mediaDevices.getUserMedia({ audio: true })`.
   * Standard container formats (`audio/webm`, `audio/mp4`, `audio/ogg`, or `audio/wav`).
   * An interactive canvas (`LiveMicVisualizer`) processes frequency spectrum in real time using the Web Audio API (`AudioContext` and `AnalyserNode`), rendering dynamic emerald/cyan sine waves for immediate feedback.
2. **Backend Neural Transcription (`/api/transcribe-audio`):**
   * Audio blobs are POSTed to the Express server.
   * Google Gemini processes audio bytes multimodally, providing faithful transcripts with accurate punctuation and regional contextual understanding.
3. **Engine B: Browser Native Speech Recognition (*Fallback*):**
   * Instant alternative on compatible desktop Chrome browsers.
4. **Text-to-Speech (TTS):**
   * Modulated artificial voice for listening to Cereza's oral responses.
5. **Text-First Priority:**
   * Full keyboard operability for noisy university computer rooms or devices without microphones.

---

## 3. Navigation Architecture, Mobile Support, and Guided Validation

### 3.1 Mobile Bottom Navigation Bar (`MobileBottomNav.tsx`)
Floating ergonomic navigation bar optimized for smartphone thumb reach:
* Touch buttons for Qualitative Dialogue, Questionnaires, New Session, Language Switcher (ES/EN), and Research Portal.
* Luminous active state feedback.

### 3.2 In-App Go-Back Navigation
Explicit on-screen return buttons with `ArrowLeft` icon across the navbar, interview room, instrument forms, and analytics panels, allowing one-click return without relying on browser chrome buttons.

### 3.3 Hardware Gesture Interception (`popstate` + `beforeunload`)
* **HTML5 History PushState Interception:** Injects history states so swipe-back gestures on mobile prompt a confirmation modal (*"Do you wish to pause the dialogue? Your reflections will be securely saved"*), preventing accidental exits.
* **BeforeUnload Guard:** Prevents page reloads during active message generation.

### 3.4 Row-by-Row Interactive Questionnaire Validation (`InstrumentForm.tsx`)
* **Dynamic Pending Fields Banner:** Displays interactive jump pills (`missingFieldsList`) naming omitted items.
* **Smooth Scroll and Halo Highlight:** Clicking any pill scrolls smoothly (`scrollIntoView`) and animates an alert halo around the pending item.
* **Matrix Table Highlighting (`matrix_grid`):** Unanswered rows are highlighted individually with a visible *"Answer required"* badge.
* **One-Click Ethical Consent:** Quick-action button reducing cognitive friction.

---

## 4. Human-Computer Interaction (HCI) Flow

```text
[ Main Screen (Landing / Navbar) ]
                │
    ┌───────────┴───────────┐
    ▼                       ▼
[ Qualitative Dialogue ]  [ Quantitative Diagnostic ]
  (NewSessionModal)         (InstrumentsView)
    │                         │
    ▼                         ▼
[ InterviewRoom ]         [ InstrumentForm ]
  Dialogue with Cereza      Likert Scale (Autosave)
    │                         │
    ▼                         ▼
[ Cereza Saturation ]     [ Firestore Submission ]
    │                         │
    └───────────┬─────────────┘
                ▼
[ Research Portal (2FA) ]
  SummaryView · ResponsesViewer · CAQDAS / Sheets Export
```

### HCI Flow Stages Summary
1. **Entry & Consent:** Registration and informed consent validation; assigns alphanumeric code (`E01`).
2. **Opening with Distinction:** Welcoming address acknowledging the student's semester in Computer Science Education.
3. **Dialogue & Socratic Challenge:** Active listening, reflective echoing, and targeted follow-up probing.
4. **Saturation & Autonomous Closure:** Dynamic evaluation of thematic saturation after 6+ substantive turns; elegant synthesis.
5. **Consultation & Triangulation:** Researcher access via 2FA displaying transcripts, categorized quotes, and psychometric distributions.

---

## 5. Comprehensive View Inventory (System Screens)
* **V-01 (`Navbar.tsx`):** Responsive top navigation with dual language, return button, and admin trigger.
* **V-02 (`MobileBottomNav.tsx`):** Ergonomic bottom navigation bar for mobile smartphones.
* **V-03 (`NewSessionModal.tsx`):** Characterization modal and binding digital informed consent.
* **V-04 (`InterviewRoom.tsx`):** Interactive interview room with Cereza, live mic visualizer, and popstate guard.
* **V-05 (`InstrumentsView.tsx`):** Diagnostic questionnaire portal (Perceptions & Self-Efficacy).
* **V-06 (`InstrumentForm.tsx`):** Likert form with offline draft autosave (`localStorage`) and row-by-row validation.
* **V-07 (`AdminAuthModal.tsx`):** Two-factor authentication portal for researchers (Google OAuth + PIN 0412).
* **V-08 (`SessionsDashboard.tsx`):** Research supervision dashboard with real-time session filters.
* **V-09 (`InstrumentResponsesViewer.tsx`):** Quantitative dashboard with mean ($\bar{x}$), standard deviation ($\sigma$), and percentage distributions.
* **V-10 (`SummaryView.tsx`):** Qualitative matrix generated by `/api/analyze-interview` with categorized verbatim quotes.
* **V-11 (`GuidesManager.tsx`):** Administrative view for qualitative question guidelines.
* **V-12 (`ThesisProjectModal.tsx`):** Institutional information modal with project metadata.
* **V-13 (`GoogleFormsCharts.tsx`):** Visual quantitative charts (horizontal bar charts, donut charts).
* **V-14 (`InterviewsAnalyticsView.tsx`):** Individual participant analytics with competency radar and dialogue sentiment.
* **V-15 (`GlobalSynthesisReport.tsx`):** Consolidated macro-synthesis report tab with 5-chapter mixed analysis and Word/Docs export.

---

## 6. Academic References
Standardized under APA 7th edition guidelines on human-computer interaction, educational technology, and user experience design.
"""
