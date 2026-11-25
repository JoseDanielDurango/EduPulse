DOCUMENTO 03 | MODELO DEL ALUMNO: PERFIL DEL INFORMANTE Y TRAZA DEL PROGRESO

# DOCUMENTO — 03
# Modelo del Alumno: Perfil del Informante y Traza del Progreso
### Representación Epistémica y Curricular del Docente en Formación · Versión 2.3

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Componente documentado** | Modelo del Alumno (Representación pedagógica del informante, etapas formativas, traza cualitativa, diagnóstica cuantitativa y analítica hermenéutica individual) |
| **Documento** | 03 — Modelo del Alumno (Versión 2.3) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico para la especificación del perfil del participante, gestión del estado cognoscitivo, adaptación curricular del diálogo y resguardo de la traza de aprendizaje.*

---

## 1. Identificación del proyecto
* **Título del proyecto:** La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba.
* **Investigadores:** José Daniel Durango Caballero y Jefersson Ramírez Oviedo.
* **Director del proyecto:** Juan Carlos Giraldo Cardozo.
* **Institución:** Universidad de Córdoba (Montería, Córdoba, Colombia).
* **Unidad académica:** Facultad de Educación y Ciencias Humanas, Departamento de Informática Educativa.
* **Programa:** Licenciatura en Informática.
* **Componente documentado:** Modelo del Alumno (Representación pedagógica del aprendizaje e historial dialéctico del docente en formación).

## 2. Propósito del modelo
Representar, organizar y actualizar el estado cognoscitivo, curricular y contextual del docente en formación que interactúa con el sistema, con el fin de que la agente inteligente (**Cereza**) module dinámicamente la profundidad conceptual, el lenguaje, la complicidad socrática y las repreguntas reflexivas en función del semestre académico cursado, la sede geográfica y la etapa formativa dentro del plan de estudios.

## 3. Definición del modelo del alumno dentro del proyecto
En **EduPulse**, el alumno no es un usuario pasivo que recibe instrucción, sino el **informante clave** de una investigación cualitativa en educación superior (Creswell & Poth, 2018). El Modelo del Alumno formaliza en software las variables individuales y colectivas del futuro licenciado (nivel formativo, experiencia con IA, consentimiento ético, traza de intervenciones sustantivas y nivel de saturación discursiva), impidiendo que el agente dependa exclusivamente de la memoria probabilística del modelo de lenguaje.

## 4. Rol de la información del estudiante en la entrevista
La información del perfil estudiantil actúa como el calibrador primario del motor dialéctico de Cereza. Permite:
1. Adecuar las analogías, el tono lúdico y el nivel de exigencia didáctica al momento evolutivo del estudiante dentro del plan de estudios.
2. Evitar sesgos de intimidación provocados por tecnicismos curriculares ajenos a los semestres iniciales.
3. Prevenir desorientaciones temáticas, asegurando que a los estudiantes avanzados se les interpele sobre sus prácticas reales en colegios, mientras que a los principiantes se les consulte sobre sus rutinas de estudio y apropiación tecnológica.

## 5. Variables o dimensiones relevantes
El modelo captura y mantiene en memoria operativa las siguientes dimensiones:
* **Dimensión sociodemográfica y académica:** Código seudo-anonimizado (`E01`...`E40`), nombre de pila para trato personalizado, semestre académico (1° a 10°) y sede universitaria (Montería, Lorica, Planeta Rica, Sahagún, Montelíbano).
* **Dimensión de trayectoria curricular (Etapa formativa):** Clasificación determinista en tres etapas (Fundamentación, Desarrollo Didáctico, Formación Avanzada).
* **Dimensión de consentimiento y ética:** Estado formal de aceptación del consentimiento informado para investigación académica (`consent: true`).
* **Dimensión de progresión y saturación cualitativa:** Conteo de intervenciones sustantivas (`participantTurns`), fases cualitativas recorridas y banderas de saturación (`isInterviewFinished`).
* **Dimensión diagnóstica cuantitativa:** Registro y sincronización de respuestas en los instrumentos Likert (Documento 07).
* **Dimensión de interacción multimodal:** Modalidad de respuesta (entrada por teclado o dictado por voz mediante Web Speech API).

