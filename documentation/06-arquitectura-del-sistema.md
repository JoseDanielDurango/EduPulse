DOCUMENTO 06 | ARQUITECTURA Y ESPECIFICACIÓN FUNCIONAL DEL SISTEMA

# DOCUMENTO — 06
# Arquitectura y Especificación Funcional del Sistema
### Plataforma Integral para la Investigación Mixta sobre Formación Docente e IA · Versión 2.0

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Naturaleza del documento** | Arquitectura de software, especificación funcional de requisitos, pipeline de datos de tres capas y seguridad de la información |
| **Documento** | 06 — Arquitectura del Sistema (Versión 2.0) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico para la articulación holística de los Modelos 01 al 08 de la plataforma EduPulse.*

---

## 1. Delimitación del Sistema

### Definición General
El sistema **EduPulse** se define como una plataforma web inteligente y co-piloto conversacional diseñado para mediar la recolección, estructuración, análisis cuantitativo y hermenéutico de testimonios de docentes en formación, articulando la ingeniería de prompts bajo el framework ROCAS, la cascada de modelos de lenguaje Google Gemini (`gemini-3.5-flash-lite` y fallbacks), la interacción dialógica socrática con **Cereza**, cuestionarios diagnósticos en escala Likert y rigurosos protocolos de control de acceso y seguridad.

### 1.1 Alcance Positivo: Lo que ES
* Guía entrevistas semiestructuradas adaptativas mediante la agente inteligente **Cereza**, calibrada con una personalidad magnética, perspicaz y profesional (inspirada en la elegancia de Bayonetta), adaptando su diálogo al semestre (1° a 10°) y sede universitaria.
* Evalúa de forma autónoma la saturación de datos cualitativos (`isInterviewFinished`) tras un mínimo de 6 intervenciones maduras a través de cuatro dimensiones de indagación orgánica.
* Proporciona instrumentos estructurados cuantitativos (Likert 1-5) con guardado automático de borradores offline (`localStorage`) y persistencia en Cloud Firestore.
* Despliega un panel analítico estadístico en tiempo real (`InstrumentResponsesViewer.tsx`) para cálculo de medias, desviaciones estándar y distribuciones porcentuales.
* Implementa control de acceso basado en roles (RBAC) con autenticación de doble factor para investigadores (Google OAuth contra lista blanca y PIN Maestro `0412`).
* Ofrece interacción multimodal (dictado por voz Web Speech API y teclado) y navegación móvil adaptativa (`MobileBottomNav.tsx`, botones de retorno y control de gestos `popstate`).
* Clasifica y triangula citas directas en la ontología deductiva (IA, Formación Docente, Efectos) y exporta datos estructurados hacia ATLAS.ti, NVivo y Google Sheets.

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
| - Captura en vivo de diálogo (texto y voz con Web Speech API).                |
| - Respuestas cuantitativas brutas a cuestionarios Likert.                     |
| - Registro secuencial con marcas temporales ISO 8601 en Cloud Firestore.      |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
| CAPA 2: TRANSFORMACIÓN Y PRIVACIDAD (Enriched & PII Shield Layer)             |
| - Seudo-anonimización automática con identificadores secuenciales (E01-E40).  |
| - Agregación de dimensiones cuantitativas y puntuación media por reactivo.    |
| - Auditoría de integridad ética y estado de consentimiento informado.         |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
| CAPA 3: ANÁLISIS, TRIANGULACIÓN Y CAQDAS (Analytical Layer)                   |
| - Pre-codificación semántica en '/api/analyze-interview'.                     |
| - Cálculo en vivo de medias (x̄) y desviaciones (σ) en ResponsesViewer.        |
| - Exportación interoperable hacia ATLAS.ti, NVivo, CSV y Google Sheets.        |
+-------------------------------------------------------------------------------+
```

---

## 4. Matriz de Requerimientos del Sistema

### 4.1 Requerimientos Funcionales (RF)
* **RF-01 (Diálogo Socrático Adaptativo):** Cereza modula su interacción al semestre del estudiante y a su nivel de práctica docente sin emitir calificaciones.
* **RF-02 (Saturación Cualitativa Autónoma):** El agente evalúa dinámicamente si los testimonios recolectados saturan las 4 dimensiones de indagación para concluir la sesión de forma armónica tras 6 o más turnos sustantivos.
* **RF-03 (Cuestionarios Diagnósticos con Autosave):** El sistema permite diligenciar encuestas Likert guardando automáticamente el progreso en `localStorage` ante interrupciones de red.
* **RF-04 (Visor Estadístico Descriptivo):** El panel de investigación calcula reactivamente medidas de tendencia central y distribuciones porcentuales de respuestas.
* **RF-05 (Autenticación Dual para Investigadores):** Acceso al panel administrativo condicionado a Google OAuth autorizado en lista blanca y PIN Maestro `0412`.
* **RF-06 (Salida Estructurada JSON):** Todas las respuestas del backend son emitidas bajo esquemas JSON estrictos procesables por React.
* **RF-07 (Navegación Móvil Segura):** Implementación de barra de navegación móvil inferior y captura de eventos de retroceso para evitar pérdidas accidentales de sesión.

### 4.2 Requerimientos No Funcionales (RNF)
* **RNF-01 (Personalidad y Calidez):** Cereza mantiene un tono magnético, ingenioso y maduro, desarmando la deseabilidad social sin perder el rigor universitario.
* **RNF-02 (Resiliencia y Cascada de Modelos):** Conmutación suave entre modelos de Google Gemini ante saturaciones 503 con reintentos automáticos.
* **RNF-03 (Protección PII y Habeas Data):** Anonimización sistemática bajo la Ley 1581 de 2012; prohibición de almacenar identificaciones civiles o teléfonos.
* **RNF-04 (Bilingüismo Completo):** Soporte idiomático íntegro (Español / Inglés) tanto en la interfaz gráfica como en las instrucciones de razonamiento del LLM.

---

## 5. Endpoints de la API Backend (`server.ts`)

| Endpoint | Método | Criterio de Seguridad | Función Principal |
| :--- | :--- | :--- | :--- |
| `/api/chat` | POST | Público / Token de Sesión | Procesa el turno conversacional, ejecuta la cascada de Gemini y devuelve el JSON estructurado de Cereza. |
| `/api/analyze-interview` | POST | Restringido a Investigadores | Ejecuta el análisis hermenéutico global, extrayendo citas categorizadas, puntos críticos y sentimiento. |
| `/api/health` | GET | Público (Anonimizado) | Diagnostica el estado del motor de IA, verificando la presencia de clave (`hasGeminiKey`) y latencia del servicio. |

---

## 6. Infraestructura Técnica y Stack Tecnológico

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion.
* **Backend:** Node.js, Express, TypeScript (`tsx`).
* **Motor de Inferencia:** Google GenAI SDK (`@google/genai`) con cascada de modelos (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3.8-flash`).
* **Base de Datos & Auth:** Google Cloud Firestore (tiempo real) y Firebase Authentication con reglas de seguridad declarativas.
* **Persistencia Local:** `localStorage` y React State para resiliencia offline.

---

## 7. Referencias Académicas Utilizadas
* Bass, L., Clements, P., & Kazman, R. (2021). *Software architecture in practice* (4th ed.). Addison-Wesley Professional.
* Creswell, J. W., & Creswell, J. D. (2018). *Research design: Qualitative, quantitative, and mixed methods approaches* (5th ed.). SAGE Publications.
* Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014). *Metodología de la investigación* (6.ª ed.). McGraw-Hill Education.
* Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.
* UNESCO. (2023). *Guidance for generative AI in education and research*. UNESCO Publishing.
