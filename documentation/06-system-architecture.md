DOCUMENTO 06 | ARQUITECTURA Y ESPECIFICACIÓN FUNCIONAL DEL SISTEMA

# DOCUMENTO — 06
# Arquitectura y Especificación Funcional del Sistema
### Plataforma Integral para la Investigación Mixta sobre Formación Docente e IA · Versión 2.3

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Naturaleza del documento** | Arquitectura de software, especificación funcional de requisitos, pipeline de datos de tres capas, endpoints Express, integración Google Cloud OAuth 2.0 y seguridad |
| **Documento** | 06 — Arquitectura del Sistema (Versión 2.3) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico para la articulación holística de los Modelos 01 al 08 de la plataforma EduPulse.*

---

## 1. Delimitación del Sistema

### Definición General
El sistema **EduPulse** se define como una plataforma web inteligente y co-piloto conversacional diseñado para mediar la recolección, estructuración, análisis cuantitativo y hermenéutico de testimonios de docentes en formación, articulando la ingeniería de prompts bajo el framework ROCAS, la cascada de modelos de lenguaje Google Gemini (`gemini-3.5-flash-lite` y fallbacks), la interacción dialógica socrática con **Cereza**, cuestionarios diagnósticos en escala Likert y rigurosos protocolos de control de acceso y seguridad.

### 1.1 Alcance Positivo: Lo que ES
* Guía entrevistas semiestructuradas adaptativas mediante la agente inteligente **Cereza**, calibrada con una personalidad magnética, perspicaz y profesional (inspirada en la elegancia de Bayonetta), adaptando su diálogo al semestre (1° a 10°) y sede universitaria.
* Evalúa de forma autónoma la saturación de datos cualitativos (`isInterviewFinished`) tras un mínimo de 6 intervenciones maduras a través de cuatro dimensiones de indagación orgánica.
* Incorpora un **Motor de Síntesis Cualitativa Resiliente (`qualitativeSynthesis.ts`)** que elimina condiciones de carrera al finalizar y ofrece un fallback determinista que garantiza la extracción de citas y resumen incluso ante caídas de red o cuota de API.
* Proporciona instrumentos estructurados cuantitativos (Likert y matrices de frecuencia) con validación interactiva guiada, detección de filas pendientes y guardado automático offline (`localStorage`).
* Despliega una **Suite de Analítica Visual tipo Google Forms** con gráficos generales (barras, donas demográficas) y análisis hermenéutico individualizado por informante (radar de competencias y sentimiento dialógico).
* Implementa **Motor de Voz Dual** combinando captura nativa con `MediaRecorder`, visualizador dinámico de audio en vivo (`LiveMicVisualizer`) y transcripción multimodal en backend con Google Gemini (`/api/transcribe-audio`).
* Integra **Google OAuth 2.0 y Google Sheets API v4** (`/api/export-sheets`), generando libros de cálculo automatizados con 3 pestañas estructuradas en el Google Drive de los investigadores con 1 clic.
* Implementa control de acceso basado en roles (RBAC) con autenticación para investigadores (Google OAuth contra lista blanca y PIN Maestro `0412`), restringiendo estrictamente la visualización de analíticas y transcripciones crudas.
* Ofrece navegación móvil adaptativa (`MobileBottomNav.tsx`, botones universales de retorno `ArrowLeft` y control de gestos `popstate` para prevenir cierres involuntarios).

### 1.2 Límites: Lo que NO ES
* **No es un sistema evaluativo o calificador:** No emite notas ni juzga el rendimiento académico del estudiante.
* **No es un chatbot genérico:** No atiende temas ajenos al contexto pedagógico y curricular de la Licenciatura en Informática de UniCórdoba.
* **No reemplaza el análisis humano:** Pre-categoriza y facilita la recolección; la interpretación hermenéutica final y la redacción de conclusiones corresponden privativamente a los investigadores de grado.
* **No almacena datos personales sensibles:** No recopila cédulas, números telefónicos privados ni contraseñas institucionales.

### 1.3 Principio Arquitectónico Central

```text
Entrada Multimodal (Voz / Texto / Cuestionario Likert)
                        │
                        ▼
Interpretación de Perfil (Modelo del Alumno + Semestre + Sede)
                        │
                        ▼
Ontología Epistémica y Guion (Modelo del Conocimiento + Ley 2626)
                        │
                        ▼
Razonamiento Socrático y Probing (Modelo del Tutor + Reglas ROCAS)
                        │
                        ▼
Cascada Resiliente de Inferencia (gemini-3.5-flash-lite -> gemini-3.5-flash)
                        │
                        ▼
Persistencia Reactiva (Cloud Firestore: sessions & instrument_responses)
                        │
                        ▼
Triangulación Mixta y CAQDAS (SummaryView · ResponsesViewer · Sheets)
```

---