## 6. Características del docente en formación
Los participantes son estudiantes activos de la Licenciatura en Informática de la Universidad de Córdoba:
* Jóvenes en formación profesional con una marcada inclinación hacia la tecnología educativa, el desarrollo computacional y la creación audiovisual.
* Diversidad en sus trayectorias previas de acceso digital, condicionadas por las brechas de conectividad del departamento de Córdoba.
* Distintos grados de familiaridad con modelos generativos (desde usuarios exploratorios de ChatGPT hasta usuarios cotidianos en programación y diseño).

## 7. Conocimientos previos y etapas formativas
* **Semestres iniciales (1° a 3°):** Saberes básicos en algoritmos, matemáticas, ofimática y primeros conceptos de comunicación visual. Carecen de formación en didácticas específicas y diseño curricular.
* **Semestres intermedios (4° a 6°):** Dominio de estructuras de datos, producción de medios educativos, teorías del aprendizaje y diseño de ambientes virtuales.
* **Semestres avanzados (7° a 10°):** Formación pedagógica madura, transposición didáctica, planeación de secuencias de clase y experiencia directa con escolares en instituciones educativas públicas o privadas.

## 8. Capacidades y destrezas observables
* Habilidad operativa para interactuar con interfaces gráficas, herramientas web e inteligencias artificiales generativas.
* Capacidad de síntesis, verbalización de anécdotas académicas y reflexión crítica sobre sus propios procesos de aprendizaje.
* Destrezas multimodales para articular texto, audio e ideas visuales en sus explicaciones.

## 9. Necesidades de aprendizaje y formación
* Esclarecimiento de pautas institucionales claras sobre qué constituye uso ético y deshonestidad académica en el uso de IA.
* Desarrollo de criterio pedagógico para discernir cuándo una herramienta tecnológica aporta valor formativo y cuándo introduce superficialidad o dependencia cognitiva (efecto muleta).
* Formación en verificación crítica de código generado y mitigación de alucinaciones en materiales didácticos.

## 10. Adaptación pedagógica por etapas formativas
El subsistema de orientación pedagógica (`getPedagogicalOrientation` en `server.ts`) estructura el comportamiento de Cereza en tres bloques rigurosos:

| Etapa Formativa | Semestres Comprendidos | Perfil Pedagógico del Alumno | Reglas de Intervención del Agente Cereza |
| :--- | :--- | :--- | :--- |
| **Etapa 1: Fundamentación** | 1° a 3° Semestre | Aprendiz universitario inicial. Asimilando vida académica y fundamentos computacionales. Sin experiencia en colegios. | • Tono magnético, cercano y motivador; cero tecnicismos intimidantes.<br>• Preguntas enfocadas en su experiencia personal como aprendiz con la IA (resolver dudas, resumir lecturas, entender código inicial).<br>• **Regla negativa estricta:** Prohibido preguntar por planeación curricular escolar o evaluación de alumnos. |
| **Etapa 2: Desarrollo Didáctico** | 4° a 6° Semestre | Formación didáctica en desarrollo. Cursa didáctica de la informática y producción de medios. Diseña microclases. | • Tono estimulante, reflexivo, con complicidad socrática e ingenio.<br>• Conecta la técnica con la enseñanza: diseño de recursos educativos con IA, guías interactivas y material multimedia.<br>• Indaga cómo verifica la veracidad del código y qué debates éticos han tenido en sus materias. |
| **Etapa 3: Formación Avanzada** | 7° a 10° Semestre | Docente en formación avanzado. Prácticas pedagógicas activas en colegios de Córdoba. Sólido criterio profesional. | • Tono de diálogo colegiado entre pares educadores con refinada agudeza.<br>• Profundiza en transposición didáctica mediada por IA, qué ocurre cuando los escolares usan IA en clase, dilemas evaluativos y autonomía docente.<br>• Desafía cordialmente al estudiante a reflexionar sobre si la IA es una aliada o una muleta cognitiva. |

