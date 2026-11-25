en_03 = """DOCUMENT 03 | STUDENT MODEL: INFORMANT PROFILE AND PROGRESS TRACE

# DOCUMENT — 03
# Student Model: Informant Profile and Progress Trace
### Epistemic and Curricular Representation of Pre-Service Teachers · Version 2.3

| Field | Detail |
| :--- | :--- |
| **Project** | Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba |
| **Implementation Context** | University of Córdoba · Faculty of Education and Human Sciences · Bachelor in Computer Science Education |
| **Researchers** | José Daniel Durango Caballero and Jefersson Ramírez Oviedo |
| **Project Director** | Juan Carlos Giraldo Cardozo |
| **Documented Component** | Student Model (Pedagogical representation of the informant, formative stages, qualitative trace, quantitative diagnostic, and individual hermeneutic analytics) |
| **Document** | 03 — Student Model (Version 2.3) |
| **Update Date** | November 2026 |

*Technical document for the specification of the participant profile, cognitive state management, curricular dialogue adaptation, and learning trace safeguarding.*

---

## 1. Project Identification
* **Project Title:** Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba.
* **Researchers:** José Daniel Durango Caballero and Jefersson Ramírez Oviedo.
* **Project Director:** Juan Carlos Giraldo Cardozo.
* **Institution:** University of Córdoba (Montería, Córdoba, Colombia).
* **Academic Unit:** Faculty of Education and Human Sciences, Department of Educational Informatics.
* **Academic Program:** Bachelor in Computer Science Education (Licenciatura en Informática).
* **Documented Component:** Student Model (Pedagogical representation of learning and dialectical history of the pre-service teacher).

## 2. Purpose of the Model
To represent, organize, and update the cognitive, curricular, and contextual state of the pre-service teacher interacting with the system, enabling the intelligent agent (**Cereza**) to dynamically modulate conceptual depth, language, Socratic rapport, and reflective follow-up questions according to academic semester, regional campus, and curricular stage.

## 3. Definition of the Student Model within the Project
In **EduPulse**, the student is not a passive user receiving instruction, but the **key informant** of a qualitative research study in higher education. The Student Model formalizes in software the individual and collective variables of the future graduate (formative level, AI familiarity, ethical consent, substantive turn count, and saturation level), preventing the agent from relying solely on the probabilistic memory of the language model.

## 4. Role of Student Information in the Interview
Participant profile data serves as the primary calibrator for Cereza's dialectical engine, allowing it to:
1. Calibrate analogies, conversational tone, and didactic expectations to the student's formative milestone.
2. Prevent intimidation caused by advanced curricular jargon irrelevant to initial semesters.
3. Prevent thematic drift, ensuring advanced students are questioned on real school teaching practicum while beginners are consulted on study habits and initial tech adoption.

## 5. Relevant Variables and Dimensions
* **Sociodemographic & Academic Dimension:** Pseudonymized code (`E01`...`E40`), first name for personalized address, academic semester (1st to 10th), and university campus (Montería, Lorica, Planeta Rica, Sahagún, Montelíbano).
* **Curricular Trajectory Dimension (Formative Stage):** Deterministic classification into three stages (Foundation, Didactic Development, Advanced Practice).
* **Consent & Ethics Dimension:** Formal acceptance state of digital informed consent (`consent: true`).
* **Qualitative Progress & Saturation Dimension:** Substantive intervention count (`participantTurns`), qualitative phases covered, and saturation flags (`isInterviewFinished`).
* **Quantitative Diagnostic Dimension:** Record and synchronization of Likert scale responses (Document 07).
* **Multimodal Interaction Dimension:** Interaction modality (keyboard text entry or voice dictation).

## 6. Characteristics of Pre-Service Teachers
Participants are active students in Computer Science Education at the University of Córdoba:
* Future educators with a marked inclination toward educational technology, software development, and multimedia creation.
* Diverse backgrounds in digital access shaped by regional connectivity divides in Córdoba.
* Varying familiarity with generative models (from exploratory users to daily coders and designers).

## 7. Prior Knowledge and Formative Stages
* **Initial Semesters (1st to 3rd):** Foundational knowledge in algorithms, mathematics, and office productivity. No prior training in didactics or curricular design.
* **Intermediate Semesters (4th to 6th):** Mastery of data structures, educational media production, learning theories, and virtual environment design.
* **Advanced Semesters (7th to 10th):** Mature pedagogical training, didactic transposition, lesson planning, and direct classroom experience with schoolchildren in public and private institutions.

## 8. Pedagogical Adaptation by Formative Stages
The pedagogical guidance module (`getPedagogicalOrientation` in `server.ts`) structures Cereza's behavior across three rigorous blocks:

| Formative Stage | Semesters Included | Pedagogical Profile | Agent Intervention Rules |
| :--- | :--- | :--- | :--- |
| **Stage 1: Foundation** | 1st to 3rd Semester | Beginning university learner. Assimilating academic life and computer fundamentals. No school teaching experience. | • Magnetic, welcoming, and encouraging tone; zero intimidating jargon.<br>• Questions focused on personal learner experience with AI (resolving doubts, summarizing readings, understanding starter code).<br>• **Strict negative rule:** Forbidden to ask about school curricular planning or pupil assessment. |
| **Stage 2: Didactic Development** | 4th to 6th Semester | Developing didactic competence. Enrolled in didactics of computer science and media production. Designing micro-lessons. | • Stimulating, reflective tone with Socratic wit.<br>• Connects technology with instruction: designing educational media, interactive worksheets, and multimedia with AI.<br>• Explores code verification and ethical debates encountered in coursework. |
| **Stage 3: Advanced Practice** | 7th to 10th Semester | Advanced pre-service teacher. Active school practicum in Córdoba. Solid professional judgment. | • Collegial peer-to-peer dialogue with refined sharpness.<br>• Deepens into AI-mediated didactic transposition, pupil classroom AI usage, assessment dilemmas, and teacher agency.<br>• Cordially challenges the student to discern whether AI serves as an ally or a cognitive crutch. |

## 9. Software State Representation
Student state is stored and typed in TypeScript via the `ParticipantState` interface:

```typescript
export interface ParticipantState {
  studentCode: string;               // Alphanumeric identifier (e.g. E01, E02... E40)
  name: string;                      // First name for personalized rapport
  semester: string;                  // Reported semester (e.g. "6th Semester")
  stage: 'initial' |                 // Semesters 1 to 3 (Foundation)
         'intermediate' |            // Semesters 4 to 6 (Didactic Development)
         'advanced';                 // Semesters 7 to 10 (Teaching Practicum)
  centerLocation: string;            // Campus (Montería, Lorica, Planeta Rica, etc.)
  consentGiven: boolean;             // Informed ethical consent validation
  participantTurns: number;          // Count of substantive participant turns
  currentDimension: string;          // Active qualitative dimension
  qualitativePhase: string;          // Methodological phase (Exploration, Deepening, Closure)
  isInterviewFinished: boolean;      // Saturation flag reached
  modalityUsed: 'text' | 'voice';     // Predominant interaction modality
}
```

## 10. Persistence and Epistemological Traceability
* **Cloud Persistence:** State synchronizes in real time to the `sessions` collection in Google Cloud Firestore, enabling session resumption upon unexpected disconnects.
* **Epistemological Traceability:** Links every extracted quote to the participant's formative stage and campus, ensuring methodological triangulation with psychometric data in `instrument_responses`.

## 11. Model Boundaries
* The agent **does not create psychological, behavioral, or attitudinal profiles**.
* The system **does not assign grades or academic scores**.
* No sensitive personal identifiers (national IDs, private phone numbers, residential addresses) are collected, preserving strict anonymity under alphanumeric codes (`E01`...`E40`).

## 12. Synthesis of the Model
EduPulse's Student Model systematizes the diversity of the student body in Computer Science Education at UniCórdoba. By replacing survey rigidity with dynamic profile tracking, it provides Cereza with the flexibility to engage every pre-service educator at their specific developmental stage.

## 13. Academic References
Standardized under APA 7th edition guidelines on qualitative inquiry, cognitive development, teacher self-efficacy, and reflective practice.
"""