## 2. Trazabilidad de los Ocho Componentes del Sistema (01 a 08)

| Componente Documental | Función en la Arquitectura de EduPulse | Aplicación Operativa en el Software |
| :--- | :--- | :--- |
| **01. Modelo del Tutor** | Define el motor dialéctico socrático y la personalidad de Cereza. | Reglas de probing, tono magnético, sutil ironía ante evasivas, prevención del efecto muleta y decisión autónoma de cierre. |
| **02. Modelo del Conocimiento** | Corpus teórico, ontología deductiva y marcos normativos. | Categorías deductivas (IA, Formación, Efectos), TPACK, DigCompEdu, directrices UNESCO y Ley 2626 de 2026. |
| **03. Modelo del Alumno** | Filtro contextual y gestor del perfil curricular del informante. | Inyección de la etapa formativa (Fundamentación 1°-3°, Didáctica 4°-6°, Práctica 7°-10°) y control de turnos (`participantTurns`). |
| **04. Modelo del Mundo** | Entorno conversacional, UX/UI, diseño móvil y resiliencia. | Interfaz Frutiger Aero glassmorphism, `MobileBottomNav`, botones de retroceso, guarda `popstate` y Web Speech API. |
| **05. Prompt Maestro ROCAS** | Instrucción maestra de inferencia en tiempo de ejecución. | System Instruction dual (ES/EN) en `server.ts`, esquema JSON estricto y temperatura 0.4. |
| **06. Arquitectura del Sistema** | Especificación técnica, pipeline en tres capas y stack completo. | Pipeline de datos, endpoints Express, TypeScript, Vite, Firebase y despliegue en la nube. |
| **07. Instrumentos y Triangulación** | Diagnóstico cuantitativo y convergencia multimétodo. | Cuestionarios Likert (Percepciones y Autoeficacia), persistencia en `instrument_responses` y visor estadístico. |
| **08. Seguridad y Control de Acceso**| Gobernanza de datos, RBAC y confidencialidad ética. | Doble factor de autenticación (Google OAuth + PIN `0412`), reglas `firestore.rules`, anonimización PII y Ley 1581. |

---

## 3. Pipeline de Datos en Tres Capas

```text
+-------------------------------------------------------------------------------+
| CAPA 1: INGESTA CRUDA (Raw Ingestion Layer)                                   |
| - Captura dual de voz (MediaRecorder + Web Audio API) y texto.                |
| - Transcripción multimodal en tiempo real vía '/api/transcribe-audio'.        |
| - Respuestas brutas a cuestionarios con validación interactiva guiada.        |
| - Registro secuencial con marcas temporales ISO 8601 en Cloud Firestore.      |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
| CAPA 2: TRANSFORMACIÓN, SÍNTESIS Y PRIVACIDAD (Enriched & Fallback Layer)     |
| - Seudo-anonimización automática con identificadores secuenciales (E01-E40).  |
| - Motor dual de síntesis cualitativa (Gemini + fallback local determinista).  |
| - Enmascaramiento de direcciones de correo electrónico en la interfaz pública.|
| - Auditoría de integridad ética y estado de consentimiento informado digital. |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
| CAPA 3: ANÁLISIS, TRIANGULACIÓN Y CAQDAS (Analytical Layer)                   |
| - Pre-codificación semántica y radar de competencias tecnopedagógicas.        |
| - Suite de gráficos tipo Google Forms (barras, donas demográficas y tablas).  |
| - Exportación automatizada a Google Drive (Sheets en 3 pestañas) vía OAuth2.0.|
| - Respaldo en CSV interoperable para software CAQDAS (ATLAS.ti / NVivo).      |
+-------------------------------------------------------------------------------+
```

---

## 4. Matriz de Requerimientos del Sistema

