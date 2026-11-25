# Documentación Técnica, Pedagógica y Metodológica de EduPulse
### Suite Integral de Ocho Componentes Arquitectónicos y Epistémicos · Versión 2.3

Este directorio reúne la especificación formal y exhaustiva de la plataforma y del agente inteligente **EduPulse**, estructurada bajo la clásica arquitectura de **Sistemas Inteligentes en Educación** adaptada a modelos de lenguaje extensos (LLMs), orientada a la **recolección, procesamiento y análisis mixto (hermenéutico y estadístico)** de datos para la investigación de grado en la Universidad de Córdoba.

Cada uno de los ocho documentos técnicos ha sido elaborado con el máximo nivel de rigor metodológico y de desarrollo conceptual, incorporando tablas de especificación, matrices de control, delimitaciones operativas y referencias académicas normalizadas según las normas de la **American Psychological Association (APA, 7.ª edición)**.

---

## Ficha Técnica del Proyecto

| Campo | Detalle |
| :--- | :--- |
| **Título del proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Institución** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas |
| **Programa académico** | Licenciatura en Informática |
| **Investigadores (Autores)** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Línea de investigación** | Estudio de impacto de las tecnologías de la información y comunicación en educación · Sublínea: Evaluación educativa y TIC |
| **Población y muestra** | Población: ~430 estudiantes activos del programa · Muestra: 20 a 40 informantes en formación docente |
| **Ubicación y año** | Montería, Córdoba, Colombia · 2025–2026 |

---

## Estructura de los Ocho Componentes Documentales

```text
documentation/
├── README.md                          # Índice general, mapa conceptual y articulación metodológica (v2.3)
├── 01-tutor-model.md              # Modelo del Tutor: Mediación cualitativa, socrática, voz de Cereza y motor resiliente (v2.3)
├── 02-knowledge-model.md       # Modelo del Conocimiento: Categorías, saberes curriculares, TPACK, Ley 2626 y pilares (v2.3)
├── 03-student-model.md             # Modelo del Alumno: Perfil del informante, etapas formativas (1°-10°) y traza mixta (v2.3)
├── 04-world-model.md              # Modelo del Mundo (DESIGN.md): Glassmorphism, UX móvil, voz dual y validación interactiva (v2.3)
├── 05-master-prompt-rocas.md          # Especificación del Prompt Maestro: Framework ROCAS, inferencia dual ES/EN y cascada Gemini (v2.3)
├── 06-system-architecture.md      # Arquitectura del Sistema: Pipeline de 3 capas, endpoints Express, OAuth2.0 y stack técnico (v2.3)
├── 07-instruments-and-triangulation.md  # Instrumentos y Triangulación: Suite Google Forms, pestaña de síntesis global y triangulación mixta (v2.3)
├── 08-security-and-access-control.md # Seguridad y Control de Acceso: RBAC, Google OAuth 2.0 whitelist, PIN #### y reglas Firestore (v2.3)
└── resources/                         # Recursos Ejecutables y Entregables Finales de Cierre de Semestre:
    ├── EduPulse_Technical_Document_v2.3.docx # Documento Técnico Maestro integral del semestre (Ingeniería, UI/UX, Agente)
    ├── presentation-defense-script.md        # Guion detallado de sustentación oral (14 diapositivas técnicas)
    ├── EduPulse_Development_and_Design_Final.pptx # Presentación oficial en formato panorámico 16:9
    └── EduPulse_Final_Defense_Presentation.pptx # Copia de respaldo para la defensa oral ante jurado
```

---

## Mapa Conceptual de Articulación de los Modelos

```text
+---------------------------------------------------------------------------------------+
|                         05. PROMPT MAESTRO (FRAMEWORK ROCAS)                          |
|             Motor de Inferencia, Cascada de Gemini y Salida Estructurada JSON         |
+---------------------------------------------------------------------------------------+
         │                                       │                               │
         ▼                                       ▼                               ▼
+-------------------------+             +-------------------------+    +-------------------------+
| 01. MODELO DEL TUTOR    |             | 02. MODELO CONOCIMIENTO |    | 03. MODELO DEL ALUMNO   |
| (Cómo dialogar:         |             | (Qué investigar:        |    | (A quién guiar:         |
| Cereza / Bayonetta aura,|             | Categorías A-B-C,       |    | Semestre, etapa formativa|
| probing socrático,      |             | TPACK, Ley 2626,        |    | 1°-10°, consentimiento, |
| saturación autónoma)    |             | teoría efecto muleta)   |    | traza de intervenciones)|
+-------------------------+             +-------------------------+    +-------------------------+
         │                                       │                               │
         +───────────────────────────────────────+───────────────────────────────+
                                                 │
                                                 ▼
+---------------------------------------------------------------------------------------+
| 04. MODELO DEL MUNDO (DESIGN.md: Interfaz Glassmorphic, UX móvil, Web Speech API)     |
+---------------------------------------------------------------------------------------+
         │                                                                       │
         ▼                                                                       ▼
+---------------------------------------+               +---------------------------------------+
| 07. INSTRUMENTOS Y TRIANGULACIÓN      |               | 08. SEGURIDAD Y CONTROL DE ACCESO     |
| (Diagnóstico cuantitativo Likert 1-5, |               | (RBAC, 2FA Google OAuth + PIN ####,   |
| autosave offline, visor estadístico)  |               | firestore.rules, PII y Ley 1581)      |
+---------------------------------------+               +---------------------------------------+
         │                                                                       │
         └───────────────────────────────────┬───────────────────────────────────┘
                                             │
                                             ▼
+---------------------------------------------------------------------------------------+
| 06. ARQUITECTURA DEL SISTEMA (Pipeline de 3 capas, endpoints Express y despliegue)   |
+---------------------------------------------------------------------------------------+
```

