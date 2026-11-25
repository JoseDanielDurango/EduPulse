DOCUMENTO 04 | MODELO DEL MUNDO (DESIGN.MD): INTERFAZ Y ECOSISTEMA CONVERSACIONAL

# DOCUMENTO — 04
# Modelo del Mundo (DESIGN.md): Interfaz y Ecosistema Conversacional
### Diseño de Interacción Humano-Computador, Estética Glassmorphic y UX Móvil · Versión 2.3

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Componente documentado** | Modelo del Mundo (DESIGN.md: Interfaz gráfica, metáfora del diálogo reflexivo, diseño responsive móvil, navegación por gestos, motor de voz dual, validación interactiva, analítica visual tipo Google Forms e inventario de vistas) |
| **Documento** | 04 — Modelo del Mundo (Versión 2.3) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico para la especificación del entorno visual, metáfora de interfaz, arquitectura móvil, resiliencia contextual y flujo HCI de EduPulse.*

---

## 1. Metáfora del Sistema y Estética Visual

### 1.1 Metáfora Principal: El Café Pedagógico y Sala de Diálogo Reflexivo
Para favorecer la apertura dialéctica y mitigar el sesgo de deseabilidad social o la intimidación tecnológica, la interfaz abandona deliberadamente la apariencia de "formularios burocráticos" o "exámenes virtuales". El sistema adopta la metáfora de un encuentro reflexivo entre colegas educadores:
* El docente en formación conversa con **Cereza**, una agente inteligente inspirada en la seguridad, distinción e ingenio maduro de Bayonetta, con un trato cercano, lúdico y de profunda exigencia académica.
* Se explicita que no existen respuestas correctas ni erróneas; el foco radica en desentrañar vivencias reales, tensiones formativas y apropiación didáctica.
* Se eliminan contadores regresivos punitivos, cronómetros de evaluación o calificaciones numéricas.

### 1.2 Estética Visual: Frutiger Aero Modern Glassmorphism
La dirección de arte de EduPulse implementa un estilo visual sofisticado basado en el **Frutiger Aero Moderno**:
* **Fondos y Profundidad:** Paleta oscura y elegante en tonos azul medianoche (`#070d18`, `#0a1526`) con gradientes radiales cian, esmeralda y zafiro.
* **Cristalismo Translúcido (*Glassmorphism*):** Paneles y tarjetas con `backdrop-blur-md`, bordes luminiscentes sutiles (`border-white/10`) y sombras difusas que generan una sensación de ligereza táctil.
* **Sello Simbólico de Cereza:** El reloj de Umbra (*Umbran Watch Symbol*), un sello esotérico y refinado con resplandores azul aguamarina, que acompaña las intervenciones del agente, dotándolo de personalidad y distinción.

---

## 2. Condiciones Materiales y Resiliencia Regional (UniCórdoba)

El diseño de interacción se fundamenta en las condiciones reales de conectividad e infraestructura en Montería y los centros de tutoría regionales (Lorica, Planeta Rica, Sahagún, Montelíbano):

