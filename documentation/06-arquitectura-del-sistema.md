DOCUMENTO 06 | ARQUITECTURA Y ESPECIFICACIÓN FUNCIONAL DEL SISTEMA

# DOCUMENTO — 06
# Arquitectura y Especificación Funcional del Sistema
### Plataforma Inteligente para la Investigación Cualitativa sobre Formación Docente e IA

| Campo | Detalle |
| :--- | :--- |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática con Énfasis en Medios Audiovisuales |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Naturaleza del documento** | Arquitectura del sistema, especificación funcional de requisitos y pipeline de datos |
| **Versión** | 1.0 |
| **Fecha** | Octubre de 2026 |

*Documento técnico para la articulación holística de los Modelos 01, 02, 03, 04 y 05.*

---

## 1. Delimitación del Sistema

### Definición general
El sistema **EduPulse** se define como una plataforma web inteligente y co-piloto conversacional diseñado para mediar la recolección, estructuración y análisis de testimonios cualitativos en profundidad de docentes en formación, articulando la ingeniería de prompts bajo el framework ROCAS, modelos de lenguaje extensos (Google Gemini), protocolos socráticos de repregunta reflexiva (*probing*) y estándares de investigación hermenéutica en educación superior.

### 1.1 Alcance positivo: lo que ES
El sistema es un dispositivo tecnopedagógico e investigativo que:
* Guía entrevistas semiestructuradas adaptativas mediante el agente inteligente (**Maya**), personalizando el tono y la complejidad del diálogo según el semestre formativo y la sede del estudiante.
* Ejecuta un protocolo estructurado de repreguntas (*probing*) para profundizar en respuestas escuetas sin inducir sesgos ni emitir juicios evaluativos.
* Ofrece interacción multimodal accesible (dictado por voz mediante Web Speech API y entrada convencional de texto) con sincronización en tiempo real.
* Anonimiza y desidentifica sistemáticamente las participaciones estudiantiles (`E01`, `E02`...), protegiendo la privacidad de los informantes.
* Clasifica y triangula citas discursivas directas dentro de la ontología deductiva de categorías de la investigación (IA, Formación Docente y Efectos de la IA).
* Permite exportar los datos depurados hacia Google Sheets, formatos tabulares planos (CSV/Excel) y entornos de análisis cualitativo asistido por computadora (CAQDAS: ATLAS.ti, NVivo).

### 1.2 Límites: lo que NO ES
* **No es un sistema de evaluación ni calificación académica:** No juzga las competencias del estudiante ni emite notas o valoraciones sumativas.
* **No es un censo ni formulario cerrado:** No recopila respuestas cuantitativas rígidas de opción múltiple; su foco exclusivo es el discurso cualitativo profundo.
* **No es un sustituto del criterio de los investigadores:** El agente facilita la recolección y pre-clasificación primaria; la interpretación hermenéutica final y la redacción de conclusiones corresponden privativamente a los investigadores de grado.
* **No almacena datos personales sensibles no autorizados:** No registra identificaciones de ciudadanía, números telefónicos privados ni direcciones domiciliarias.

### 1.3 Principio arquitectónico central
```text
Entrada de Informante (Voz / Texto)
             │
             ▼
Interpretación Contextual (Modelo del Alumno + Semestre)
             │
             ▼
Consulta de Dominios y Guion (Modelo del Conocimiento + DEFAULT_GUIDES)
             │
             ▼
Razonamiento Socrático y Probing (Modelo del Tutor + Reglas ROCAS)
             │
             ▼
Inferencia Estructurada (Gemini 3.8 Flash · responseMimeType: application/json)
             │
             ▼
Persistencia Reactiva (Cloud Firestore + Estado Local)
             │
             ▼
Extracción Analítica y Triangulación (SummaryView · CAQDAS · Exportación)
```

---

## 2. Trazabilidad de Modelos (Integración 01 a 05)

