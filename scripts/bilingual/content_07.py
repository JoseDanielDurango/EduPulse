en_07 = """DOCUMENT 07 | QUANTITATIVE DIAGNOSTIC INSTRUMENTS AND MIXED TRIANGULATION

# DOCUMENT — 07
# Quantitative Diagnostic Instruments and Mixed Triangulation
### EduPulse Platform · Concurrent Mixed Methodological Approach · Version 2.3

| Field | Detail |
| :--- | :--- |
| **Project** | Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba |
| **Implementation Context** | University of Córdoba · Faculty of Education and Human Sciences · Bachelor in Computer Science Education |
| **Researchers** | José Daniel Durango Caballero and Jefersson Ramírez Oviedo |
| **Project Director** | Juan Carlos Giraldo Cardozo |
| **Documented Component** | Quantitative instruments (Structured Likert questionnaires, frequency matrices, guided interactive validation, Firestore persistence, Google Forms-style visual analytics suite, and hermeneutic-statistical triangulation protocol) |
| **Document** | 07 — Instruments and Triangulation (Version 2.3) |
| **Update Date** | November 2026 |

*Technical-methodological document for the specification of diagnostic questionnaires, descriptive psychometric analysis, and methodological convergence in mixed research.*

---

## 1. Epistemological Rationale of the Concurrent Mixed Approach

### 1.1 Institutional Identification
* **Project Title:** Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba.
* **Researchers:** José Daniel Durango Caballero and Jefersson Ramírez Oviedo.
* **Project Director:** Juan Carlos Giraldo Cardozo.
* **Institution:** University of Córdoba (Montería, Colombia).
* **Academic Unit:** Faculty of Education and Human Sciences · Bachelor in Computer Science Education.
* **Research Line:** Impact study of information and communication technologies in education · Subline: Educational assessment and ICT.

### 1.2 Methodological Justification of Concurrent Triangulation (QUAN + QUAL)
The research adopts a concurrent mixed triangulation design (**QUAN + QUAL**). While the heart of EduPulse lies in in-depth qualitative dialogue mediated by **Cereza**, quantitative instruments fulfill three vital functions:
1. **Convergent Validity and Robustness:** Contrast aggregate statistical self-efficacy trends with lived biographical reflections.
2. **Mitigating Social Desirability Bias:** Allow pre-service teachers to report their perceptions through standardized individual questionnaires.
3. **Diagnostic Baseline Mapping:** Establish an initial descriptive benchmark across academic semesters.

```text
+───────────────────────────────────────────────────────────────────────────+
|               CONCURRENT MIXED TRIANGULATION DESIGN                       |
+───────────────────────────────────────────────────────────────────────────+
                     │                                   │
                     ▼                                   ▼
    [ QUANTITATIVE PHASE (QUAN) ]       [ QUALITATIVE PHASE (QUAL) ]
     Instruments 1 & 2 (Likert 1-5)      Socratic interviews with Cereza
     Diagnostic informant sample         In-depth hermeneutic dialogue
     Firestore: instrument_responses     Firestore: sessions
                     │                                   │
                     ▼                                   ▼
          Descriptive Statistics              Thematic Pre-coding
          (Mean x̄, Std Dev σ)                 (Categorized verbatim quotes)
                     │                                   │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     [ MIXED TRIANGULATION MATRIX ]
                      Chapters 4 & 5 of Thesis Report
                      Convergence, complementarity, and tension
```

---

## 2. Specification of Instrument 1: AI Perceptions, Uses, and Appropriation
* **Population:** Students across semesters 1 to 10 in Computer Science Education.
* **Scale:** 5-Point Likert Scale (1 = Strongly Disagree / Never to 5 = Strongly Agree / Always).
* **Item Count:** 16 items distributed across 4 theoretical dimensions:
  * **D1: Frequency and Familiarity of Use:** Everyday usage, multimodal exploration, coding assistance, and autonomous exploration.
  * **D2: Perceived Usefulness in Learning:** Work structuring, task efficiency, conceptual dialogic understanding, and creativity stimulation.
  * **D3: Digital Competency and Self-Efficacy:** Prompt engineering, hallucination identification, didactic sequence integration, and technical fundamentals.
  * **D4: Ethical Awareness and Critical Judgment:** Attribution transparency, crutch effect concern, privacy verification, and curricular policy advocacy.

---

## 3. Specification of Instrument 2: Self-Efficacy in Pedagogical Practices with AI
* **Population:** Pre-service teachers in didactics, practicum, or intermediate/advanced semesters (4th to 10th).
* **Scale:** 5-Point Likert Scale (1 = Completely Unable / Very Low to 5 = Completely Confident / Very High).
* **Item Count:** 16 items across 4 dimensions:
  * **D1: Didactic Planning and Resources:** Unit planning, interactive multimedia creation, tool selection, and active learning design.
  * **D2: Mediation and Learning Assessment:** Classroom guidance, authentic assessment design, qualitative feedback, and critical debates.
  * **D3: Cognitive Autonomy and Crutch Effect Prevention:** Intellectual sovereignty, crutch diagnosis, pre-consultation scaffolding, and open problem formulation.
  * **D4: Curricular Transition and Regional Context:** Law 2626 leadership, adapting to low-connectivity schools, collaborative communities of practice, and continuous professional development.

---

## 4. Offline Persistence and Cloud Firestore Structure
* **Event-based Autosave:** Selections persist immediately in `localStorage` under `edupulse_instrument_draft_${instrumentId}_${userEmail}`.
* **Transparent Recovery:** Re-opening the form restores unsaved answers seamlessly.
* **Firestore Schema:** Persisted in `instrument_responses` root collection with student code (`E01`...`E40`), semester, campus, responses map, dimension subscores, and global mean.

---

## 5. Google Forms-Style Visual Analytics Suite
* **General Dashboard (`GoogleFormsCharts.tsx`):** Demographic donut charts (semesters, campuses) and horizontal percentage bar charts.
* **Individual Qualitative Analytics (`InterviewsAnalyticsView.tsx`):** Participant competency radar, dialogic sentiment breakdown, and categorized verbatim quote cards.
* **Global Written Synthesis Report Tab (`GlobalSynthesisReport.tsx`):**
  * Consolidated academic report triangulating qualitative interviews with Likert metrics.
  * Organized in 5 chapters: Methodological overview, executive summary & crutch effect analysis, 4-dimension qualitative meta-analysis, concurrent triangulation matrix, and 5 policy-pedagogical recommendations for UniCórdoba.
  * One-click export to Word/Docs and hot regeneration via `/api/global-analysis`.
* **RBAC Protection:** Restricted to authorized researchers via Google OAuth whitelist and Master PIN `0412`.

---

## 6. Concurrent Triangulation Protocol
Directly cross-references quantitative indicator means (e.g. `d4_p2` concern mean $\bar{x} = 4.38$) with qualitative dialogue excerpts (such as pre-service teachers describing how uncritical reliance on AI undermines lesson delivery mastery), demonstrating construct validity across thesis findings.

---

## 7. Academic References
Standardized under APA 7th edition guidelines covering mixed methodology, psychometrics, teacher self-efficacy, and UNESCO AI guidance.
"""