### 4.1 Requerimientos Funcionales (RF)
* **RF-01 (Diálogo Socrático Adaptativo):** Cereza modula su interacción al semestre del estudiante y a su nivel de práctica docente sin emitir calificaciones.
* **RF-02 (Saturación Cualitativa Autónoma):** El agente evalúa dinámicamente si los testimonios recolectados saturan las 4 dimensiones de indagación para concluir la sesión de forma armónica tras 6 o más turnos sustantivos.
* **RF-03 (Cuestionarios Diagnósticos con Autosave y Validación Guiada):** El sistema permite diligenciar encuestas Likert y matrices de frecuencia con guardado automático en `localStorage`, banner de validación con enlaces de salto interactivos y resaltado fila por fila.
* **RF-04 (Visor Estadístico Descriptivo y Gráficos Tipo Google Forms):** El panel de investigación calcula reactivamente medidas de tendencia central, frecuencias porcentuales y genera gráficos de barras y donas demográficas.
* **RF-05 (Autenticación Dual para Investigadores):** Acceso al panel administrativo y a las analíticas gráficas condicionado a Google OAuth autorizado en lista blanca y PIN Maestro `0412`.
* **RF-06 (Salida Estructurada JSON):** Todas las respuestas del backend son emitidas bajo esquemas JSON estrictos procesables por React.
* **RF-07 (Navegación Móvil Segura):** Implementación de barra de navegación móvil inferior, botones de retorno universales (`ArrowLeft`) y captura de eventos `popstate` para evitar pérdidas accidentales de sesión.
* **RF-08 (Motor de Voz Dual con Transcripción Multimodal):** Grabación nativa de audio mediante `MediaRecorder`, retroalimentación visual en vivo con `LiveMicVisualizer` y procesamiento neuronal en backend (`/api/transcribe-audio`).
* **RF-09 (Exportación Automatizada a Google Drive y Sheets):** Integración con Google Identity Services (GIS) para generar libros de cálculo estructurados en 3 pestañas directamente en el Google Drive de los investigadores mediante `/api/export-sheets`.
* **RF-10 (Analítica Hermenéutica Individualizada):** Visualizador cualitativo por participante que traza el radar de competencias docentes, polaridad de sentimiento y testimonios clasificados por categoría.
* **RF-11 (Síntesis Cualitativa Resiliente con Fallback):** Arquitectura que resuelve condiciones de carrera al finalizar y garantiza la extracción de citas cualitativas y resumen hermenéutico incluso si la API externa experimenta fallos de conectividad o límites de cuota.

### 4.2 Requerimientos No Funcionales (RNF)
* **RNF-01 (Personalidad y Calidez):** Cereza mantiene un tono magnético, ingenioso y maduro, desarmando la deseabilidad social sin perder el rigor universitario.
* **RNF-02 (Resiliencia y Cascada de Modelos):** Conmutación suave entre modelos de Google Gemini ante saturaciones 503 con reintentos automáticos y fallback heurístico local.
* **RNF-03 (Protección PII y Habeas Data):** Anonimización sistemática bajo la Ley 1581 de 2012; prohibición de almacenar identificaciones civiles o teléfonos privados.
* **RNF-04 (Bilingüismo Completo):** Soporte idiomático íntegro (Español / Inglés) tanto en la interfaz gráfica como en las instrucciones de razonamiento del LLM.

---

## 5. Endpoints de la API Backend (`server.ts`)

| Endpoint | Método | Criterio de Seguridad | Función Principal |
| :--- | :--- | :--- | :--- |
| `/api/chat` | POST | Público / Token de Sesión | Procesa el turno conversacional, ejecuta la cascada de Gemini y devuelve el JSON estructurado de Cereza. |
| `/api/analyze-interview` | POST | Restringido a Investigadores | Ejecuta el análisis hermenéutico global, extrayendo citas categorizadas, puntos críticos y sentimiento. |
| `/api/transcribe-audio` | POST | Público / Sesión de Entrevista | Recibe el audio crudo capturado por `MediaRecorder`, ejecuta inferencia multimodal con Google Gemini y devuelve la transcripción textual fidedigna. |
| `/api/export-sheets` | POST | Token Google OAuth 2.0 | Crea un libro de cálculo en Google Sheets v4 con 3 pestañas estructuradas (Ficha, Citas Categorizadas y Transcripción Completa) en el Drive del usuario. |
| `/api/health` | GET | Público (Anonimizado) | Diagnostica el estado del motor de IA, verificando la presencia de clave (`hasGeminiKey`) y latencia del servicio. |

---

## 6. Infraestructura Técnica y Stack Tecnológico

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Web Audio API (`AudioContext`, `AnalyserNode`), Google Identity Services (GIS).
* **Backend:** Node.js, Express, TypeScript (`tsx`), Google Sheets API v4 REST Client.
* **Motor de Inferencia:** Google GenAI SDK (`@google/genai`) con cascada de modelos (`gemini-2.5-flash`, `gemini-3.5-flash-lite`, fallbacks).
* **Base de Datos & Auth:** Google Cloud Firestore (tiempo real) y Firebase Authentication con reglas de seguridad declarativas.
* **Persistencia Local y Respaldo:** `localStorage` y React State para resiliencia offline y recuperación transparente de sesiones incompletas.

---

## 7. Referencias Académicas Utilizadas
* Bass, L., Clements, P., & Kazman, R. (2021). *Software architecture in practice* (4th ed.). Addison-Wesley Professional.
* Creswell, J. W., & Creswell, J. D. (2018). *Research design: Qualitative, quantitative, and mixed methods approaches* (5th ed.). SAGE Publications.
* Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014). *Metodología de la investigación* (6.ª ed.). McGraw-Hill Education.
* Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.
* UNESCO. (2023). *Guidance for generative AI in education and research*. UNESCO Publishing.

---

# English Version

DOCUMENT 06 | SYSTEM ARCHITECTURE AND FUNCTIONAL SPECIFICATION

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