La arquitectura técnica de EduPulse se nutre de manera orgánica de los documentos precedentes, asegurando una perfecta coherencia conceptual entre la pedagogía, los datos, el usuario y la infraestructura:

| Componente Base | Función en la Arquitectura de EduPulse | Aplicación Operativa en el Sistema |
| :--- | :--- | :--- |
| **Modelo del Tutor (Doc 01)** | Define el motor dialéctico, socrático y de repregunta reflexiva del agente. | Determina las reglas de dosificación de preguntas, atomicidad discursiva, límites de probing (máx. 2) y criterios de avance (`advanceToNextQuestion`). |
| **Modelo del Conocimiento (Doc 02)** | Actúa como corpus epistemológico, ontología de categorías y marco de triangulación. | Proporciona las categorías deductivas (Tabla 1 de la tesis), las directrices de la UNESCO, el marco DigCompEdu, el modelo TPACK y las preguntas guía (`DEFAULT_GUIDES`). |
| **Modelo del Alumno (Doc 03)** | Funciona como filtro contextual y gestor del estado cognoscitivo y curricular. | Inyecta en cada turno la orientación pedagógica correspondiente a la etapa formativa del estudiante (Fundamentación, Didáctica o Práctica Docente en colegios). |
| **Modelo del Mundo / DESIGN.md (Doc 04)** | Define el entorno conversacional, UX/UI, accesibilidad y componentes del frontend. | Estructura las pantallas de la aplicación (`InterviewRoom`, `SessionsDashboard`, `SummaryView`), la metáfora del "Café Pedagógico" y la multimodalidad por voz. |
| **Prompt Maestro ROCAS (Doc 05)** | Orquesta la inferencia en tiempo de ejecución en el servidor. | Consolida la instrucción de sistema de Maya con reglas estrictas de no sesgo, prohibición de preguntar la carrera y salida obligatoria en esquema JSON. |

### 2.1 Flujo de trazabilidad operativa
1. El docente en formación inicia sesión validando el consentimiento informado en `NewSessionModal`.
2. El sistema recupera el perfil del estudiante (semestre, sede) y parametriza el Modelo del Alumno.
3. El motor backend consulta el Modelo del Conocimiento para extraer la pregunta activa y las pistas de indagación (`probingTips`).
4. El Modelo del Tutor evalúa la longitud del turno anterior y decide si corresponde activar una repregunta reflexiva o avanzar.
5. El Prompt Maestro articula las restricciones y despacha la petición estructurada a la API de Google GenAI (`gemini-3.8-flash`).
6. La respuesta generada en JSON se valida, se proyecta en la sala `InterviewRoom` y se almacena en Cloud Firestore.
7. Al concluir la entrevista, el módulo analítico procesa la transcripción y genera la síntesis para el informe de investigación.

---

## 3. Matriz de Actores, Roles y Permisos

| Rol | Permisos Principales | Restricciones / Controles de Seguridad |
| :--- | :--- | :--- |
| **1. Investigador / Administrador** *(José Daniel Durango y Jefersson Ramírez)* | • Crear, modificar o archivar guiones de entrevista (`GuidesManager`).<br>• Monitorear sesiones activas en tiempo real desde `SessionsDashboard`.<br>• Ejecutar el motor de síntesis cualitativa (`/api/analyze-interview`).<br>• Exportar bases de datos estructuradas a Google Sheets, CSV y formatos CAQDAS.<br>• Configurar parámetros del sistema y variables de entorno. | Sus intervenciones quedan registradas con marcas de auditoría; no puede manipular retroactivamente las respuestas textuales emitidas por los estudiantes. |
| **2. Docente en Formación** *(Informante Clave)* | • Acceder a la sala de entrevista mediante enlace o credencial de sesión.<br>• Leer, aceptar o declinar el Consentimiento Informado.<br>• Interactuar con Maya por teclado o micrófono en un entorno confidencial.<br>• Solicitar pausas o dar por concluida la entrevista cuando lo considere pertinente. | No puede alterar las preguntas base de la guía, modificar la configuración del sistema, ni visualizar las respuestas de otros participantes. |
| **3. Agente Inteligente** *(Maya)* | • Conducir el diálogo conversacional respetando el guion aprobado.<br>• Formular repreguntas reflexivas graduadas (máx. 2 por pregunta).<br>• Realizar transiciones naturales y síntesis empáticas de los temas.<br>• Extraer aprendizajes cualitativos preliminares en cada turno. | Tiene **estrictamente prohibido** alucinar carreras ajenas a la Licenciatura en Informática, emitir juicios evaluativos normativos, o almacenar información sensible fuera de Firestore. |

