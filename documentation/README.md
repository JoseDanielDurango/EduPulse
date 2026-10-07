# Documentación Técnica, Pedagógica y Metodológica de EduPulse

Este directorio reúne la especificación formal y exhaustiva de la plataforma y del agente inteligente **EduPulse**, estructurada bajo la clásica arquitectura de **Sistemas Inteligentes en Educación** adaptada a modelos de lenguaje extensos (LLMs), orientada a la **recolección, procesamiento y análisis hermenéutico de datos cualitativos** para la investigación de grado en la Universidad de Córdoba.

Cada uno de los seis documentos técnicos ha sido elaborado con el máximo nivel de rigor metodológico y de desarrollo conceptual, incorporando tablas de especificación, matrices de control, delimitaciones operativas y referencias académicas normalizadas según las normas de la **American Psychological Association (APA, 7.ª edición)**.

---

## Ficha Técnica del Proyecto

| Campo | Detalle |
| :--- | :--- |
| **Título del proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Institución** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas |
| **Programa académico** | Licenciatura en Informática con Énfasis en Medios Audiovisuales |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Línea de investigación** | Estudio de impacto de las tecnologías de la información y comunicación en educación · Sublínea: Evaluación educativa y TIC |
| **Población y muestra** | Población: ~430 estudiantes activos del programa · Muestra: 8 a 12 informantes clave en formación docente |
| **Ubicación y año** | Montería, Córdoba, Colombia · 2025–2026 |

---

## Estructura de los Seis Componentes Documentales

```text
documentation/
├── README.md                          # Índice general, mapa conceptual y ficha institucional
├── 01-modelo-del-tutor.md              # Modelo del Tutor: Mediación cualitativa, socrática y probing hermenéutico (20 secciones)
├── 02-modelo-del-conocimiento.md       # Modelo del Conocimiento: Categorías, saberes curriculares, TPACK, DigCompEdu y UNESCO (22 secciones)
├── 03-modelo-del-alumno.md             # Modelo del Alumno: Perfil del informante, etapas formativas (1°-10°) y traza cognitiva (20 secciones)
├── 04-modelo-del-mundo.md              # Modelo del Mundo (DESIGN.md): Metáfora del café, resiliencia, flujo HCI e inventario de vistas (8 secciones)
├── 05-prompt-maestro-rocas.md          # Especificación y Diseño del Prompt Maestro: Framework ROCAS, código, red teaming y criterios (9 secciones)
└── 06-arquitectura-del-sistema.md      # Arquitectura y Especificación Funcional: Pipeline de 3 capas, roles, RF/RNF y control (12 secciones)
```

---

## Mapa Conceptual de Articulación de los Modelos

```text
+-------------------------------------------------------------------------------+
|                      05. PROMPT MAESTRO (FRAMEWORK ROCAS)                     |
|           Motor de Inferencia, Instrucciones de Sistema y Control JSON        |
+-------------------------------------------------------------------------------+
         │                               │                              │
         ▼                               ▼                              ▼
+------------------+           +------------------+           +------------------+
| 01. MODELO       |           | 02. MODELO       |           | 03. MODELO       |
| DEL TUTOR        |           | DEL CONOCIMIENTO |           | DEL ALUMNO       |
| (Cómo mediar:    |           | (Qué investigar: |           | (A quién guiar:  |
| Probing, ética,  |           | Categorías A-B-C,|           | Semestre, etapa, |
| neutralidad)     |           | TPACK, DigComp)  |           | perfil formativo)|
+------------------+           +------------------+           +------------------+
         │                               │                              │
         +───────────────────────────────+──────────────────────────────+
                                         │
                                         ▼
+-------------------------------------------------------------------------------+
| 04. MODELO DEL MUNDO / DESIGN.md (Entorno conversacional, Web Speech, UX/UI)  |
+-------------------------------------------------------------------------------+
                                         │
                                         ▼
+-------------------------------------------------------------------------------+
| 06. ARQUITECTURA DEL SISTEMA (Pipeline de 3 capas, Firestore, CAQDAS, PII)    |
+-------------------------------------------------------------------------------+
```

---

## Articulación con los Capítulos del Informe de Investigación

1. **Capítulo 3 (Diseño Metodológico):**
   * Respaldado por el **Documento 01 (Modelo del Tutor)** y el **Documento 02 (Modelo del Conocimiento)**. Operacionaliza el guion de entrevista semiestructurada, los criterios de neutralidad axiológica, el protocolo de repregunta reflexiva (*probing*) y la ontología de categorías deductivas (Tabla 1 de la tesis).
2. **Capítulo 4 (Desarrollo Tecnopedagógico e Intervención):**
   * Respaldado por el **Documento 03 (Modelo del Alumno)**, el **Documento 04 (Modelo del Mundo / DESIGN.md)** y el **Documento 05 (Prompt Maestro ROCAS)**. Describe la adaptación curricular por etapas formativas, la interacción multimodal por voz y la ingeniería de instrucciones que rige a Maya.
3. **Capítulo 5 (Análisis de Resultados y Triangulación):**
   * Respaldado por el **Documento 06 (Arquitectura del Sistema)**. Fundamenta el pipeline de datos en tres capas, la desidentificación ética de los participantes (`E01`...`E12`), la pre-codificación automatizada en `/api/analyze-interview` y la exportación interoperable hacia herramientas CAQDAS (ATLAS.ti y NVivo).

---

## Normas de Citación y Estilo
Todos los documentos han sido estandarizados con citas en el texto y listas de referencias bibliográficas construidas bajo las directrices de la **7.ª edición de las Normas APA** (American Psychological Association, 2020), asegurando la validez y trazabilidad académica de las fuentes teóricas empleadas.
