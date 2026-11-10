# Documentación Técnica, Pedagógica y Metodológica de EduPulse
### Suite Integral de Ocho Componentes Arquitectónicos y Epistémicos · Versión 2.0

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
├── README.md                          # Índice general, mapa conceptual y articulación metodológica
├── 01-modelo-del-tutor.md              # Modelo del Tutor: Mediación cualitativa, socrática y voz magnética de Cereza (v2.0)
├── 02-modelo-del-conocimiento.md       # Modelo del Conocimiento: Categorías, saberes curriculares, TPACK, Ley 2626 y pilares (v2.0)
├── 03-modelo-del-alumno.md             # Modelo del Alumno: Perfil del informante, etapas formativas (1°-10°) y traza mixta (v2.0)
├── 04-modelo-del-mundo.md              # Modelo del Mundo (DESIGN.md): Glassmorphism, UX móvil, navegación popstate y vistas (v2.0)
├── 05-prompt-maestro-rocas.md          # Especificación del Prompt Maestro: Framework ROCAS, inferencia dual ES/EN y cascada Gemini (v2.0)
├── 06-arquitectura-del-sistema.md      # Arquitectura del Sistema: Pipeline de 3 capas, endpoints Express y stack técnico (v2.0)
├── 07-instrumentos-y-triangulacion.md  # Instrumentos y Triangulación: Cuestionarios Likert, autosave offline y convergencia mixta (v1.0)
└── 08-seguridad-y-control-de-acceso.md # Seguridad y Control de Acceso: RBAC, doble factor (OAuth + PIN 0412) y reglas Firestore (v1.0)
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
| (Diagnóstico cuantitativo Likert 1-5, |               | (RBAC, 2FA Google OAuth + PIN 0412,   |
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