---

## Articulación con los Capítulos del Informe de Investigación

1. **Capítulo 3 (Diseño Metodológico):**
   * Respaldado por el **Documento 01 (Modelo del Tutor)**, el **Documento 02 (Modelo del Conocimiento)** y el **Documento 07 (Instrumentos y Triangulación)**. Fundamenta el enfoque multimétodo concurrente (QUAN + QUAL), la neutralidad axiológica, el protocolo de probing reflexivo y la validación de constructo de las escalas Likert.
2. **Capítulo 4 (Desarrollo Tecnopedagógico e Intervención):**
   * Respaldado por el **Documento 03 (Modelo del Alumno)**, el **Documento 04 (Modelo del Mundo / DESIGN.md)** y el **Documento 05 (Prompt Maestro ROCAS)**. Describe la adaptación curricular por etapas formativas (Fundamentación, Didáctica y Práctica Escolar), la experiencia accesible multimodal (voz y móvil) y la ingeniería de instrucciones que da vida a Cereza.
3. **Capítulo 5 (Análisis de Resultados, Triangulación y Gobernanza Ética):**
   * Respaldado por el **Documento 06 (Arquitectura del Sistema)**, el **Documento 07 (Instrumentos y Triangulación)** y el **Documento 08 (Seguridad y Control de Acceso)**. Describe el pipeline de datos en tres capas, la desidentificación ética de los participantes (`E01`...`E40`), la pre-codificación automatizada en `/api/analyze-interview`, la convergencia hermenéutica-estadística y la exportación estructurada hacia software CAQDAS (ATLAS.ti y NVivo).

---

## Normas de Citación y Estilo
Todos los documentos han sido rigurosamente estandarizados bajo las directrices de la **7.ª edición de las Normas APA** (American Psychological Association, 2020), asegurando la validez conceptual y la trazabilidad bibliográfica de las fuentes empleadas en el trabajo de grado.

---

# English Version

# Technical, Pedagogical, and Methodological Documentation of EduPulse
### Comprehensive Suite of Eight Architectural and Epistemic Components · Version 2.3

This directory contains the formal and comprehensive specification of the **EduPulse** platform and intelligent agent, structured under the classical architecture of **Intelligent Educational Systems** adapted for large language models (LLMs), oriented toward the **collection, processing, and mixed analysis (hermeneutic and statistical)** of data for undergraduate thesis research at the University of Córdoba.

Each of the eight technical documents has been crafted with the highest level of methodological rigor and conceptual development, incorporating specification tables, control matrices, operational boundaries, and standardized academic references according to the **American Psychological Association (APA, 7th edition)** standards.

---

## Project Technical Overview

| Field | Detail |
| :--- | :--- |
| **Project Title** | Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba |
| **Institution** | University of Córdoba · Faculty of Education and Human Sciences |
| **Academic Program** | Bachelor's Degree in Computer Science Education (Licenciatura en Informática) |
| **Researchers (Authors)** | José Daniel Durango Caballero and Jefersson Ramírez Oviedo |
| **Project Director** | Juan Carlos Giraldo Cardozo |
| **Research Line** | Impact study of information and communication technologies in education · Subline: Educational assessment and ICT |
| **Population and Sample** | Population: ~430 active students in the program · Sample: 20 to 40 pre-service teacher informants |
| **Location and Year** | Montería, Córdoba, Colombia · 2025–2026 |

---

## Structure of the Eight Documentation Components

