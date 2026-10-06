# 02. Modelo del Conocimiento: Categorias, Saberes y Marcos Curados

## 1. Definicion y Proposito

El **Modelo del Conocimiento** delimita el dominio conceptual sobre el cual interactua el agente. Define **que se investiga, que conceptos debe dominar el agente y cuales son los estandares teoricos** contra los cuales se triangulan las intervenciones de los participantes.

En **EduPulse**, este modelo formaliza el marco teorico y conceptual de la investigacion de grado en la Universidad de Cordoba, estructurando los saberes en una red de categorias y unidades de analisis verificadas.

---

## 2. Marco Conceptual y Ontologia de Categorias (Tabla 1 de la Tesis)

El modelo de conocimiento se estructura directamente sobre las tres grandes categorias declaradas en el diseno metodologico del proyecto:

### Categoria A: Inteligencia Artificial (IA)
* **Subcategoria A1: Gestion y Mediacion Pedagogica**
  * Unidades de analisis: Uso de LLMs (ChatGPT, Gemini, Claude) y generadores audiovisuales para la explicacion de temas, diseno de tareas, resumenes y retroalimentacion a los alumnos.
  * Conceptos clave: Mediacion tecnologica, transposicion didactica con IA, interactividad y optimizacion de tiempos de estudio.
* **Subcategoria A2: Dimension Etica y Critica**
  * Unidades de analisis: Tratamiento de la privacidad de datos, sesgos de entrenamiento y de genero, propiedad intelectual, alucinaciones del modelo y sobredependencia cognitiva.
  * Conceptos clave: Alfabetizacion critica en IA, etica de datos, verificacion de fuentes y transparencia.

### Categoria B: Formacion Docente
* **Subcategoria B1: Articulacion de Saberes (Pedagogico, Tecnologico y Etico)**
  * Unidades de analisis: Integracion armonica entre el dominio tecnico de la informatica y los fundamentos pedagogicos (modelo TPACK: Technological Pedagogical Content Knowledge).
  * Conceptos clave: Curriculo de la Licenciatura, asignaturas del plan de estudios, didactica de la informatica, produccion de medios audiovisuales educativos.
* **Subcategoria B2: Practica Reflexiva**
  * Unidades de analisis: Capacidad del docente en formacion para interrogar su propio quehacer (Schon), evolucion de su identidad profesional frente a la automatizacion y rol mediador frente a los estudiantes escolares.
  * Conceptos clave: Identidad docente, agencia pedagogica, metacognicion y autoeficacia digital.

### Categoria C: Efectos de la Inteligencia Artificial
* **Subcategoria C1: Impacto en la Practica Profesional (Planeacion y Creatividad)**
  * Unidades de analisis: Eficiencia en la preparacion de clases, enriquecimiento de secuencias didacticas, ideacion de recursos multimedia y adaptabilidad a estilos de aprendizaje.
  * Conceptos clave: Innovacion didactica, creatividad aumentada, personalizacion educativa.
* **Subcategoria C2: Retos y Limitaciones Formativas**
  * Unidades de analisis: Falta de capacitacion curricular formal en la universidad, limitaciones de conectividad e infraestructura en los centros de tutoria (Monteria, Lorica, Planeta Rica), resistencia institucional y vacios normativos.
  * Conceptos clave: Brecha digital regional, infraestructura tecnologica universitaria, politicas institucionales.

---

## 3. Marcos de Referencia y Fuentes Verificadas

El conocimiento del agente esta alimentado y validado a partir de la literatura academica del estado del arte:

1. **Marco DigCompEdu (Comision Europea):** Competencias digitales docentes divididas en compromiso profesional, recursos digitales, ensenanza-aprendizaje, evaluacion, empoderamiento del alumnado y facilitacion de la competencia digital de los estudiantes.
2. **Directrices de la UNESCO (2023-2024):** Guias para el uso etico de la IA generativa en la educacion superior y marcos de gobernanza del aprendizaje.
3. **Antecedentes Directos del Contexto Regional y Colombiano:**
   * Vanegas-Giraldo (2025): Analisis estructural de la brecha digital y la IA en Colombia.
   * Peinado Pineda & Diaz Salas (2023): Retos de la formacion docente universitaria en la Region Caribe colombiana.
   * Sanchez Vera (2024) y Tramallino & Zeni (2024): Usos pedagogicos, eticos y curriculares de la IA generativa en la formacion inicial.

---

## 4. Representacion del Conocimiento en el Sistema

El conocimiento se materializa en el codigo en tres estructuras:
* **`DEFAULT_GUIDES` (`src/lib/defaultGuides.ts`):** Guion semiestructurado con preguntas generadoras, pistas de profundizacion (`probingTips`) y enlaces explicitos a los objetivos de investigacion.
* **`THESIS_PROJECT_INFO` (`src/lib/thesisContext.ts`):** Contexto institucional exacto de la Universidad de Cordoba.
* **Ontologia de Extraccion (`/api/analyze-interview` en `server.ts`):** Esquema estructurado que clasifica citas textuales y aprendizajes dentro de las subcategorias cualitativas.
