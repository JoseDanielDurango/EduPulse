DOCUMENTO 04 | MODELO DEL MUNDO (DESIGN.MD): INTERFAZ Y ECOSISTEMA CONVERSACIONAL

# DOCUMENTO — 04
# Modelo del Mundo (DESIGN.md): Interfaz y Ecosistema Conversacional

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática con Énfasis en Medios Audiovisuales |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Documento** | Documento 04 — Modelo del Mundo (DESIGN.md): Interfaz y Ecosistema Conversacional (Versión 1.0) |

*Propósito del documento. Este documento define el modelo conceptual, la metáfora de interfaz, las condiciones materiales de uso y resiliencia tecnológica, el flujo de interacción humano-computador (HCI) y el inventario exhaustivo de vistas de la plataforma EduPulse, con énfasis en una experiencia inmersiva, accesible, reflexiva y orientada a la recolección fidedigna de datos cualitativos.*

---

## 1. Metáfora del Sistema
**Metáfora principal: El Café Pedagógico y Sala de Diálogo Reflexivo.**

Para favorecer la apertura dialéctica y mitigar el sesgo de deseabilidad social o la intimidación tecnológica, la interfaz abandona de manera deliberada la estética asociada a "formularios de encuesta", "exámenes virtuales" o "plataformas burocráticas". El sistema adopta la metáfora de un encuentro informal entre colegas educadores que comparten un café para dialogar sobre los desafíos de su profesión docente:
* El docente en formación se siente escuchado por una colega empática (**Maya**), en un clima de confianza donde se explicita que no existen respuestas correctas ni erradas.
* La sala de interacción elimina contadores regresivos punitivos, cronómetros de evaluación o calificaciones numéricas.
* Los elementos de guía (tarjeta temática superior y barra de progresión armónica) orientan la conversación sin generar presión temporal.
* La interfaz prioriza la calidez visual, la legibilidad tipográfica y la baja carga cognitiva, adaptándose tanto a usuarios con alta destreza técnica como a aquellos en semestres formativos iniciales.

---

## 2. Condiciones Materiales y Resiliencia — Contexto Universitario y Regional

El diseño de interacción se fundamenta en las condiciones reales de infraestructura tecnológica presentes en el departamento de Córdoba y en las distintas sedes de la Universidad de Córdoba (Montería, Lorica, Planeta Rica, Sahagún y Montelíbano), caracterizadas por fluctuaciones en el fluido eléctrico e intermitencia en el acceso a internet.

### 2.1 Tolerancia a la Latencia y Fluctuaciones de Red
Las consultas a modelos de lenguaje extensos (LLMs) conllevan tiempos de procesamiento inherentes que pueden incrementarse en redes lentas. Para salvaguardar la confianza del informante y evitar la sensación de abandono:
* **Micro-estados informativos:** El sistema emite indicadores visuales discretos y dinámicos durante la inferencia (*"Maya está reflexionando..."*, *"Escuchando con atención..."*).
* **Persistencia local inmediata:** Cada turno de habla se escribe primero en el estado reactivo del cliente antes de confirmar la sincronización remota, impidiendo la pérdida de transcripciones si la conexión se interrumpe momentáneamente.
* **Mecanismos de reintento suave (*Soft Backoff*):** Si la API remota experimenta sobrecarga o caída transitoria, el backend ejecuta reintentos graduales y, en caso extremo, activa una respuesta de contingencia conversacional sin romper la sesión.

### 2.2 Enfoque Multimodal Equilibrado (Voz y Texto)
Para maximizar la riqueza expresiva y la inclusión de participantes con diversos estilos de comunicación:
* **Entrada por Voz (Web Speech API):** Los docentes en formación pueden presionar el control de micrófono para expresar oralmente sus vivencias. Esto estimula respuestas más extensas, narrativas vivas y anécdotas espontáneas en comparación con el tecleo convencional.
* **Salida de Audio (Text-to-Speech):** Posibilidad de escuchar la voz de Maya con entonación naturalizada, fortaleciendo la sensación de un diálogo humano presencial.
* **Arquitectura Text-First de Respaldo:** Todas las operaciones de voz cuentan con transcripción bidireccional instantánea a texto legible. En equipos sin micrófono funcional o en salas de informática con ruido ambiente, la interacción por teclado permanece 100% operativa con consumo mínimo de ancho de banda.

### 2.3 Exportación Inmediata y Portabilidad hacia CAQDAS
Los datos cualitativos recolectados deben preservarse con integridad metodológica para su posterior análisis temático:
* **Canalización a Google Sheets:** Sincronización estructurada de columnas mediante el módulo `sheetsExport.ts`.
* **Descarga de Archivos Planos (CSV / Excel):** Generación de tablas estandarizadas con identificador seudo-anonimizado (`studentCode`), marca temporal, etapa formativa, cita textual directa y subcategoría deductiva asignada.
* **Compatibilidad con Software Cualitativo:** Formato estructurado directamente importable en programas de análisis cualitativo asistido por computadora (ATLAS.ti, NVivo, MAXQDA).

