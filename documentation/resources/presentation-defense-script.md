# Guion de Sustentación Técnica · EduPulse v2.3
### Presentación de Ingeniería de Software, Diseño UI/UX y Agente Conversacional Cereza
**Licenciatura en Informática · Universidad de Córdoba**

| Campo | Detalle |
| :--- | :--- |
| **Producto de Software** | EduPulse v2.3: Plataforma Web Híbrida y Agente Dialógico Inteligente |
| **Sustentantes (Desarrolladores)** | José Daniel Durango Caballero & Jefersson Ramírez Oviedo |
| **Director de Proyecto** | Mag. Juan Carlos Giraldo Cardozo |
| **Archivos de Diapositivas** | `EduPulse_Development_and_Design_Final.pptx` / `EduPulse_Final_Defense_Presentation.pptx` (16 diapositivas panorámicas 16:9) |
| **Entorno de Producción** | [edupulse-575b.onrender.com](https://edupulse-575b.onrender.com) |
| **Tiempo Estimado de Exposición** | 15 a 18 minutos (más demostración en vivo y sesión de preguntas) |

---

## Índice y Distribución Temporal de Diapositivas

```text
Diapositiva 01: Portada Técnica e Identidad del Sistema                  [01:00 min]
Diapositiva 02: Visión del Software y Retos de Ingeniería                [01:15 min]
Diapositiva 03: Arquitectura Frontend & UX Reactivo (Cliente)            [01:15 min]
Diapositiva 04: Arquitectura Backend, Gateway & Inferencia IA (Servidor) [01:15 min]
Diapositiva 05: Sistema de Diseño Frutiger Aero Modern Glassmorphism     [01:30 min]
Diapositiva 06: Experiencia de Usuario (UX) Móvil y Ergonomía Reactiva   [01:15 min]
Diapositiva 07: Diseño del Agente Conversacional: Cereza y Mediación     [01:30 min]
Diapositiva 08: Ingeniería de Instrucciones: Framework ROCAS en Backend   [01:30 min]
Diapositiva 09: Orquestación Backend: Pipeline en Tiempo Real (Server.ts) [01:15 min]
Diapositiva 10: Evolución del Desarrollo: Línea Temporal (Sprints 1 al 5) [01:15 min]
Diapositiva 11: Evolución del Sistema de Audio: Motor de Voz Dual con IA [01:30 min]
Diapositiva 12: Validación Interactiva de Cuestionarios Fila por Fila    [01:15 min]
Diapositiva 13: Resiliencia de Datos: Eliminación de Condiciones de Carrera [01:15 min]
Diapositiva 14: Suite de Analítica Visual Tipo Google Forms y Radar      [01:15 min]
Diapositiva 15: Gobernanza de Datos, Seguridad RBAC y Google OAuth 2.0   [01:15 min]
Diapositiva 16: Demostración en Vivo en Producción y Cierre Técnico      [01:15 min]
                                                    TOTAL ESTIMADO: ~18:00 min
```

---

## Guion Detallado Diapositiva por Diapositiva

### Diapositiva 01 · Portada Técnica e Identidad del Sistema
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Muy buenos días / tardes, respetado jurado calificador, profesor Juan Carlos Giraldo y evaluadores. En el día de hoy nos complace presentar la sustentación técnica de **EduPulse v2.3**, una plataforma web reactiva y agente conversacional inteligente concebida y desarrollada desde cero para transformar la recolección, diagnóstico y análisis cualitativo y cuantitativo en la educación superior.  
  > En esta exposición no nos limitaremos a hablar del contexto temático, sino que desglosaremos a fondo el proceso de ingeniería de software, las decisiones de arquitectura full-stack, el diseño de interfaz Frutiger Aero Modern Glassmorphism, la ingeniería del agente Cereza y las soluciones de resiliencia que permitieron llevar esta aplicación a producción real."*

---

### Diapositiva 02 · Visión del Software y Retos de Ingeniería
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"¿Cuál fue el reto técnico que originó a EduPulse? Tradicionalmente, la recolección de percepciones complejas se ha realizado mediante formularios web estáticos (Google Forms, Typeform, etc.). Sin embargo, en el ámbito investigativo y educativo, estos instrumentos sufren de tres graves problemas de ingeniería: respuestas de manual con sesgo de deseabilidad social, abandono por fatiga cognitiva ante encuestas monótonas y cero capacidad de repregunta cuando una respuesta es ambigua o superficial.  
  > La visión de ingeniería de EduPulse fue reemplazar el formulario frío por una experiencia dialógica interactiva: un agente conversacional capaz de razonar en tiempo real, identificar contradicciones, aplicar indagación reflexiva y sintetizar hallazgos de forma estructurada sin perder el rigor cuantitativo."*

---

### Diapositiva 03 · Arquitectura Frontend & UX Reactivo (Cliente)
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En la capa de cliente, implementamos React 19 con TypeScript estricto, adoptando una arquitectura basada en componentes funcionales desacoplados y hooks personalizados de sesión (`useSessionProtection`, `useAudioRecorder`).  
  > Para el estilizado, integramos Tailwind CSS v4 con tokens de diseño Frutiger Aero, capas difuminadas `backdrop-blur-xl` y bordes bioluminiscentes sin sobrecarga de runtime.  
  > Todo el empaquetado corre sobre Vite 6, logrando un Hot Module Replacement (HMR) inferior a 200 milisegundos y persistencia local reactiva inmediata con cero pérdida de turnos."*

---

### Diapositiva 04 · Arquitectura Backend, Gateway & Motor de Inferencia IA
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Las capas de servidor y nube se estructuran en tres niveles:  
  > * En la **Capa 2 (API Gateway)**, un servidor Node.js con Express custodia la clave de API de Gemini y expone endpoints especializados para chat, transcripción y exportación a Sheets.  
  > * En la **Capa 3 (Motor de Inferencia)**, integramos Google Gemini 2.5 Flash, optimizado para latencias menores a 1.2 segundos, con temperatura fijada en 0.4 y forzado de salida JSON nativo.  
  > * En la **Capa 4 (Persistencia & Nube)**, combinamos Google Cloud Firestore en tiempo real con Google Cloud OAuth 2.0 y resiliencia offline dual."*

---

### Diapositiva 05 · Sistema de Diseño Frutiger Aero Modern Glassmorphism
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"A nivel de diseño visual, rompimos deliberadamente con el 'Flat Design' corporativo y minimalista que predomina en las aplicaciones web actuales. Rescatamos y modernizamos la estética **Frutiger Aero** combinada con **Glassmorphism**:  
  > * Definimos una paleta cromática inspirada en la atmósfera y el agua: Cyan espacial (`#06B6D4`), azul marino abisal (`#050B14`), esmeralda de validación (`#10B981`) y magenta de acento.  
  > * Desarrollamos componentes con efecto de vidrio esmerilado translúcido utilizando `backdrop-blur-xl`, bordes bioluminiscentes con reflejos de luz especular superior y sombras sutiles.  
  > * Integramos una identidad visual distintiva: el reloj de Umbra (*Umbran Watch*), un widget visual animado que simboliza el control temporal y la introspección pedagógica."*

---

### Diapositiva 06 · Experiencia de Usuario (UX) Móvil y Ergonomía Reactiva
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Más del 76% de los informantes universitarios acceden desde sus teléfonos inteligentes. Por eso, diseñamos una ergonomía móvil de primer nivel:  
  > * Implementamos una barra de navegación inferior fija (`MobileBottomNav`) con zonas táctiles amplias y retroalimentación táctil visual.  
  > * Incorporamos botones de retorno explícitos en todas las vistas modales y paneles secundarios para evitar desorientación.  
  > * Añadimos una solución crítica de UX: el **atrapamiento de eventos `popstate`**. En dispositivos móviles, el gesto de deslizamiento hacia atrás solía cerrar accidentalmente la entrevista. Nuestro sistema intercepta el historial del navegador y muestra una confirmación flotante, protegiendo la sesión y reteniendo los datos en `localStorage`."*

---

### Diapositiva 07 · Diseño del Agente Conversacional: Cereza y su Modelo Dialógico
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"El núcleo de la interacción es **Cereza**, nuestro agente conversacional socrático. A diferencia de los asistentes sumisos o genéricos (tipo ChatGPT o Siri), Cereza fue modelada con una personalidad distintiva, elegante y astuta (inspirada en la figura de Bayonetta):  
  > * Emplea un tono cercano pero intelectualmente exigente, dirigiéndose al usuario de tú a tú como un colega en formación.  
  > * Cuando el estudiante da una respuesta complaciente o teórica de manual, Cereza activa técnicas de **indagación de contraste (probing)** y repregunta buscando anécdotas vividas y dilemas reales.  
  > * Utiliza la técnica del **eco reflexivo**, reflejando las propias palabras del estudiante para impulsarlo a profundizar.  
  > * Y crucialmente, posee **criterio de saturación autónomo**: en lugar de ceñirse a un número estático de preguntas, analiza algorítmicamente la densidad y riqueza de las respuestas, marcando el fin de la entrevista (`isInterviewFinished: true`) de forma orgánica entre 6 y 8 turnos de diálogo sustantivos."*

---

### Diapositiva 08 · Ingeniería de Instrucciones: Framework ROCAS en Backend
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Para gobernar el comportamiento de Cereza en cada turno de diálogo, diseñamos en `server.ts` un prompt de sistema estructurado bajo el framework **ROCAS**:  
  > * **Rol:** Mentora reflexiva y aguda en educación y tecnologías computacionales.  
  > * **Objetivo:** Explorar cómo la IA transforma la formación docente, detectando el 'efecto muleta' y la autonomía crítica.  
  > * **Contexto:** Estudiantes de la Universidad de Córdoba en diversas sedes territoriales y semestres.  
  > * **Acciones:** Indagación atómica, preguntas concisas de una sola idea y extracción concurrente de citas textuales.  
  > * **Salida:** Un contrato JSON estricto (`reply`, `dimension`, `directQuote`, `isInterviewFinished`)."*

---

### Diapositiva 09 · Orquestación Backend: Pipeline en Tiempo Real (`server.ts`)
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En esta diapositiva observamos la ejecución paso a paso de cada turno conversacional en nuestro servidor intermedio:  
  > 1. **Sanitización de Entrada:** Valida longitudes, neutraliza inyecciones de prompt y aplica limitación de tasa (rate limiting).  
  > 2. **Inyección ROCAS + Historial:** Ensambla dinámicamente el prompt con el historial previo y la categoría metodológica activa.  
  > 3. **Inferencia con Gemini 2.5 Flash:** Ejecuta la llamada en streaming con `temperature: 0.4` y `response_mime_type: 'application/json'`.  
  > 4. **Contrato JSON & Cascada:** Valida el esquema con TypeScript y activa fallbacks automáticos ante errores 429/500."*

---

### Diapositiva 10 · Evolución del Desarrollo: Línea Temporal y Sprints (1 al 5)
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"El desarrollo de EduPulse siguió una metodología ágil iterativa a lo largo de 5 grandes Sprints:  
  > * **Sprint 1:** Arquitectura base, configuración de TypeScript, Vite y conexión inicial con Google Gemini.  
  > * **Sprint 2:** Modelado del agente Cereza, prompts socráticos y control de turnos en `ChatArea.tsx`.  
  > * **Sprint 3:** Módulo psicométrico cuantitativo con persistencia reactiva en Cloud Firestore.  
  > * **Sprint 4:** Rediseño completo bajo Frutiger Aero, navegación móvil y panel administrativo con PIN ####.  
  > * **Sprint 5 (Versión Final 2.3):** Motor de voz dual multimodal, validación guiada fila por fila, fallback heurístico local para síntesis cualitativa y analítica visual tipo Google Forms."*

---

### Diapositiva 11 · Evolución del Sistema de Audio: Motor de Voz Dual con IA Multimodal
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Uno de los desafíos de ingeniería más fascinantes fue la entrada de voz para los usuarios:  
  > * Inicialmente, implementamos la API nativa del navegador `webkitSpeechRecognition`. Sin embargo, en pruebas de campo en teléfonos móviles y navegadores como Brave o Safari, la API fallaba frecuentemente por falta de soporte nativo o cortes por silencios prolongados.  
  > * Para resolverlo de forma definitiva, diseñamos un **Motor de Voz Dual**:  
  >   1. Desarrollamos el componente `LiveMicVisualizer` con la Web Audio API y Canvas HTML5, renderizando ondas sinusoidales dinámicas de amplitud y frecuencia en tiempo real.  
  >   2. Capturamos el flujo de audio mediante `MediaRecorder` en formato comprimido webm/ogg.  
  >   3. Enviamos el blob de audio al endpoint `/api/transcribe-audio` en nuestro backend, donde la API multimodal de Gemini lo transcribe con altísima precisión fonética, reconociendo modismos colombianos y terminología técnica sin cortes arbitrarios."*

---

### Diapositiva 12 · Módulo de Cuestionarios: Validación Guiada Fila por Fila
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"En el módulo cuantitativo (`InstrumentForm.tsx`), los informantes debían responder matrices Likert con múltiples criterios. En los formularios tradicionales, si un usuario olvida marcar una casilla en una tabla de 10 filas, el sistema se limita a arrojar un error genérico, obligando al usuario a buscar a ciegas cuál fila faltó.  
  > En EduPulse implementamos una **validación guiada interactiva**:  
  > * Si el usuario intenta enviar con campos incompletos, la vista no solo le informa cuántos ítems faltan, sino que despliega un banner superior interactivo con **píldoras de salto automático**.  
  > * Cada píldora indica la fila exacta pendiente; al hacer clic, hace un scroll suave y resalta visualmente la fila con un aura de color ámbar.  
  > * Además, incluimos un botón de consentimiento ético de 1-clic con guardado instantáneo en `localStorage`."*

---

### Diapositiva 13 · Resiliencia de Datos: Eliminación de Condiciones de Carrera
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En versiones tempranas, al finalizar la entrevista se presentaba un problema de sincronización: si el usuario cerraba la pestaña justo cuando la IA estaba calculando la matriz cualitativa, la síntesis podía quedar incompleta o entrar en una condición de carrera (*race condition*).  
  > Para blindar la aplicación contra cualquier fallo de red o tiempo de espera, construimos el **Motor de Síntesis Cualitativa Resiliente (`qualitativeSynthesis.ts`)**:  
  > * Si el backend por alguna razón tarda más de lo previsto o se interrumpe la conexión, el frontend activa de forma transparente un **algoritmo heurístico local determinista**.  
  > * Este motor local analiza la transcripción completa, agrupa las intervenciones por dimensiones formativas, extrae las citas más relevantes y calcula los índices de necesidad y polaridad emocional.  
  > * El resultado: **cero pérdida de datos** y disponibilidad garantizada del resumen investigativo en cualquier circunstancia."*

---

### Diapositiva 14 · Suite de Analítica Visual Tipo Google Forms y Radar
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Para la visualización de los datos recopilados por EduPulse, desarrollamos una suite analítica completa inspirada en la familiaridad y ergonomía de Google Forms:  
  > * **Nivel General:** Despliega gráficos interactivos SVG de dona para la distribución demográfica por sedes y semestres, y gráficos de barras horizontales porcentuales para el análisis comparativo de respuestas.  
  > * **Nivel Individual:** Permite al investigador seleccionar cualquier código de informante (E01 a E40) y visualizar su **Radar de Competencias Tecno-pedagógicas**, el desglose turno por turno de su diálogo con Cereza y la matriz de citas pre-categorizadas.  
  > * Esta suite incluye filtros reactivos por sede territorial y exportación de datos en un clic a formato TSV/CSV compatible directamente con Excel y Google Sheets."*

---

### Diapositiva 15 · Gobernanza de Datos, Seguridad RBAC y Google OAuth 2.0
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En materia de seguridad y gobernanza de la información, EduPulse implementa controles estrictos en todos los niveles:  
  > * **Habeas Data y Anonimato:** Los estudiantes participan bajo anonimización completa; sus datos se asocian únicamente a códigos seudonimizados alfanuméricos y nunca a identificadores personales.  
  > * **Control de Acceso de Doble Factor (RBAC):** La vista de investigación está restringida mediante validación de correos en lista blanca con Google OAuth y un **PIN Maestro de Validación Criptográfica (`####`)** en memoria de sesión volátil.  
  > * **Gobernanza Google Cloud OAuth 2.0:** Registramos los orígenes autorizados de JavaScript (`edupulse-575b.onrender.com` y `localhost`) bajo el cliente OAuth en Google Cloud Console, permitiendo que el endpoint `/api/export-sheets` exporte automáticamente libros de cálculo en tres pestañas organizadas (*Resumen Ejecutivo*, *Respuestas Estructuradas* y *Transcripción Turno a Turno*) directamente al Google Drive del investigador."*

---

### Diapositiva 16 · Demostración en Vivo en Producción y Cierre Técnico
* **Voz sugerida (Investigadores 1 y 2):**
  > *"EduPulse no es un prototipo local de laboratorio; es una aplicación web en producción real, desplegada y disponible para la comunidad académica en la nube en **`https://edupulse-575b.onrender.com`**.  
  > A continuación, procederemos a realizar una breve demostración en vivo de la interacción con Cereza, el funcionamiento del motor de voz con visualizador y la generación instantánea de la matriz de analítica.  
  > Agradecemos profundamente a nuestro director de trabajo de grado, el Mag. Juan Carlos Giraldo Cardozo, a los docentes de la Licenciatura en Informática y a cada uno de los estudiantes que formaron parte de esta investigación.  
  > Quedamos a total disposición del honorable jurado calificador para responder sus preguntas técnicas y pedagógicas. Muchas gracias."*

---

## Banco de Preguntas Técnicas y Respuestas para el Jurado

1. **¿Cómo garantizan que Cereza no alucine o invente citas en la matriz final?**
   * *Respuesta:* Las citas provienen exclusivamente de los mensajes emitidos por el estudiante en el chat. En cada turno, el backend extrae citas textuales literales bajo el contrato JSON estricto; además, nuestro motor de síntesis local auditado (`qualitativeSynthesis.ts`) realiza una validación cruzada determinista contrastando las cadenas de texto con la transcripción original antes de persistir los datos.

2. **¿Por qué crearon un motor de voz dual en lugar de usar librerías de terceros?**
   * *Respuesta:* Las librerías de terceros suelen depender de servicios de pago o de la API `webkitSpeechRecognition`, la cual es inconsistente entre navegadores móviles (especialmente en Android/Brave o iOS). Con nuestro motor dual (`MediaRecorder` + Gemini Multimodal en `/api/transcribe-audio`), tenemos control total del procesamiento, cancelamos ruido mediante visualización de ondas y logramos transcripciones precisas con cero costo adicional.

3. **¿Qué medidas de seguridad previenen el acceso no autorizado a los datos de los estudiantes?**
   * *Respuesta:* Implementamos tres capas de protección: primero, reglas declarativas en Cloud Firestore que solo permiten escritura anónima de respuestas y lectura exclusiva a usuarios autenticados; segundo, lista blanca de correos autorizados en Firebase Auth; y tercero, el PIN Maestro criptográfico para activar los paneles de visualización.

4. **¿Cómo maneja la aplicación caídas repentinas de conexión a internet?**
   * *Respuesta:* EduPulse implementa arquitectura *offline-first* con persistencia reactiva automática en `localStorage`. Si la conexión se pierde durante una entrevista o cuestionario, los turnos y selecciones permanecen intactos en el dispositivo, reanudando la sincronización en tiempo real tan pronto se restablece la red.

---

# English Version

# Technical Defense Presentation Script · EduPulse v2.3
### Software Engineering, UI/UX Design, and Cereza Conversational Agent
**Bachelor in Computer Science Education · University of Córdoba**

| Field | Detail |
| :--- | :--- |
| **Software Product** | EduPulse v2.3: Hybrid Web Platform and Intelligent Dialogic Agent |
| **Presenters (Developers)** | José Daniel Durango Caballero & Jefersson Ramírez Oviedo |
| **Project Director** | Mag. Juan Carlos Giraldo Cardozo |
| **Slide Decks** | `EduPulse_Development_and_Design_Final.pptx` / `EduPulse_Final_Defense_Presentation.pptx` (16 widescreen 16:9 slides) |
| **Production Environment** | [edupulse-575b.onrender.com](https://edupulse-575b.onrender.com) |
| **Estimated Exposition Time** | 15 to 18 minutes (followed by live demo and jury Q&A) |

---

## Slide Index and Timing Distribution

```text
Slide 01: Technical Cover & System Identity                     [01:00 min]
Slide 02: Software Vision & Engineering Challenges              [01:15 min]
Slide 03: Frontend Architecture & Reactive UX (Client Layer)    [01:15 min]
Slide 04: Backend Architecture, Gateway & AI Inference (Server) [01:15 min]
Slide 05: Frutiger Aero Modern Glassmorphism Design System      [01:30 min]
Slide 06: Mobile User Experience (UX) & Reactive Ergonomics     [01:15 min]
Slide 07: Conversational Agent Design: Cereza & Socratic Model  [01:30 min]
Slide 08: Prompt Engineering: ROCAS Framework on Backend        [01:30 min]
Slide 09: Backend Orchestration: Real-Time Pipeline (Server.ts) [01:15 min]
Slide 10: Development Timeline: Iterative Sprints (1 to 5)      [01:15 min]
Slide 11: Audio System Evolution: Dual-Engine Voice with AI     [01:30 min]
Slide 12: Questionnaire Module: Row-by-Row Guided Validation    [01:15 min]
Slide 13: Data Resilience: Race Condition Resolution            [01:15 min]
Slide 14: Google Forms-Style Visual Analytics Suite & Radar     [01:15 min]
Slide 15: Data Governance, RBAC Security, and Google OAuth 2.0  [01:15 min]
Slide 16: Live Production Demonstration & Technical Closure     [01:15 min]
                                            TOTAL ESTIMATE: ~18:00 min
```

---

## Detailed Slide-by-Slide Script

### Slide 01 · Technical Cover & System Identity
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"Good morning / afternoon, respected evaluation committee, Professor Juan Carlos Giraldo, and jurors. Today, we are proud to present the technical defense of **EduPulse v2.3**, a reactive web platform and intelligent conversational agent conceived and built from the ground up to transform data collection, diagnostic assessment, and qualitative and quantitative analysis in higher education.  
  > In this presentation, we will not limit ourselves to thematic context; rather, we will thoroughly break down our software engineering process, full-stack architectural decisions, Frutiger Aero Modern Glassmorphism interface design, Cereza's conversational engine, and the data resilience solutions that enabled us to deploy this platform to real production."*

### Slide 02 · Software Vision & Engineering Challenges
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"What technical challenge motivated EduPulse? Historically, complex perceptions have been gathered through static web surveys (Google Forms, Typeform, etc.). However, in educational research, these tools suffer from three severe engineering drawbacks: textbook answers skewed by social desirability bias, survey abandonment due to cognitive fatigue, and zero ability to probe when an answer is vague or contradictory.  
  > EduPulse's engineering vision was to replace rigid surveys with an interactive dialogic experience: an intelligent agent capable of reasoning in real time, detecting contradictions, applying reflective probing, and synthesizing findings in structured formats without sacrificing quantitative rigor."*

### Slide 03 · Frontend Architecture & Reactive UX (Client Layer)
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"On the client tier, we implemented React 19 with strict TypeScript, adopting decoupled functional components and specialized custom hooks (`useSessionProtection`, `useAudioRecorder`).  
  > For styling, Tailwind CSS v4 delivers atomic utility classes themed with Frutiger Aero tokens, `backdrop-blur-xl` translucent frosted layers, and bioluminescent borders without runtime overhead.  
  > Powered by Vite 6, Hot Module Replacement executes in under 200 milliseconds alongside instant reactive localStorage persistence."*

### Slide 04 · Backend Architecture, Gateway & AI Inference (Server)
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"Our server and cloud tiers are divided into three synchronized layers:  
  > * In the **API Gateway Layer (Node.js/Express)**, server endpoints protect Gemini private keys and handle specialized routes for chat, audio, and Sheets export.  
  > * In the **AI Inference Layer**, Google Gemini 2.5 Flash guarantees sub-1.2-second response latency, calibrated with a 0.4 temperature and native JSON schema output.  
  > * In the **Persistence Tier**, Cloud Firestore provides real-time NoSQL synchronization backed by Google Cloud OAuth 2.0."*

### Slide 05 · Frutiger Aero Modern Glassmorphism Design System
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"In visual design, we deliberately broke away from flat, corporate minimalism. We revived and modernized **Frutiger Aero** combined with **Glassmorphism**:  
  > * Atmospheric color palette: Space Cyan (`#06B6D4`), deep oceanic navy (`#050B14`), validation emerald (`#10B981`), and accent magenta.  
  > * Translucent frosted glass components using `backdrop-blur-xl`, bioluminescent borders, and subtle top specular light refractions.  
  > * An animated brand emblem (the Umbran Watch) symbolizing temporal control and academic reflection, granting dynamism and warmth to the interface without impairing readability."*

### Slide 06 · Mobile User Experience (UX) & Reactive Ergonomics
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"Over 76% of pre-service teachers access the web from mobile smartphones. Therefore, we crafted first-class mobile ergonomics:  
  > * A fixed bottom navigation bar (`MobileBottomNav`) with generous touch targets and tactile visual feedback.  
  > * Explicit on-screen return buttons across all modal views and secondary panels.  
  > * A critical UX solution: **`popstate` event trapping**. On Android and iOS, native back-swipe gestures previously closed the active session prematurely. Our system intercepts browser history and displays an in-app confirmation modal, safeguarding the active interview from accidental loss."*

### Slide 07 · Conversational Agent Design: Cereza & Socratic Model
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"The heart of interaction is **Cereza**, our Socratic conversational agent. Unlike generic assistants, Cereza was modeled with a distinct, poised, and sharp persona:  
  > * She speaks as an intellectual colleague, establishing approachable peer-to-peer rapport.  
  > * When a student provides an evasive or textbook answer, Cereza challenges them Socratically with contrast probing, seeking lived anecdotes.  
  > * She utilizes reflective mirroring, echoing the student's own words to guide deeper inquiry.  
  > * Crucially, she possesses an **autonomous saturation engine**: rather than sticking to a static question count, she algorithmically tracks response density, concluding the dialogue organically between 6 and 8 substantive turns (`isInterviewFinished: true`)."*

### Slide 08 · Prompt Engineering: ROCAS Framework on Backend
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"To govern Cereza's reasoning on every conversational turn, we engineered in `server.ts` a system prompt structured under the **ROCAS** framework:  
  > * **Role:** Insightful reflective mentor in educational technology.  
  > * **Objective:** Explore teacher AI adoption while detecting the 'crutch effect' and intellectual agency.  
  > * **Context:** Pre-service teachers at UniCórdoba across diverse semesters and campuses.  
  > * **Actions:** Atomic single-question formulation, knowing wit upon clichés, and concurrent quote extraction.  
  > * **Output:** A strict JSON schema (`reply`, `dimension`, `directQuote`, `isInterviewFinished`)."*

### Slide 09 · Backend Orchestration: Real-Time Pipeline (`server.ts`)
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"This slide breaks down each real-time conversational turn inside our intermediary server:  
  > 1. **Input Sanitization:** Validates length, neutralizes prompt injection payloads, and enforces rate limits.  
  > 2. **ROCAS Context Assembly:** Dynamically builds prompts with active conversational history and current methodological dimension.  
  > 3. **Gemini 2.5 Flash Inference:** Executes streaming inference with locked 0.4 temperature and forced JSON mime-type.  
  > 4. **JSON Contract & Cascade:** Verifies schema via TypeScript and triggers automated fallbacks upon 429/500 events."*

### Slide 10 · Development Timeline: Iterative Sprints (1 to 5)
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"EduPulse was engineered following an agile iterative methodology across 5 major sprints:  
  > * **Sprint 1:** Base architecture, TypeScript/Vite scaffolding, and initial Google Gemini connectivity.  
  > * **Sprint 2:** Cereza agent modeling, Socratic prompt formulation, and turn management.  
  > * **Sprint 3:** Psychometric Likert module with reactive persistence in Cloud Firestore.  
  > * **Sprint 4:** Modern Frutiger Aero redesign, mobile bottom navigation, and PIN-secured admin portal.  
  > * **Sprint 5 (Version 2.3):** Dual-engine multimodal voice engine, row-by-row questionnaire validation, resilient local heuristic fallback, and Google Forms-style visual analytics."*

### Slide 11 · Audio System Evolution: Dual-Engine Voice with Multimodal AI
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"One of our greatest engineering challenges was voice input:  
  > * The browser's native `webkitSpeechRecognition` frequently crashed or lacked support on mobile browsers like Brave or iOS Safari.  
  > * To solve this permanently, we engineered a **Dual Voice Engine**:  
  >   1. Built `LiveMicVisualizer` using Web Audio API and HTML5 Canvas, visualizing real-time sinusoidal frequency waves.  
  >   2. Captured audio streams via native `MediaRecorder` in compressed webm/ogg format.  
  >   3. Streamed audio blobs to `/api/transcribe-audio`, where Gemini multimodal transcription accurately decodes speech without arbitrary timeouts."*

### Slide 12 · Questionnaire Module: Row-by-Row Guided Validation
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"In traditional web forms, missing an item in a 10-row matrix produces a generic error, forcing the user to search blindly.  
  > In EduPulse, we implemented **interactive guided validation**:  
  > * When a user attempts to submit with missing answers, an interactive banner surfaces dynamic **jump pills**.  
  > * Clicking any pill smoothly scrolls to the exact row and highlights it with an animated warning halo.  
  > * Matrix tables visually tag unanswered rows with a visible badge: 'Answer required'."*

### Slide 13 · Data Resilience: Race Condition Resolution
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"In earlier versions, closing the tab right when Cereza completed an interview could trigger a race condition before synthesis finished.  
  > We built the **Resilient Qualitative Synthesis Engine (`qualitativeSynthesis.ts`)**:  
  > * Enforces an asynchronous UI lock (`isSynthesizing`) until synthesis resolves.  
  > * If the network drops or the external API times out, the client automatically triggers a **deterministic local heuristic algorithm** that extracts quotes, computes sentiment, and generates the findings matrix. Result: **zero data loss**."*

### Slide 14 · Google Forms-Style Visual Analytics Suite & Radar
* **Suggested Speaker (Lead Researcher 2 / Jefersson):**
  > *"For data visualization, we engineered an analytics suite inspired by the ergonomic clarity of Google Forms:  
  > * **General Level:** Interactive SVG demographic donut charts and horizontal percentage frequency bars.  
  > * **Individual Level:** Select any participant code (`E01`...`E40`) to display their **Technopedagogical Competency Radar**, speech-turn sentiment, and categorized quote matrix.  
  > * One-click exports to CSV, TSV, and 3-tab Google Sheets."*

### Slide 15 · Data Governance, RBAC Security, and Google OAuth 2.0
* **Suggested Speaker (Lead Researcher 1 / José Daniel):**
  > *"In security and data governance:  
  > * **Habeas Data & Anonymity:** Students participate under alphanumeric codes (`E01`...`E40`); private contact channels are masked in the public interface.  
  > * **Two-Factor Access Control (RBAC):** Research views are guarded by Google OAuth whitelist verification and an ephemeral **Master PIN (`####`)**.  
  > * **Google Cloud OAuth 2.0 Governance:** Normalized authorized origins (`edupulse-575b.onrender.com` and `localhost`) allow `/api/export-sheets` to export 3-tab spreadsheets directly to Google Drive."*

### Slide 16 · Live Production Demonstration & Technical Closure
* **Suggested Speaker (Joint):**
  > *"EduPulse is not a local lab prototype; it is a live web application in real production deployed on **`https://edupulse-575b.onrender.com`**.  
  > We will now proceed with a live demonstration of Cereza's dialogue, voice transcription with dynamic wave visualizer, and the visual analytics suite.  
  > We thank our project director, Mag. Juan Carlos Giraldo Cardozo, the faculty, and the students of Computer Science Education. We welcome your questions."*

---

## Technical Jury Q&A Bank

1. **How do you guarantee Cereza does not hallucinate quotes in the final matrix?**
   * *Answer:* Direct quotes originate exclusively from the student's text entries. The backend extracts verbatim strings under strict JSON constraints, cross-verified deterministically by `qualitativeSynthesis.ts` against the original transcript.

2. **Why build a dual voice engine instead of third-party libraries?**
   * *Answer:* Third-party tools often rely on subscription APIs or unstable Web Speech implementations on mobile. Our architecture (`MediaRecorder` + Gemini Multimodal in `/api/transcribe-audio`) provides total control, noise cancellation visual feedback, and zero additional operational cost.

3. **What security measures prevent unauthorized access to student records?**
   * *Answer:* Three-tier defense: Cloud Firestore rules allowing anonymous writes only with consent; Google OAuth email whitelist; and an ephemeral Master PIN for unlocking analytics dashboards.

4. **How does the system handle abrupt network disconnects?**
   * *Answer:* Offline-first architecture with reactive `localStorage` autosave. In-progress dialogue turns and Likert selections remain preserved in the browser, resuming synchronization automatically when connection restores.
