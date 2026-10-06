# 04. Modelo del Mundo: Entorno Conversacional, Interfaz y Herramientas

## 1. Definicion y Proposito

El **Modelo del Mundo** define el escenario digital, la interfaz de usuario y los mecanismos mediante los cuales el participante interactua con el agente inteligente. 

En **EduPulse**, este entorno sustituye los formularios frios y las encuestas estaticas por una **sala de entrevista inmersiva, accesible y reflexiva**, disenada con la metafora de una conversacion distendida entre colegas de la educacion.

---

## 2. Metafora y Diseno de la Experiencia (UX/UI)

1. **Metafora del "Cafe Pedagogico":**
   * La interfaz elimina cualquier elemento que sugiera un examen, una prueba de conocimientos o un censo burocratico.
   * El participante es recibido en un espacio acogedor que transmite seguridad, confidencialidad y apertura de pensamiento.

2. **Indicadores de Transparencia Contextual:**
   * **Tarjeta de foco tematico:** En la parte superior de la sala se despliega sutilmente el topico en discusion (ej.: *"Tema actual: Conciencia Etica y Sesgos"*). Esto ayuda al estudiante a mantener la orientacion reflexiva.
   * **Barra de progresion gradual:** Un medidor visual del progreso (0% a 100%) informa con claridad el avance en el guion de entrevista sin generar sensacion de urgencia.

3. **Demarcacion de Turnos y Trato Humano:**
   * Los globos de conversacion diferencian claramente al agente (**Maya**) del estudiante.
   * El agente se dirige al estudiante por su nombre de pila y contextualiza sus preguntas en la realidad universitaria de Monteria y sus centros de tutoria.

---

## 3. Capacidades Multimodales y Herramientas del Entorno

Para garantizar accesibilidad y riqueza discursiva, el entorno integra herramientas nativas del navegador y servicios en la nube:

### A. Reconocimiento y Sintesis de Voz (Web Speech API)
* **Entrada por Voz (Speech-to-Text):** 
  * Los estudiantes pueden presionar el boton de microfono y expresar sus reflexiones oralmente.
  * El sistema transcribe en tiempo real el discurso hablado a texto, permitiendo respuestas mas espontaneas, extensas y fluidas que las producidas por tecleo manual.
* **Salida de Audio (Text-to-Speech):** 
  * Opcion para que el participante escuche las respuestas y repreguntas de Maya con voz naturalizada, simulando una entrevista presencial guiada.

### B. Herramientas Integradas (Tools & Data Connectors)
* **Conector de Base de Datos (Firebase Firestore):** 
  * Sincronizacion bidireccional en tiempo real de cada mensaje y cambio de estado.
  * Permite que el investigador supervise sesiones activas desde el panel de control (`SessionsDashboard`).
* **Conector de Exportacion (Google Sheets & CSV/Excel):** 
  * Canalizacion directa de las transcripciones y categorizaciones hacia hojas de calculo en Google Drive o archivos descargables.
* **Modal de Transparencia Institucional (`ThesisProjectModal`):** 
  * Permite al participante consultar en cualquier momento la ficha tecnica del proyecto de investigacion, los nombres de los autores, directores, problema y aval institucional de la Universidad de Cordoba.