---

## 3. Flujo de Interacción Humano-Máquina (HCI)

La interacción en EduPulse se organiza bajo el principio de **Asistencia Progresiva y Mayéutica No Directiva** (Kvale, 2007; Shneiderman et al., 2016): el sistema inicia contextualizando al informante, formula preguntas abiertas graduadas según su semestre, ejecuta repreguntas de profundización (*probing*) si la intervención lo requiere y sintetiza los hallazgos antes de transitar al siguiente bloque.

| Etapa | Entrada del Informante / Usuario | Respuesta del Agente (Maya) | Resultado en el Sistema |
| :--- | :--- | :--- | :--- |
| **01 · Ingreso y Consentimiento** | Registro de datos sociodemográficos y validación del consentimiento informado en `NewSessionModal`. | Inicializa el perfil en el Modelo del Alumno e inyecta la directriz de etapa formativa. | Sesión creada en Firestore con estado `active` y código de anonimización (`E01`). |
| **02 · Apertura y Encuadre** | Ingreso a la sala `InterviewRoom`. | Saluda cordialmente por su nombre, reconoce su semestre en la Licenciatura y formula la primera pregunta abierta adaptada. | Primer turno conversacional desplegado; foco temático activo en pantalla. |
| **03 · Narrativa y Profundización** | Expresión oral o escrita del estudiante compartiendo vivencias o anécdotas. | Evalúa la densidad discursiva. Si es breve o ambigua, lanza una repregunta reflexiva (*probing*, máx. 2) solicitando ejemplos reales. | Incremento de `currentClarificationCount`; enriquecimiento cualitativo del testimonio. |
| **04 · Saturación y Transición** | Respuesta detallada o cumplimiento del límite de repreguntas. | Emite una validación empática neutral, extrae el hallazgo pedagógico y enlaza suavemente con la siguiente pregunta de la guía. | `advanceToNextQuestion: true`; avance visual en la barra de progreso (ej: de 28% a 42%). |
| **05 · Cierre y Meta-reflexión** | Respuesta a la última pregunta sobre propuestas curriculares para la universidad. | Agradece calurosamente al participante por sus aportes a la investigación y declara formalmente el fin de la sesión. | `isInterviewFinished: true`; cambio de estado de sesión a `completed`. |
| **06 · Análisis y Triangulación** | El investigador accede a `SummaryView` o activa el análisis analítico. | El motor genera síntesis hermenéutica, agrupando citas directas en las categorías A, B y C de la investigación. | Informe consolidado listo para exportación y triangulación teórica. |

### Ejemplo de Diálogo y Negociación Dialéctica Contextualizada:
> **Maya:** *"¡Hola Carlos! Qué gusto conversar contigo, sabiendo que estás en 5° semestre de la Licenciatura en Informática y Medios Audiovisuales. Hoy tendremos una charla tranquila sobre cómo vives la tecnología y la IA en tus materias. Para empezar: ¿De qué manera has incorporado herramientas como ChatGPT o generadores de imágenes en tus proyectos o clases?"*  
> **Carlos (Docente en Formación):** *"Pues casi siempre lo uso para redactar los guiones de los videos educativos que nos piden en producción de medios, pero a veces no me convence lo que redacta."*  
> **Maya (Probing de Ejemplificación):** *"Tiene mucho sentido lo que mencionas. Pensando en esos guiones educativos, ¿podrías contarme alguna anécdota o ejemplo puntual donde sentiste que el guion de la IA no se adaptaba a lo que tú querías enseñar pedagógicamente?"*  
> **Carlos:** *"Sí, claro. En una microclase de scratch para niños de primaria, la IA usaba palabras muy técnicas como 'algoritmo recursivo' que ningún niño de cuarto iba a entender. Me tocó reescribir todo el enfoque para hacerlo con metáforas de cocina."*  
> *(El agente detecta transposición didáctica crítica, guarda la cita y avanza al tema ético).*

---

## 4. Inventario de Vistas (Pantallas del Sistema)