---

## 4. Inventario de Requerimientos del Sistema

### 4.1 Requerimientos Funcionales (RF)

| ID | Requerimiento | Criterio de Cumplimiento Técnico |
| :--- | :--- | :--- |
| **RF-01** | **Gestión Adaptativa de la Entrevista** | El sistema debe ejecutar el guion cualitativo semiestructurado adaptando el tono y las preguntas al semestre académico reportado (Fundamentación, Desarrollo Didáctico o Práctica Docente). |
| **RF-02** | **Protocolo de Probing Automatizado** | El agente debe formular un máximo de dos repreguntas de profundización cuando la respuesta sea breve o ambigua, solicitando anécdotas o reflexiones situadas. |
| **RF-03** | **Interacción Multimodal por Voz** | La plataforma debe permitir al usuario dictar sus respuestas mediante reconocimiento de voz continuo en el navegador (Web Speech API) y escuchar las intervenciones del agente. |
| **RF-04** | **Salida Estructurada en JSON** | Cada inferencia del agente debe responder a un esquema JSON estricto con campos de respuesta conversacional, banderas de control (`advanceToNextQuestion`, `isClarifying`) y metadatos analíticos. |
| **RF-05** | **Pre-categorización y Análisis Cualitativo** | El sistema debe clasificar las citas textuales directas del informante en las categorías deductivas de la investigación (IA, Formación Docente y Efectos) mediante `/api/analyze-interview`. |
| **RF-06** | **Exportación Interoperable de Datos** | La plataforma debe generar exportaciones a Google Sheets y archivos CSV/Excel formateados para su importación directa en software CAQDAS (ATLAS.ti / NVivo). |

### 4.2 Requerimientos No Funcionales (RNF)

| ID | Requerimiento | Criterio de Cumplimiento Técnico |
| :--- | :--- | :--- |
| **RNF-01** | **Tono Conversacional y Empatía Dialéctica** | La comunicación de Maya debe ser cálida, horizontal, reflexiva y libre de tecnicismos intimidantes o formalismos burocráticos. |
| **RNF-02** | **Resiliencia de Red y Latencia Controlada** | El tiempo de respuesta de la API de inferencia no debe exceder los 2.5 segundos bajo condiciones normales de red, incorporando reintentos exponenciales ante fallas transitorias. |
| **RNF-03** | **Preservación de la Privacidad (PII Shield)** | Las transcripciones exportadas deben sustituir los nombres reales por identificadores alfa-numéricos sistemáticos (`E01` a `E12`) para garantizar confidencialidad ética. |
| **RNF-04** | **Persistencia Reactiva en Tiempo Real** | Todos los mensajes deben sincronizarse de manera reactiva en Google Cloud Firestore sin pérdida de información ante cierres accidentales del navegador. |
| **RNF-05** | **Diseño Responsive y Accesibilidad** | La interfaz debe adaptarse fluidamente a dispositivos de escritorio, portátiles y teléfonos móviles, cumpliendo estándares de contraste y accesibilidad WCAG 2.1 AA. |

---

## 5. Criterios de Validación Funcional