## 11. Representación técnica del estado en software
El estado del alumno se almacena y tipifica en TypeScript mediante la estructura `ParticipantState`:

```typescript
export interface ParticipantState {
  studentCode: string;               // Identificador alfanumérico (ej: E01, E02... E40)
  name: string;                      // Nombre de pila para trato personalizado
  semester: string;                  // Semestre reportado (ej: "6° Semestre")
  stage: 'initial' |                 // Semestres 1 a 3 (Fundamentación)
         'intermediate' |            // Semestres 4 a 6 (Desarrollo Didáctico)
         'advanced';                 // Semestres 7 a 10 (Práctica Docente)
  centerLocation: string;            // Sede (Montería, Lorica, Planeta Rica, etc.)
  consentGiven: boolean;             // Validación de consentimiento ético informado
  participantTurns: number;          // Conteo de intervenciones sustantivas del informante
  currentDimension: string;          // Dimensión cualitativa activa
  qualitativePhase: string;          // Fase metodológica (Exploración, Profundización, Cierre)
  isInterviewFinished: boolean;      // Bandera de saturación alcanzada
  modalityUsed: 'text' | 'voice';     // Modalidad de interacción predominante
}
```

## 12. Persistencia y Trazabilidad Epistemológica
* **Persistencia en la Nube:** El estado se sincroniza en tiempo real en la colección `sessions` de Google Cloud Firestore, permitiendo restaurar la sesión ante desconexiones fortuitas.
* **Trazabilidad Epistemológica:** Permite vincular cada cita textual extraída en el informe final con la etapa formativa y sede del participante, garantizando la triangulación metodológica y el cruce con los datos psicométricos de la colección `instrument_responses`.

## 13. Límites del modelo
* El agente **no elabora perfiles psicológicos, conductuales ni actitudinales** del estudiante.
* El sistema **no califica ni otorga notas** de aprovechamiento académico.
* No se almacenan datos personales sensibles como números de identificación personal, correos privados o direcciones residenciales, preservando el anonimato estricto bajo codificación alfa-numérica (`E01`, `E02`...).

## 14. Relación con la toma de decisiones del entrevistador
El Modelo del Alumno condiciona la directriz de sistema (*System Instruction*) inyectada a Gemini en cada llamada a la API. Al delimitar la etapa formativa, garantiza que Cereza nunca asuma un nivel de experticia curricular irreal ni subestime las capacidades reflexivas de un estudiante a punto de graduarse.

## 15. Síntesis del modelo
El Modelo del Alumno en EduPulse sistematiza la complejidad de la comunidad estudiantil de la Licenciatura en Informática de la Universidad de Córdoba. Al sustituir la rigidez de las encuestas tradicionales por una gestión dinámica del perfil formativo, dota a Cereza de la flexibilidad requerida para interpelar a cada docente en formación desde su momento específico de desarrollo profesional, produciendo datos cualitativos y diagnósticos de alta densidad y validez científica.

## 16. Referencias académicas utilizadas
* Bandura, A. (1997). *Self-efficacy: The exercise of control*. W. H. Freeman and Company.
* Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, H., & Mariman, R. (2024). Generative AI can harm learning: Evidence from high school mathematics. *SSRN Electronic Journal*. https://doi.org/10.2139/ssrn.4895486
* Bransford, J. D., Brown, A. L., & Cocking, R. R. (2000). *How people learn: Brain, mind, experience, and school*. National Academy Press.
* Creswell, J. W., & Poth, C. N. (2018). *Qualitative inquiry and research design: Choosing among five approaches* (4th ed.). SAGE Publications.
* Flick, U. (2018). *An introduction to qualitative research* (6th ed.). SAGE Publications.
* Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014). *Metodología de la investigación* (6.ª ed.). McGraw-Hill Education.
* Kvale, S. (2007). *Doing interviews*. SAGE Publications. https://doi.org/10.4135/9781849208963
* Schön, D. A. (1983). *The reflective practitioner: How professionals think in action*. Basic Books.
* Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.

---

# English Version

DOCUMENT 03 | STUDENT MODEL: INFORMANT PROFILE AND PROGRESS TRACE

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
