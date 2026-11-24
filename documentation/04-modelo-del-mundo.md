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
| **V-07** | `AdminAuthModal.tsx` | Portal de Seguridad | Modal de autenticación de doble factor para investigadores: verificación de cuenta de Google con lista blanca y PIN Maestro (`0412`). |
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