```text
documentation/
├── README.md                          # General index, conceptual map, and methodological articulation (v2.3)
├── 01-tutor-model.md                  # Tutor Model: Qualitative mediation, Socratic probing, Cereza voice, and resilient engine (v2.3)
├── 02-knowledge-model.md              # Knowledge Model: Categories, curricular knowledge, TPACK, Law 2626, and pillars (v2.3)
├── 03-student-model.md                # Student Model: Informant profile, formative stages (1st-10th), and mixed trace (v2.3)
├── 04-world-model.md                  # World Model (DESIGN.md): Glassmorphism, mobile UX, dual voice, and interactive validation (v2.3)
├── 05-master-prompt-rocas.md          # Master Prompt Specification: ROCAS framework, dual ES/EN inference, and Gemini cascade (v2.3)
├── 06-system-architecture.md          # System Architecture: 3-layer pipeline, Express endpoints, OAuth 2.0, and technical stack (v2.3)
├── 07-instruments-and-triangulation.md# Instruments and Triangulation: Google Forms suite, global synthesis tab, and mixed triangulation (v2.3)
├── 08-security-and-access-control.md  # Security and Access Control: RBAC, Google OAuth 2.0 whitelist, PIN ####, and Firestore rules (v2.3)
└── resources/                         # Executable Resources and Final Semester Deliverables:
    ├── EduPulse_Technical_Document_v2.3.docx # Master Technical Document (Software Engineering, UI/UX, Agent Architecture)
    ├── presentation-defense-script.md # Detailed oral defense script (14 technical slides)
    ├── EduPulse_Development_and_Design_Final.pptx # Official widescreen 16:9 presentation slides
    └── EduPulse_Final_Defense_Presentation.pptx # Backup presentation copy for oral committee evaluation
```

---

## Conceptual Articulation Map of the Models

```text
+---------------------------------------------------------------------------------------+
|                         05. MASTER PROMPT (ROCAS FRAMEWORK)                           |
|             Inference Engine, Gemini Cascade, and JSON Structured Output              |
+---------------------------------------------------------------------------------------+
         │                                       │                               │
         ▼                                       ▼                               ▼
+-------------------------+             +-------------------------+    +-------------------------+
| 01. TUTOR MODEL         |             | 02. KNOWLEDGE MODEL     |    | 03. STUDENT MODEL       |
| (How to dialogue:       |             | (What to investigate:   |    | (Whom to guide:         |
| Cereza persona,         |             | Categories A-B-C,       |    | Semester, stage 1st-10th|
| Socratic probing,       |             | TPACK, Law 2626,        |    | consent, intervention   |
| autonomous saturation)  |             | crutch effect theory)   |    | trace)                  |
+-------------------------+             +-------------------------+    +-------------------------+
         │                                       │                               │
         +───────────────────────────────────────+───────────────────────────────+
                                                 │
                                                 ▼
+---------------------------------------------------------------------------------------+
| 04. WORLD MODEL (DESIGN.md: Glassmorphic Interface, Mobile UX, Web Audio & Speech)   |
+---------------------------------------------------------------------------------------+
         │                                                                       │
         ▼                                                                       ▼
+---------------------------------------+               +---------------------------------------+
| 07. INSTRUMENTS AND TRIANGULATION     |               | 08. SECURITY AND ACCESS CONTROL       |
| (Quantitative Likert 1-5 diagnostic,  |               | (RBAC, 2FA Google OAuth + PIN ####,   |
| offline autosave, statistical viewer) |               | firestore.rules, PII & Law 1581)      |
+---------------------------------------+               +---------------------------------------+
         │                                                                       │
         └───────────────────────────────────┬───────────────────────────────────┘
                                             │
                                             ▼
+---------------------------------------------------------------------------------------+
| 06. SYSTEM ARCHITECTURE (3-Layer Pipeline, Express Endpoints, and Cloud Deployment)   |
+---------------------------------------------------------------------------------------+
```

---

## Articulation with Thesis Report Chapters

1. **Chapter 3 (Methodological Design):**
   * Supported by **Document 01 (Tutor Model)**, **Document 02 (Knowledge Model)**, and **Document 07 (Instruments and Triangulation)**. Substantiates the concurrent mixed-methods design (QUAN + QUAL), axiological neutrality, reflective probing protocol, and construct validation of Likert scales.
2. **Chapter 4 (Technopedagogical Development and Intervention):**
   * Supported by **Document 03 (Student Model)**, **Document 04 (World Model / DESIGN.md)**, and **Document 05 (Master Prompt ROCAS)**. Describes curricular adaptation by formative stages (Foundation, Didactic Development, and Advanced Practicum), multimodal accessible experience (voice and mobile), and instruction engineering powering Cereza.
3. **Chapter 5 (Results Analysis, Triangulation, and Ethical Governance):**
   * Supported by **Document 06 (System Architecture)**, **Document 07 (Instruments and Triangulation)**, and **Document 08 (Security and Access Control)**. Details the three-layer data pipeline, ethical de-identification of participants (`E01`...`E40`), automated semantic pre-coding via `/api/analyze-interview`, hermeneutic-statistical convergence, and structured export to CAQDAS software (ATLAS.ti and NVivo).

---

## Citation and Style Standards
All documents have been rigorously standardized following the **7th edition of the APA Standards** (American Psychological Association, 2020), ensuring conceptual validity and bibliographic traceability of the sources utilized in the undergraduate research thesis.