| Requisito | Prueba Funcional Propuesta | Resultado Esperado |
| :--- | :--- | :--- |
| **RF-01** | Iniciar sesión indicando "2° Semestre" y verificar el saludo y primera pregunta de Maya. | El agente da la bienvenida sin tecnicismos complejos y no pregunta qué carrera estudia; enfoca el diálogo en su experiencia como estudiante inicial. |
| **RF-02** | Responder con una frase escueta (*"Casi no uso la IA"*). | Maya formula una repregunta amable solicitando una anécdota y marca `isClarifying: true` sin avanzar de pregunta. |
| **RF-03** | Activar el botón de micrófono y dictar una respuesta de 30 segundos. | El texto se transcribe fielmente en el campo de entrada y se envía con éxito a la sesión. |
| **RF-04** | Inspeccionar el payload recibido del backend en la consola de red. | El cuerpo de respuesta es un JSON válido sin bloques markdown espurios (`\```json`) ni campos faltantes. |
| **RF-05** | Finalizar una entrevista y ejecutar el botón de análisis en `SummaryView`. | Se genera un reporte con citas textuales clasificadas en Categoría A (IA), B (Formación) y C (Efectos) con sentimiento global identificado. |
| **RF-06** | Presionar el botón "Exportar a CSV" en `SessionsDashboard`. | Se descarga un archivo `.csv` estructurado con columnas codificadas listas para análisis en ATLAS.ti o Excel. |

---

## 6. Pipeline de Datos en Tres Capas (Data Architecture)

```text
+-------------------------------------------------------------------------------+
| CAPA 1: INGESTA CRUDA (Raw Ingestion Layer)                                   |
| - Captura en vivo de texto y audio mediante Web Speech API.                   |
| - Registro secuencial de cada turno de habla con marca de tiempo ISO 8601.   |
| - Almacenamiento no destructivo en la colección 'sessions' de Cloud Firestore.|
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
| CAPA 2: TRANSFORMACIÓN Y PRIVACIDAD (Enriched & PII Shield Layer)             |
| - Seudo-anonimización mediante sustitución por códigos (E01, E02, ..., E12).  |
| - Enriquecimiento con variables de etapa formativa y métricas de interacción  |
|   (longitud de caracteres, modalidad de habla, conteo de repreguntas).        |
+-------------------------------------------------------------------------------+
                                       │
                                       ▼
+-------------------------------------------------------------------------------+
| CAPA 3: ANÁLISIS Y CAQDAS (Analytical & Hermeneutic Layer)                    |
| - Procesamiento semántico en el endpoint '/api/analyze-interview'.            |
| - Extracción estructurada de citas textuales vinculadas a la Tabla 1 de la    |
|   tesis (Gestión, Ética, Saberes TPACK, Práctica Reflexiva y Limitaciones).   |
| - Canalización a Google Sheets y exportación a formatos compatibles con       |
|   ATLAS.ti y NVivo.                                                           |
+-------------------------------------------------------------------------------+
```

---

## 7. Seguridad, Gobernanza y Privacidad (PII)
* **Desidentificación Rigurosa:** Las transcripciones de investigación sustituyen los nombres de los estudiantes por identificadores alfa-numéricos sistemáticos (`E01`...`E12`), disociando cualquier dato de contacto personal.
* **Consentimiento Informado Digital:** Ninguna sesión puede comenzar sin que el usuario marque la casilla de aceptación formal del consentimiento ético, en conformidad con los lineamientos de bioética en investigación educativa.
* **Seguridad en Base de Datos (`firestore.rules`):** Reglas de seguridad declarativas que restringen la lectura y escritura de documentos de sesión únicamente a clientes autorizados.
* **Custodia de Credenciales:** La clave `GEMINI_API_KEY` se resguarda exclusivamente en el entorno del servidor backend (`.env`), protegida de exposición en el código frontend y excluida del repositorio Git mediante `.gitignore`.

---