| ID | Vista / Componente | Función Principal e Interfaz de Usuario |
| :--- | :--- | :--- |
| **V-01** | `SessionsDashboard` (Panel del Investigador) | Vista principal para los tesistas administradores. Permite visualizar la lista de entrevistas en tiempo real, filtrar por estado (`active`, `completed`), consultar métricas de avance, acceder al lector de transcripciones íntegras y activar la exportación masiva a hojas de cálculo o CSV. |
| **V-02** | `NewSessionModal` (Configuración y Consentimiento) | Formulario modal de ingreso donde se parametriza la sesión: nombre del participante, semestre (1° a 10°), sede universitaria (Montería u otras) y lectura del texto de consentimiento informado con casilla de verificación obligatoria. |
| **V-03** | `InterviewRoom` (Sala de Entrevista Multimodal) | Entorno inmersivo de diálogo. Dispone de tarjeta superior de orientación con el tema actual, medidor visual de progreso (0% a 100%), panel de mensajes tipo burbuja con diferenciación cromática entre Maya y el estudiante, área de entrada de texto enriquecido, conmutador de reconocimiento de voz y reproductor de voz artificial. |
| **V-04** | `GuidesManager` (Gestión de Guiones Cualitativos) | Interfaz para consultar, crear o editar guiones de entrevista semiestructurados. Permite enlazar preguntas individuales con objetivos de investigación específicos, definir pistas de profundización (*probingTips*) y seleccionar la guía activa para nuevas entrevistas. |
| **V-05** | `SummaryView` (Extracción Analítica y Triangulación) | Panel de síntesis cualitativa generado por el backend (`/api/analyze-interview`). Organiza los extractos del diálogo en las categorías A (IA), B (Formación Docente) y C (Efectos), destacando citas textuales directas, puntos críticos y sentimiento global. |
| **V-06** | `ThesisProjectModal` (Ficha Técnica Institucional) | Componente de transparencia pública. Despliega la información formal del proyecto de grado: autores (José Daniel Durango Caballero y Jefersson Ramírez Oviedo), título, formulación del problema, supuestos, objetivos generales y específicos, y aval de la Universidad de Córdoba. |
| **V-07** | `Navbar` (Barra de Navegación Global) | Encabezado superior con accesos rápidos a la Sala de Entrevista, el Panel de Sesiones, el Gestor de Guiones, el modal institucional y el selector de idioma de la plataforma. |

---

## 5. Principios de Diseño del Ecosistema

| Principio | Aplicación Concreta en EduPulse |
| :--- | :--- |
| **Horizontalidad y Empatía** | Maya no juzga ni instruye con superioridad académica; conversa como una colega reflexiva, disipando tensiones evaluativas en el informante. |
| **Transparencia Epistemológica** | El participante conoce en todo momento los objetivos del proyecto y puede revisar la ficha técnica institucional con un solo clic. |
| **Resiliencia Tecnológica** | La interfaz tolera interrupciones de red, conserva estados en el cliente y ofrece alternativas funcionales ante caídas de ancho de banda en sedes provinciales. |
| **Baja Carga Cognitiva** | Formulación de una sola pregunta a la vez, tarjetas contextuales limpias y eliminación de menús engorrosos durante la entrevista. |
| **Soberanía y Agencia del Informante** | El estudiante decide si responder por voz o texto, controla la pausa de su sesión y es el protagonista de sus reflexiones pedagógicas. |
| **Portabilidad y Fidelidad de Datos** | La información cualitativa se procesa sin distorsión semántica y se entrega en formatos abiertos listos para CAQDAS y hojas analíticas. |

---

## 6. Arquitectura Conceptual de la Experiencia

El ecosistema de interacción de EduPulse se articula en tres superficies complementarias:
* **Superficie de Entrada:** `NewSessionModal` y encuadre ético, donde se configuran los parámetros del informante y se formaliza el consentimiento informado.
* **Superficie de Interacción:** `InterviewRoom`, donde se ejecuta el co-pilotaje cualitativo y el diálogo multimodal entre el docente en formación y Maya.
* **Superficie de Producción:** `SummaryView`, `SessionsDashboard` y módulos de exportación, donde los testimonios discursivos se transforman en artefactos científicos tabulados, analizados y listos para el informe final de grado.

---

## 7. Criterios Técnicos de Interfaz
* **Jerarquía visual inequívoca:** Separación cromática nítida entre mensajes del agente y del participante, resaltando los botones de acción crítica (enviar mensaje, activar micrófono, avanzar sesión).
* **Retroalimentación continua de inferencia:** Indicadores de estado visuales durante el procesamiento de la API de Google Gemini para prevenir pulsaciones dobles o confusión.
* **Diseño completamente adaptable (*Responsive*):** Interfaz optimizada para operar tanto en computadores portátiles y de escritorio como en tabletas y dispositivos móviles utilizados por los estudiantes.
* **Cumplimiento de pautas de accesibilidad:** Contrastes de color certificados bajo estándares WCAG 2.1 nivel AA y soporte integral de atajos de teclado y lectores de pantalla.

---

## 8. Referencias académicas utilizadas
* Creswell, J. W., & Poth, C. N. (2018). *Qualitative inquiry and research design: Choosing among five approaches* (4th ed.). SAGE Publications.
* Kvale, S. (2007). *Doing interviews*. SAGE Publications. https://doi.org/10.4135/9781849208963
* Nielsen, J., & Budiu, R. (2013). *Mobile usability*. New Riders.
* Norman, D. (2013). *The design of everyday things* (Revised ed.). Basic Books.
* Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N., & Diakopoulos, N. (2016). *Designing the user interface: Strategies for effective human-computer interaction* (6th ed.). Pearson.
