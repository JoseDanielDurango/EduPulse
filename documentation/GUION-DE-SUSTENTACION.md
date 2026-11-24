# Guion de Sustentación Técnica · EduPulse v2.3
### Presentación de Ingeniería de Software, Diseño UI/UX y Agente Conversacional Cereza
**Licenciatura en Informática · Universidad de Córdoba**

| Campo | Detalle |
| :--- | :--- |
| **Producto de Software** | EduPulse v2.3: Plataforma Web Híbrida y Agente Dialógico Inteligente |
| **Sustentantes (Desarrolladores)** | José Daniel Durango Caballero & Jefersson Ramírez Oviedo |
| **Director de Proyecto** | Mag. Juan Carlos Giraldo Cardozo |
| **Archivos de Diapositivas** | `EduPulse_Desarrollo_y_Diseno_Final.pptx` / `EduPulse_Sustentacion_Final.pptx` (14 diapositivas panorámicas 16:9) |
| **Entorno de Producción** | [edupulse-575b.onrender.com](https://edupulse-575b.onrender.com) |
| **Tiempo Estimado de Exposición** | 15 a 18 minutos (más demostración en vivo y sesión de preguntas) |

---

## Índice y Distribución Temporal de Diapositivas

```text
Diapositiva 01: Portada Técnica e Identidad del Sistema                  [01:00 min]
Diapositiva 02: Visión del Software y Retos de Ingeniería                [01:15 min]
Diapositiva 03: Arquitectura Técnica Full-Stack y Ecosistema             [01:30 min]
Diapositiva 04: Sistema de Diseño Frutiger Aero Modern Glassmorphism     [01:30 min]
Diapositiva 05: Experiencia de Usuario (UX) Móvil y Ergonomía Reactiva   [01:15 min]
Diapositiva 06: Diseño del Agente Conversacional: Cereza y Mediación     [01:45 min]
Diapositiva 07: Ingeniería de Instrucciones: Framework ROCAS en Backend   [01:30 min]
Diapositiva 08: Evolución del Desarrollo: Línea Temporal (Sprints 1 al 5) [01:15 min]
Diapositiva 09: Evolución del Sistema de Audio: Motor de Voz Dual con IA [01:45 min]
Diapositiva 10: Validación Interactiva de Cuestionarios Fila por Fila    [01:15 min]
Diapositiva 11: Resiliencia de Datos: Eliminación de Condiciones de Carrera [01:30 min]
Diapositiva 12: Suite de Analítica Visual Tipo Google Forms y Radar      [01:30 min]
Diapositiva 13: Gobernanza de Datos, Seguridad RBAC y Google OAuth 2.0   [01:15 min]
Diapositiva 14: Demostración en Vivo en Producción y Cierre Técnico      [01:15 min]
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

### Diapositiva 03 · Arquitectura Técnica Full-Stack y Ecosistema
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"La arquitectura de EduPulse se cimenta sobre un ecosistema full-stack moderno, modular y desacoplado:  
  > * En el **Frontend**, implementamos React 19 con TypeScript estricto, Tailwind CSS v4 para diseño atómico y Lucide Icons, optimizado para empaquetado ultra-rápido mediante Vite 6.  
  > * En el **Backend**, diseñamos un servidor en Node.js y Express que actúa como capa intermedia de seguridad y orquestación con la API de Google Gemini (utilizando la familia multimodal 2.5 Flash), manteniendo oculta la clave de API y gobernando la temperatura de inferencia a 0.4 para garantizar respuestas precisas.  
  > * Para la **Persistencia**, combinamos Google Cloud Firestore en tiempo real con persistencia reactiva en `localStorage` offline-first.  
  > * Y en **Integraciones Cloud**, integramos Google Cloud OAuth 2.0 para exportación directa a Google Sheets y Google Drive con tokens JWT."*

---

### Diapositiva 04 · Sistema de Diseño Frutiger Aero Modern Glassmorphism
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"A nivel de diseño visual, rompimos deliberadamente con el 'Flat Design' corporativo y minimalista que predomina en las aplicaciones web actuales. Rescatamos y modernizamos la estética **Frutiger Aero** combinada con **Glassmorphism**:  
  > * Definimos una paleta cromática inspirada en la atmósfera y el agua: Cyan espacial (`#06B6D4`), azul marino profundo (`#070D18`), esmeralda de validación (`#10B981`) y magenta de acento.  
  > * Desarrollamos componentes con efecto de vidrio esmerilado translúcido utilizando `backdrop-blur-xl`, bordes bioluminiscentes con reflejos de luz y sombras sutiles.  
  > * Integramos una identidad visual distintiva: el reloj de Umbra (*Umbran Watch*), un widget visual animado que simboliza el control temporal y la introspección académica, otorgando calidez y dinamismo a la interfaz sin sacrificar legibilidad."*

---

### Diapositiva 05 · Experiencia de Usuario (UX) Móvil y Ergonomía Reactiva
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Más del 75% de los informantes universitarios acceden desde sus teléfonos inteligentes. Por eso, diseñamos una ergonomía móvil de primer nivel:  
  > * Implementamos una barra de navegación inferior fija (`MobileBottomNav`) con zonas táctiles amplias y retroalimentación háptica visual.  
  > * Incorporamos botones de retorno explícitos en todas las vistas modales y paneles secundarios para evitar que el usuario se pierda.  
  > * Añadimos una solución crítica de UX: el **atrapamiento de eventos `popstate`**. En dispositivos Android y iOS, el gesto de deslizamiento hacia atrás solía cerrar accidentalmente la entrevista en curso. Nuestro sistema intercepta el historial del navegador y muestra una confirmación flotante, protegiendo la sesión y evitando la pérdida accidental de datos."*

---

### Diapositiva 06 · Diseño del Agente Conversacional: Cereza y su Modelo Dialógico
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"El núcleo de la interacción es **Cereza**, nuestro agente conversacional socrático. A diferencia de los asistentes sumisos o genéricos (tipo ChatGPT o Siri), Cereza fue modelada con una personalidad distintiva, elegante y astuta (inspirada en la figura de Bayonetta):  
  > * Emplea un tono cercano pero intelectualmente exigente, dirigiéndose al usuario de tú a tú como un colega en formación.  
  > * Cuando el estudiante da una respuesta complaciente o teórica de manual, Cereza no se conforma: activa técnicas de **indagación de contraste (probing)** y repregunta buscando anécdotas vividas y dilemas reales.  
  > * Utiliza la técnica del **eco reflexivo**, reflejando las propias palabras del estudiante para impulsarlo a profundizar.  
  > * Y crucialmente, posee **criterio de saturación autónomo**: en lugar de ceñirse a un número estático de preguntas, analiza algorítmicamente la densidad y riqueza de las respuestas, marcando el fin de la entrevista (`isInterviewFinished: true`) de forma orgánica entre 6 y 8 turnos de diálogo sustantivos."*

---

### Diapositiva 07 · Ingeniería de Instrucciones: Framework ROCAS en Backend
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Para gobernar el comportamiento de Cereza en cada turno de diálogo, diseñamos en `server.ts` un prompt de sistema estructurado bajo el framework **ROCAS**:  
  > * **Rol:** Mentora reflexiva y aguda en educación y tecnologías computacionales.  
  > * **Objetivo:** Explorar cómo la IA transforma la formación docente, detectando el 'efecto muleta' y la autonomía crítica.  
  > * **Contexto:** Estudiantes de la Universidad de Córdoba en diversas sedes territoriales y semestres.  
  > * **Acciones:** Indagación atómica, preguntas concisas de una sola idea y extracción concurrente de citas textuales.  
  > * **Salida:** Un contrato JSON estricto (`reply`, `dimension`, `identifiedNeed`, `directQuote`, `isInterviewFinished`).  
  > Gracias a la parametrización de temperatura en 0.4 y la cascada inteligente de modelos en Gemini 2.5 Flash, logramos tiempos de respuesta inferiores a 1.2 segundos con un 100% de cumplimiento del esquema JSON."*

---

### Diapositiva 08 · Evolución del Desarrollo: Línea Temporal y Sprints (1 al 5)
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"El desarrollo de EduPulse siguió una metodología ágil iterativa a lo largo de 5 grandes Sprints:  
  > * **Sprint 1:** Arquitectura base, configuración de TypeScript, Vite y conexión inicial con Google Gemini.  
  > * **Sprint 2:** Modelado del agente Cereza, prompts socráticos y control de turnos en `ChatArea.tsx`.  
  > * **Sprint 3:** Módulo psicométrico cuantitativo con persistencia reactiva en Cloud Firestore.  
  > * **Sprint 4:** Rediseño completo bajo Frutiger Aero, navegación móvil y panel administrativo con PIN.  
  > * **Sprint 5 (Versión Final 2.3):** Motor de voz dual multimodal, validación guiada fila por fila, fallback heurístico local para síntesis cualitativa y analítica visual tipo Google Forms."*

---

### Diapositiva 09 · Evolución del Sistema de Audio: Motor de Voz Dual con IA Multimodal
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Uno de los desafíos de ingeniería más fascinantes fue la entrada de voz para los usuarios:  
  > * Inicialmente, implementamos la API nativa del navegador `webkitSpeechRecognition`. Sin embargo, en pruebas de campo en teléfonos móviles y navegadores como Brave o Safari, la API fallaba frecuentemente por falta de soporte nativo o cortes por silencios prolongados.  
  > * Para resolverlo de forma definitiva, diseñamos un **Motor de Voz Dual**:  
  >   1. Desarrollamos el componente `LiveMicVisualizer` con la Web Audio API y Canvas HTML5, renderizando ondas sinusoidales dinámicas de amplitud y frecuencia en tiempo real.  
  >   2. Capturamos el flujo de audio mediante `MediaRecorder` en formato comprimido webm/ogg.  
  >   3. Enviamos el blob de audio al endpoint `/api/transcribe-audio` en nuestro backend, donde la API multimodal de Gemini lo transcribe con altísima precisión fonética, reconociendo modismos colombianos y terminología técnica sin cortes arbitrarios."*

---

### Diapositiva 10 · Módulo de Cuestionarios: Validación Guiada Fila por Fila
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"En el módulo cuantitativo (`InstrumentForm.tsx`), los informantes debían responder matrices Likert con múltiples criterios. En los formularios tradicionales, si un usuario olvida marcar una casilla en una tabla de 10 filas, el sistema se limita a arrojar un error genérico, obligando al usuario a buscar a ciegas cuál fila faltó.  
  > En EduPulse implementamos una **validación guiada interactiva**:  
  > * Si el usuario intenta enviar con campos incompletos, la vista no solo le informa cuántos ítems faltan, sino que despliega un banner superior interactivo con **píldoras de salto automático**.  
  > * Cada píldora indica la fila exacta pendiente; al hacer clic, hace un scroll suave y resalta visualmente la fila con un aura de color ámbar.  
  > * Además, incluimos un botón de consentimiento ético de 1-clic con guardado instantáneo en `localStorage`."*

---

### Diapositiva 11 · Resiliencia de Datos: Eliminación de Condiciones de Carrera
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En la versión anterior, al finalizar la entrevista se presentaba un problema de sincronización: si el usuario cerraba la pestaña justo cuando la IA estaba calculando la matriz cualitativa, la síntesis podía quedar incompleta o entrar en una condición de carrera (*race condition*).  
  > Para blindar la aplicación contra cualquier fallo de red o tiempo de espera, construimos el **Motor de Síntesis Cualitativa Resiliente (`qualitativeSynthesis.ts`)**:  
  > * Si el backend por alguna razón tarda más de lo previsto o se interrumpe la conexión, el frontend activa de forma transparente un **algoritmo heurístico local determinista**.  
  > * Este motor local analiza la transcripción completa, agrupa las intervenciones por dimensiones formativas, extrae las citas más relevantes y calcula los índices de necesidad y polaridad emocional.  
  > * El resultado: **cero pérdida de datos** y disponibilidad garantizada del resumen investigativo en cualquier circunstancia."*

---

### Diapositiva 12 · Suite de Analítica Visual Tipo Google Forms y Radar
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Para la visualización de los datos recopilados por EduPulse, desarrollamos una suite analítica completa inspirada en la familiaridad y ergonomía de Google Forms:  
  > * **Nivel General:** Despliega gráficos interactivos SVG de dona para la distribución demográfica por sedes y semestres, y gráficos de barras horizontales porcentuales para el análisis comparativo de respuestas.  
  > * **Nivel Individual:** Permite al investigador seleccionar cualquier código de informante (E01 a E40) y visualizar su **Radar de Competencias Tecno-pedagógicas**, el desglose turno por turno de su diálogo con Cereza y la matriz de citas pre-categorizadas.  
  > * Esta suite incluye filtros reactivos por sede territorial y exportación de datos en un clic a formato TSV/CSV compatible directamente con Excel y Google Sheets."*

---

### Diapositiva 13 · Gobernanza de Datos, Seguridad RBAC y Google OAuth 2.0
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En materia de seguridad y gobernanza de la información, EduPulse implementa controles estrictos en todos los niveles:  
  > * **Habeas Data y Anonimato:** Los estudiantes participan bajo anonimización completa; sus datos se asocian únicamente a códigos seudonimizados alfanuméricos y nunca a identificadores personales.  
  > * **Control de Acceso de Doble Factor (RBAC):** La vista de investigación está restringida mediante validación de correos en lista blanca con Google OAuth y un **PIN Maestro de Validación Criptográfica (`0412`)** en memoria de sesión volátil.  
  > * **Gobernanza Google Cloud OAuth 2.0:** Registramos los orígenes autorizados de JavaScript (`edupulse-575b.onrender.com` y `localhost`) bajo el cliente OAuth en Google Cloud Console, permitiendo que el endpoint `/api/export-sheets` exporte automáticamente libros de cálculo en tres pestañas organizadas (*Resumen Ejecutivo*, *Respuestas Estructuradas* y *Transcripción Turno a Turno*) directamente al Google Drive del investigador."*

---

### Diapositiva 14 · Demostración en Vivo en Producción y Cierre Técnico
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