## 8. Infraestructura, Despliegue y Resiliencia Técnica
* **Arquitectura de Servidor Unificado:** Aplicación full-stack ejecutada mediante Node.js, Express y Vite en modo middleware (`server.ts`), sirviendo las rutas de API de inteligencia artificial y la SPA en React desde el mismo puerto de escucha (`PORT=3000`).
* **SDK Oficial de IA:** Integración directa con `@google/genai` utilizando el modelo `gemini-3.8-flash`, garantizando alta concurrencia y máxima eficiencia de tokens.
* **Resiliencia ante Latencia y Cuotas:** Envoltorio `generateWithRetry` con 3 intentos automáticos y retroceso exponencial (*exponential backoff*) ante códigos de error HTTP 429 (límite de peticiones) o 503 (servicio no disponible).
* **Entornos de Despliegue:**
  * Modo desarrollo / investigación local: `npm run dev`.
  * Modo producción optimizado: `npm run build && npm start`.
  * Modo nube: Empaquetamiento compatible con contenedores Docker para despliegue en Google Cloud Run o plataformas PaaS afines.

---

## 9. Reglas de Operación del Agente
1. **Contextualización obligatoria:** Toda intervención debe estar anclada en la Licenciatura en Informática con Énfasis en Medios Audiovisuales de la Universidad de Córdoba.
2. **Prohibición de sesgo indagatorio:** NUNCA preguntar al participante qué carrera estudia ni sugerir respuestas orientadas a un fin determinado.
3. **Atomicidad discursiva:** Una sola pregunta concreta por turno conversacional para asegurar respuestas claras y reflexivas.
4. **Respeto a la saturación temática:** No realizar más de dos repreguntas de profundización (*probing*) sobre un mismo tópico de la guía.
5. **Neutralidad axiológica:** Prohibición terminante de calificar o juzgar las respuestas del participante como "buenas", "malas" o "correctas".
6. **Preservación de la agencia humana:** Tratar al docente en formación como un colega con criterio profesional y capacidad de decisión pedagógica.
7. **Formato estructurado inquebrantable:** Todas las respuestas de inferencia deben ser emitidas en formato JSON estricto para garantizar la estabilidad del cliente web.

---

## 10. Cierre de la Especificación
La presente arquitectura establece al sistema EduPulse como un entorno robusto, ético y metodológicamente estructurado para asistir la investigación cualitativa en educación superior. Al conjugar modelos teóricos reconocidos (TPACK, DigCompEdu, directrices de la UNESCO) con la potencia de los modelos de lenguaje extensos y una interfaz orientada al diálogo empático, el sistema asegura la recopilación de datos de máxima calidad científica para dar respuesta cabal al problema de investigación de la tesis de grado.

---

## 11. Control Documental

| Campo | Detalle |
| :--- | :--- |
| **Documento** | Documento 06: Arquitectura y Especificación Funcional del Sistema |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Institución de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Versión** | 1.0 |
| **Estado** | Documento técnico-metodológico para revisión y sustentación académica |
| **Fecha de elaboración** | Octubre de 2026 |

---

## 12. Referencias académicas utilizadas
* Bass, L., Clements, P., & Kazman, R. (2021). *Software architecture in practice* (4th ed.). Addison-Wesley Professional.
* Creswell, J. W., & Poth, C. N. (2018). *Qualitative inquiry and research design: Choosing among five approaches* (4th ed.). SAGE Publications.
* Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014). *Metodología de la investigación* (6.ª ed.). McGraw-Hill Education.
* Kvale, S. (2007). *Doing interviews*. SAGE Publications. https://doi.org/10.4135/9781849208963
* Mishra, P., & Koehler, M. J. (2006). Technological pedagogical content knowledge: A framework for teacher knowledge. *Teachers College Record*, 108(6), 1017–1054. https://doi.org/10.1111/j.1467-9620.2006.00684.x
* Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.
* Redecker, C. (2017). *European framework for the digital competence of educators: DigCompEdu* (Y. Punie, Ed.). Publications Office of the European Union. https://doi.org/10.2760/159770
* UNESCO. (2023). *Guidance for generative AI in education and research*. UNESCO Publishing. https://unesdoc.unesco.org/ark:/48223/pf0000386693