### 2.1 Tolerancia a la Latencia y Fluctuaciones de Conectividad
* **Micro-estados informativos:** Indicadores sutiles durante la inferencia de Google Gemini (*"Cereza está reflexionando..."*, *"Escuchando con atención..."*).
* **Persistencia local inmediata:** Los mensajes e instrumentos se persisten localmente en memoria reactiva y `localStorage` antes de la confirmación remota en Firestore, impidiendo la pérdida de datos ante cortes eléctricos o pérdidas de señal celular.
* **Cascada de Modelos y Reintento Automático:** El backend orquesta un mecanismo de reintento suave que conmuta transparentemente entre modelos (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3.8-flash`) en caso de saturación 503, emitiendo mensajes de contingencia elegantes si la red colapsa temporalmente.

### 2.2 Enfoque Multimodal Accesible: Motor de Voz Dual con IA Multimodal
La interacción oral constituye una vía esencial para obtener relatos espontáneos y fluidos de los futuros educadores. Para superar la histórica fragilidad del reconocimiento de voz nativo en navegadores móviles (donde `webkitSpeechRecognition` suele estar deshabilitado o fallar en iOS Safari, Android Brave y Firefox), EduPulse implementa una **arquitectura de voz dual de dos motores**:

1. **Motor A: Grabación Nativa con MediaRecorder y Visualizador en Vivo (`LiveMicVisualizer`):**
   * El cliente solicita acceso al micrófono mediante `navigator.mediaDevices.getUserMedia({ audio: true })`.
   * Captura el flujo de audio puro en contenedores estándar (`audio/webm`, `audio/mp4`, `audio/ogg` o `audio/wav`).
   * Un canvas interactivo (`LiveMicVisualizer`) procesa en tiempo real el espectro de frecuencias mediante la Web Audio API (`AudioContext` y `AnalyserNode`), renderizando ondas sonoras dinámicas color esmeralda/cian que ofrecen retroalimentación háptica y visual inmediata al estudiante.
2. **Transcripción Neuronal en Backend (`/api/transcribe-audio`):**
   * Al detener la grabación, el blob de audio se envía mediante `POST` al servidor Express.
   * El endpoint procesa los bytes con Google Gemini 2.5 Flash en modalidad multimodal de audio, transcribiendo fielmente el testimonio en español (o inglés), con puntuación correcta y comprensión contextual de modismos universitarios cordobeses.
3. **Motor B: Reconocimiento del Navegador (*Web Speech API Fallback*):**
   * Utilizado como alternativa complementaria instantánea en equipos de escritorio compatibles con Google Chrome.
4. **Síntesis de Voz (Text-to-Speech):**
   * Reproducción modulada de voz artificial para escuchar las intervenciones orales de Cereza con modulación pausada y refinada.
5. **Prioridad Textual (*Text-First*):**
   * Operatividad plena e ininterrumpida mediante teclado para salas de informática universitarias con ruido ambiental o equipos sin periféricos de entrada.

---

## 3. Arquitectura de Navegación, Soporte Móvil y Validación Guiada

### 3.1 Barra de Navegación Móvil Inferior (`MobileBottomNav.tsx`)
Para resolver la ergonomía en dispositivos móviles (smartphones y pantallas táctiles), se desarrolló un componente de navegación flotante inferior adaptado al área del pulgar:
* **Botones Táctiles de Alta Accesibilidad:** Accesos directos a Diálogo Cualitativo (`Conversación`), Cuestionarios Diagnósticos (`Instrumentos`), Nueva Sesión, Selector de Idioma (ES/EN) y Portal de Investigación.
* **Indicadores Activos:** Retroalimentación luminosa cian sobre la vista actualmente activa.

### 3.2 Botones de Retorno en Pantalla (*In-App Go-Back Navigation*)
Tanto en la versión web como en la móvil, se han incorporado botones explícitos de retorno con flecha (`ArrowLeft`):
* Ubicados en la barra superior (`Navbar`), la sala de entrevista (`InterviewRoom`), el gestor de instrumentos y los paneles de análisis.
* Permiten que los usuarios regresen con un solo clic a la pantalla de bienvenida o al menú principal sin recurrir obligatoriamente a los controles del navegador.

### 3.3 Intercepción de Gestos y Botón Atrás del Hardware (`popstate` + `beforeunload`)
Un problema recurrente en navegadores móviles (Chrome Android, Safari iOS) es el cierre involuntario de sesiones al deslizar el dedo desde el borde de la pantalla:
* **Gestión del Historial HTML5 (`window.history.pushState`):** Al ingresar a la sala de entrevista, el sistema inyecta un estado en el historial. Si el informante activa el gesto o presiona el botón físico de retroceso, el evento `popstate` intercepta la acción, desplegando un cuadro modal de confirmación (*"¿Deseas pausar la conversación? Tus reflexiones se guardarán de forma segura"*).
* **Guarda de Seguridad `beforeunload`:** Bloquea la recarga o salida accidental si hay un turno de conversación activo en proceso de redacción o inferencia.

### 3.4 Banner de Validación Interactiva y Accesibilidad Fila por Fila (`InstrumentForm.tsx`)
Para evitar que los estudiantes queden bloqueados o desorientados al diligenciar los cuestionarios diagnósticos:
* **Lista Dinámica de Campos Pendientes:** El banner superior no se limita a un texto estático de error; calcula y desglosa en tiempo real una serie de botones o píldoras interactivas (`missingFieldsList`) con el nombre puntual de cada ítem omitido (ej. `[Consentimiento Informado]`, `[Nombre Completo]`, `[Pregunta 5: Faltan las filas...]`).
* **Salto y Resaltado Automático con Animación:** Al pulsar cualquier píldora, la pantalla se desplaza de forma fluida (`scrollIntoView`) hasta el elemento correspondiente y le aplica un anillo de resplandor luminiscente rojo/esmeralda animado durante 3 segundos para localizarlo de inmediato.
* **Resaltado Fila por Fila en Tablas de Matriz (`matrix_grid`):** Tanto en vista de escritorio como en tarjetas apiladas móviles, cada fila sin responder se resalta individualmente con un borde de alerta y un distintivo visible: *"Falta responder"*, facilitando la compleción total sin confusión.
* **Aceptación Directa de Consentimiento Informado:** La tarjeta de ética incorpora un botón de acción rápida: *"Aceptar Consentimiento Ahora"*, reduciendo la fricción cognitiva al mínimo.
* **Aviso Inferior Previo al Envío:** Justo sobre el botón *"Enviar Cuestionario Completo"*, se despliega un resumen inferior con accesos directos a los campos pendientes para que los usuarios en dispositivos móviles no tengan que desplazarse hasta el tope del formulario.

---

## 4. Flujo de Interacción Humano-Computador (HCI)

```text
[ Pantalla Principal (Landing / Navbar) ]
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
[ Módulo Cualitativo ]  [ Módulo Cuantitativo ]
  (NewSessionModal)       (InstrumentsView)
      │                       │
      ▼                       ▼
[ InterviewRoom ]       [ InstrumentForm ]
  Diálogo con Cereza      Escala Likert (Autosave)
      │                       │
      ▼                       ▼
[ Saturación Cereza ]   [ Envío Firestore ]
      │                       │
      └───────────┬───────────┘
                  ▼
[ Portal del Investigador (2FA) ]
  SummaryView · ResponsesViewer · Exportación CAQDAS / Sheets
```

### Tabla de Etapas del Flujo HCI

| Etapa | Acción del Usuario | Respuesta del Sistema y Cereza | Impacto Técnico |
| :--- | :--- | :--- | :--- |
| **01 · Ingreso y Consentimiento** | Registro en `NewSessionModal` o selección de cuestionario en `InstrumentsView`. | Inicializa el perfil en el Modelo del Alumno; asigna código anónimo (`E01`). | Sesión registrada en Firestore con `consent: true`. |
| **02 · Apertura con Distinción** | Ingreso a la sala `InterviewRoom`. | Saludo cálido, magnético y seguro reconociendo su semestre en la Licenciatura en Informática. | Primer turno desplegado; foco temático activo. |
| **03 · Diálogo y Desafío Socrático** | Testimonio escrito o por voz del estudiante. | Escucha activa, eco reflexivo y repregunta socrática mordaz si la respuesta es evasiva o superficial. | Incremento de `participantTurns`; pre-categorización. |
| **04 · Saturación y Cierre Autónomo** | Respuesta sustantiva tras al menos 6 intervenciones maduras. | Cereza evalúa saturación, agradece con elegancia, sintetiza aprendizajes y declara el cierre. | `isInterviewFinished: true`; cambio a estado `completed`. |
| **05 · Consulta y Triangulación** | Investigador accede con credencial 2FA. | Despliegue de transcripción íntegra, citas categorizadas y tabulaciones cuantitativas. | Listo para exportación a ATLAS.ti, NVivo y Sheets. |

### Ejemplo de Interacción Dialógica con Cereza:
> **Cereza:** *"Hola, Carlos. Qué placer tenerte aquí. Sé bien que estás transitando tu 6° semestre de la Licenciatura en Informática en Montería. Hoy tendremos una charla distendida, libre de exámenes o formalismos acartonados. Cuéntame, futuro colega: ¿cómo has venido experimentando con herramientas como ChatGPT o asistentes generativos en tus materias y en tu preparación docente?"*  
> **Carlos (Docente en Formación):** *"Pues la verdad casi siempre le pido que me arme los cuestionarios y las guías de clase para salir rápido de eso."*  
> **Cereza (Toque lúdico y repregunta socrática):** *"Vaya, una jugada sumamente práctica... pero entre tú y yo, querido colega, no me dejes con la mitad del misterio: al llevar esa guía a tus estudiantes, ¿sentiste que la IA enriqueció tu propuesta pedagógica, o terminó siendo una muleta cómoda para evitar pensar la clase? Cuéntame con total franqueza."*  
> **Carlos:** *"Siendo sincero, al principio era una muleta. Pero me di cuenta en una microclase de que si yo no domino la lógica del taller, los muchachos hacen preguntas que no sé responder. Ahora la uso para darme ideas, pero la transposición didáctica la hago yo."*  
> *(Cereza registra la tensión superada y la autonomía cognitiva ganada, formulando la siguiente dimensión).*

---

## 5. Inventario Exhaustivo de Vistas (Pantallas del Sistema)

| ID | Componente | Tipo de Vista | Descripción Funcional y Perfil de Usuario |
| :--- | :--- | :--- | :--- |
| **V-01** | `Navbar.tsx` | Barra de Navegación | Encabezado superior responsivo con soporte de idioma dual (ES/EN), botón de regreso universal, accesos rápidos y disparador de acceso administrativo. |
| **V-02** | `MobileBottomNav.tsx` | Barra Móvil Inferior | Barra de navegación flotante inferior exclusiva para dispositivos móviles con diseño ergonómico para el pulgar. |
| **V-03** | `NewSessionModal.tsx` | Modal de Inicio | Captura de caracterización inicial (nombre, semestre 1°-10°, sede) y validación vinculante de consentimiento informado digital. |
| **V-04** | `InterviewRoom.tsx` | Sala Conversacional | Sala interactiva de diálogo cualitativo con Cereza: burbujas de chat, dictado por voz, síntesis auditiva, indicador de tema y protección contra retroceso accidental. |
| **V-05** | `InstrumentsView.tsx` | Portal Diagnóstico | Centro de acceso a los cuestionarios estructurados cuantitativos (Instrumento 1: Percepciones; Instrumento 2: Autoeficacia). |
| **V-06** | `InstrumentForm.tsx` | Formulario Likert | Vista de aplicación de encuestas Likert de 5 puntos con persistencia reactiva de borradores offline (`localStorage`) y sincronización a Firestore. |
| **V-07** | `AdminAuthModal.tsx` | Portal de Seguridad | Modal de autenticación de doble factor para investigadores: verificación de cuenta de Google con lista blanca y PIN Maestro (`####`). |
| **V-08** | `SessionsDashboard.tsx` | Panel de Control | Centro de supervisión para investigadores: lista de entrevistas en tiempo real, filtros por semestre/sede y visor de transcripciones completas. |
| **V-09** | `InstrumentResponsesViewer.tsx`| Visor Estadístico | Dashboard analítico cuantitativo con cálculo de medias aritméticas ($\bar{x}$), desviaciones estándar ($\sigma$), distribución porcentual por dimensión y exportación a CSV. |
| **V-10** | `SummaryView.tsx` | Matriz Cualitativa | Extracción hermenéutica generada por `/api/analyze-interview`, organizando citas directas en la ontología deductiva (IA, Formación, Efectos). |
| **V-11** | `GuidesManager.tsx` | Gestor de Guiones | Interfaz administrativa para consultar o calibrar los guiones cualitativos semiestructurados y sus pistas socráticas. |
| **V-12** | `ThesisProjectModal.tsx` | Ficha Técnica | Ficha institucional de transparencia con autores, director, problema, objetivos y respaldo de la Universidad de Córdoba. |
| **V-13** | `GoogleFormsCharts.tsx` | Suite Analítica Visual (General) | Visualización cuantitativa estilo Google Forms para respuestas a cuestionarios: gráficos de barras horizontales, diagramas de dona/pastel de proporciones demográficas y tablas de frecuencia porcentual. |
| **V-14** | `InterviewsAnalyticsView.tsx` | Analítica Cualitativa e Individual | Dashboard hermenéutico avanzado por informante: radar de competencias tecnopedagógicas, polaridad emocional dialógica, distribución de citas por categoría y comparación entre perfiles. |

---

## 6. Criterios Técnicos de Usabilidad y Accesibilidad
* **Compatibilidad Multiplataforma:** Optimización fluida desde pantallas móviles estrechas (360px) hasta monitores de alta resolución (4K).
* **Paridad Bilingüe Completa:** Conmutación dinámica e instantánea de la interfaz entre español e inglés sin recargar la aplicación ni reiniciar la sesión.
* **Estándares WCAG 2.1 AA:** Contrastes cromáticos verificados sobre fondos oscuros, navegación completa por teclado y soporte para lectores de pantalla.

---

## 7. Referencias Académicas Utilizadas
* Creswell, J. W., & Poth, C. N. (2018). *Qualitative inquiry and research design: Choosing among five approaches* (4th ed.). SAGE Publications.
* Kvale, S. (2007). *Doing interviews*. SAGE Publications. https://doi.org/10.4135/9781849208963
* Nielsen, J., & Budiu, R. (2013). *Mobile usability*. New Riders.
* Norman, D. (2013). *The design of everyday things* (Revised ed.). Basic Books.
* Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N., & Diakopoulos, N. (2016). *Designing the user interface: Strategies for effective human-computer interaction* (6th ed.). Pearson.

---

# English Version

DOCUMENT 04 | WORLD MODEL (DESIGN.MD): INTERFACE AND CONVERSATIONAL ECOSYSTEM

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
* **V-07 (`AdminAuthModal.tsx`):** Two-factor authentication portal for researchers (Google OAuth + PIN `####`).
* **V-08 (`SessionsDashboard.tsx`):** Research supervision dashboard with real-time session filters.
* **V-09 (`InstrumentResponsesViewer.tsx`):** Quantitative dashboard with mean ($ar{x}$), standard deviation ($\sigma$), and percentage distributions.
* **V-10 (`SummaryView.tsx`):** Qualitative matrix generated by `/api/analyze-interview` with categorized verbatim quotes.
* **V-11 (`GuidesManager.tsx`):** Administrative view for qualitative question guidelines.
* **V-12 (`ThesisProjectModal.tsx`):** Institutional information modal with project metadata.
* **V-13 (`GoogleFormsCharts.tsx`):** Visual quantitative charts (horizontal bar charts, donut charts).
* **V-14 (`InterviewsAnalyticsView.tsx`):** Individual participant analytics with competency radar and dialogue sentiment.
* **V-15 (`GlobalSynthesisReport.tsx`):** Consolidated macro-synthesis report tab with 5-chapter mixed analysis and Word/Docs export.

---

## 6. Academic References
Standardized under APA 7th edition guidelines on human-computer interaction, educational technology, and user experience design.
