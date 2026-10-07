DOCUMENTO 02 | MODELO DEL CONOCIMIENTO: CATEGORÍAS, SABERES Y MARCOS CURADOS

# DOCUMENTO — 02
# Modelo del Conocimiento: Categorías, Saberes y Marcos Curados

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática con Énfasis en Medios Audiovisuales |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Componente documentado** | Modelo del Conocimiento (Estructura de dominios expertos, ontología de categorías, marcos normativos y reglas de triangulación) |
| **Documento** | 02 — Modelo del Conocimiento (Versión 1.0) |

*Documento técnico para la especificación del dominio conceptual, categorías hermenéuticas y fundamentación epistemológica del agente.*

---

## 1. Identificación del proyecto
* **Título del proyecto:** La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba.
* **Investigadores:** José Daniel Durango Caballero y Jefersson Ramírez Oviedo.
* **Componente documentado:** Modelo del Conocimiento (Estructura de dominios expertos, bases conceptuales y reglas de decisión).

## 2. Propósito del modelo
Organizar y representar el conocimiento experto que el agente inteligente (**Maya**) necesita poseer, relacionar y contrastar para asistir de manera rigurosa en la conducción de entrevistas cualitativas y en la pre-categorización hermenéutica de las intervenciones docentes, integrando los marcos teóricos de la investigación (TPACK, DigCompEdu, directrices de la UNESCO y la ontología de categorías del informe de grado) bajo cinco dimensiones de pertinencia conceptual.

## 3. Dominio general del conocimiento
El conocimiento del agente se estructura en cinco grandes dominios interconectados:
1. **Dominio Pedagógico:** Teorías del aprendizaje, didáctica general y práctica reflexiva.
2. **Dominio Disciplinar y Contextual:** Plan de estudios de la Licenciatura en Informática con Énfasis en Medios Audiovisuales y realidad regional de la Universidad de Córdoba (Montería y sedes provinciales).
3. **Dominio Tecnológico:** Modelos de lenguaje extensos (LLMs), arquitecturas generativas multimodales y herramientas de software educativo.
4. **Dominio Tecnopedagógico:** Integración armónica entre tecnología, pedagogía y contenido disciplinar.
5. **Dominio Metodológico de Investigación Cualitativa:** Técnicas de entrevista semiestructurada, saturación teórica y triangulación hermenéutica.

## 4. Arquitectura o estructura del conocimiento
El conocimiento se organiza mediante dominios, subdominios, categorías cualitativas deductivas (Tabla 1 de la tesis), unidades de análisis, conceptos clave y criterios de decisión que permiten vincular los objetivos investigativos con las intervenciones del estudiante.

```text
[ Dominios Generales ]
       ├── 1. Dominio Pedagógico (Constructivismo, Práctica Reflexiva)
       ├── 2. Dominio Disciplinar/Contextual (UniCórdoba, Licenciatura en Informática)
       ├── 3. Dominio Tecnológico (LLMs, IA Multimodal, Algoritmos)
       ├── 4. Dominio Tecnopedagógico (TPACK, Mediación Didáctica)
       └── 5. Dominio Metodológico (Investigación Cualitativa, Probing, CAQDAS)
               │
               ▼
[ Ontología Deductiva de Categorías (Tabla 1 de la Tesis) ]
       ├── Categoría A: Inteligencia Artificial (IA)
       │       ├── Subcategoría A1: Gestión y mediación pedagógica
       │       └── Subcategoría A2: Dimensión ética y crítica
       ├── Categoría B: Formación Docente
       │       ├── Subcategoría B1: Articulación de saberes (Pedagógico, Tecnológico, Ético)
       │       └── Subcategoría B2: Práctica reflexiva e identidad profesional
       └── Categoría C: Efectos de la Inteligencia Artificial
               ├── Subcategoría C1: Impacto en la práctica profesional (Planeación y Creatividad)
               ├── Subcategoría C2: Retos y limitaciones formativas (Infraestructura y Currículo)
               └── Subcategoría C3: Propuesta de estrategias formativas
```

## 5. Dominio pedagógico
* Teorías del aprendizaje constructivista (Piaget, 1976), significativo (Ausubel, 1968) y sociocultural (Vygotsky, 1978).
* Paradigma del profesor reflexivo y metacognición en la acción educativa (Schön, 1983).
* Alineación constructiva y diseño curricular por competencias (Biggs & Tang, 2011).
* Estrategias de mediación docente, andamiaje pedagógico y transposición didáctica de contenidos computacionales.

## 6. Dominio disciplinar/contextual
* **Realidad institucional de la Universidad de Córdoba (Montería, Colombia):**
  * Población estudiantil de la Licenciatura en Informática con Énfasis en Medios Audiovisuales (~430 estudiantes activos).
  * Distribución formativa por semestres (1° a 10°) y áreas curriculares: ciencias de la computación, medios audiovisuales, pedagogía y práctica docente.
  * Contexto geográfico y presencia en centros de tutoría y sedes regionales (Montería, Lorica, Planeta Rica, Sahagún, Montelíbano).
  * Condiciones de infraestructura tecnológica, salas de informática, disponibilidad de conectividad y brechas digitales regionales del departamento de Córdoba.

## 7. Dominio tecnológico
* Inteligencia artificial generativa aplicada a la educación: límites probabilísticos, capacidades de síntesis discursiva, límites contextuales y mitigación de alucinaciones sintácticas y semánticas.
* Familias de modelos fundacionales (Google Gemini, OpenAI GPT, Anthropic Claude) y herramientas generativas de medios (Midjourney, DALL-E, Runway, herramientas de síntesis vocal).
* Entornos de desarrollo de código asistido (GitHub Copilot, v0, Cursor) y su incidencia en la enseñanza de la programación.
* Protocolos de privacidad de datos, tratamiento ético de la información y arquitectura de inferencia segura.

## 8. Dominio tecnopedagógico
* Criterios de articulación entre herramientas digitales y propósitos didácticos específicos.
* Condiciones de pertinencia para el uso de tecnologías emergentes en la formación docente inicial.
* Modelos de integración tecnológica progresiva (sustitución, aumento, modificación y redefinición).

## 9. TPACK (Technological Pedagogical Content Knowledge)
Dominio transversal propuesto por Mishra y Koehler (2006), basado en el conocimiento pedagógico del contenido de Shulman (1986). Articula el conocimiento del contenido disciplinar (CK - ciencias de la computación y medios audiovisuales), el conocimiento pedagógico (PK - didáctica, evaluación y metodologías) y el conocimiento tecnológico (TK - herramientas de software, hardware e IA). El agente utiliza este marco para determinar si el informante concibe la IA como un fin en sí misma o como un mediador didáctico contextualizado.

## 10. Marco DigCompEdu
Marco Europeo de Competencia Digital de los Educadores (Redecker, 2017). Estructura el dominio del agente en seis áreas fundamentales:
1. Compromiso profesional.
2. Contenidos digitales (creación, modificación y protección de derechos de autor).
3. Enseñanza y aprendizaje (orientación y aprendizaje colaborativo con mediación tecnológica).
4. Evaluación (retroalimentación formativa y analíticas del aprendizaje).
5. Empoderamiento de los estudiantes (accesibilidad, inclusión y personalización).
6. Desarrollo de la competencia digital de los alumnos escolares.

## 11. Inteligencia artificial educativa y directrices de la UNESCO
El agente incorpora las recomendaciones de la UNESCO (2023, 2024) sobre el uso ético y pedagógico de la IA generativa en la educación superior y la investigación:
* Preservación de la agencia humana y la autonomía intelectual frente a la automatización.
* Transparencia, auditabilidad y divulgación del uso de modelos generativos en tareas académicas.
* Equidad en el acceso, inclusión y prevención de brechas socioeconómicas y lingüísticas.
* Protección de la privacidad estudiantil y soberanía de los datos académicos.

## 12. Microlearning y metodologías activas
Enfoque metodológico centrado en la fragmentación de contenidos complejos en cápsulas de aprendizaje breves y altamente focalizadas. El agente conoce cómo los estudiantes de informática recurren a la IA para generar microcápsulas explicativas, retos de programación y simulaciones interactivas.

## 13. Aula invertida (Flipped Classroom) y mediación digital
Metodología activa donde la instrucción conceptual directa se traslada fuera del espacio sincrónico de clase mediante recursos multimedia o asistentes inteligentes, optimizando el tiempo presencial para el debate, la resolución de problemas y la experimentación en laboratorios.

## 14. Gamificación y narrativas audiovisuales
Estrategia de incorporación de dinámicas, mecánicas y estéticas de juego en entornos formativos para elevar la motivación intrínseca. En el contexto de la Licenciatura con Énfasis en Medios Audiovisuales, el agente identifica cómo la IA asiste en la redacción de guiones, prototipado de guiones gráficos (*storyboards*) y generación de elementos visuales interactivos.

## 15. Planificación pedagógica y diseño didáctico con IA
Estructuración de secuencias didácticas, unidades de aprendizaje, propósitos formativos, tiempos, recursos y criterios de evaluación. El agente contrasta si el estudiante emplea la IA para generar borradores de clase, adaptar niveles de dificultad o formular rúbricas analíticas según los estándares del Ministerio de Educación Nacional de Colombia.

## 16. Diseño y curaduría del guion semiestructurado
El guion maestro (`DEFAULT_GUIDES` en `src/lib/defaultGuides.ts`) define la columna vertebral de indagación hermenéutica a través de siete preguntas nucleares vinculadas a los objetivos de la investigación:
* **Q1 (A1 - Prácticas actuales):** Formas de incorporación de LLMs y generadores audiovisuales en la cotidianidad académica.
* **Q2 (A2 - Conciencia ética):** Precauciones frente a privacidad, autoría y sesgos algorítmicos.
* **Q3 (B1 - Articulación de saberes):** Integración curricular entre didáctica e informática vs. uso instrumental aislado.
* **Q4 (B2 - Práctica reflexiva):** Transformación de la identidad docente y pensamiento crítico.
* **Q5 (C1 - Impacto profesional):** Beneficios concretos en planeación didáctica y producción de medios.
* **Q6 (C2 - Limitaciones contextuales):** Brechas de conectividad, laboratorios y formación docente en la Universidad de Córdoba.
* **Q7 (C3 - Propuestas formativas):** Recomendaciones curriculares y políticas institucionales para el programa.

## 17. Extracción analítica y pre-codificación cualitativa
El modelo formaliza la lógica de categorización analítica implementada en el endpoint `/api/analyze-interview` (`server.ts`). El agente estructura las respuestas del informante en un esquema compatible con sistemas de análisis cualitativo asistido por computadora (CAQDAS), extrayendo citas textuales directas (*directQuotes*), necesidades detectadas (*painPointsOrNeeds*) y la subcategoría deductiva correspondiente.

## 18. Contextualización territorial y regional
El agente comprende la geografía humana y tecnológica del departamento de Córdoba:
* Reconoce la sede central de Montería y los centros tutoriales de los municipios (Lorica, Planeta Rica, Sahagún, Montelíbano).
* Entiende que la conectividad a internet en las áreas rurales y municipios aledaños presenta fluctuaciones e intermitencias severas.
* Valora las condiciones reales de las instituciones educativas públicas donde los docentes en formación realizan sus prácticas docentes de 7° a 10° semestre.

## 19. Reglas o criterios de pertinencia y triangulación
El agente evalúa cada intervención del informante cruzándola con cinco dimensiones clave:
* **Pertinencia temática:** ¿Se vincula el testimonio con las categorías declaradas de la investigación (IA, Formación Docente o Efectos)?
* **Coherencia conceptual:** ¿Demuestra el relato una articulación coherente entre la tecnología descrita y el propósito pedagógico expresado?
* **Validez hermenéutica:** ¿Refleja la experiencia genuina del estudiante o constituye una respuesta genérica aprendida?
* **No inducción de respuesta:** ¿Fue emitida la intervención sin sugerencias directivas por parte del agente?
* **Viabilidad contextual:** ¿Son verosímiles las prácticas descritas en relación con las condiciones de la Universidad de Córdoba y los colegios de la región?

## 20. Relaciones entre los dominios

```text
[ Contexto Regional y Curricular (UniCórdoba / Montería) ]
                         │
                         ▼
[ Dominio Pedagógico & TPACK ] ──> [ Marco DigCompEdu & UNESCO ]
                         │
                         ▼
[ Categorías Deductivas: IA (A) │ Formación (B) │ Efectos (C) ]
                         │
                         ▼
[ Guion Semiestructurado (Q1 - Q7) & Probing Hermenéutico ]
                         │
                         ▼
[ Extracción Estructurada & Triangulación Cualitativa (CAQDAS) ]
```

## 21. Síntesis del modelo
El Modelo del Conocimiento proporciona al agente inteligente una base conceptual y axiológica exhaustiva. Al entrelazar el marco TPACK, las directrices de la UNESCO, el modelo DigCompEdu y las categorías deductivas de la investigación de grado, garantiza que las interacciones del agente (**Maya**) posean rigor académico, eviten alucinaciones conceptuales y canalicen las voces de los docentes en formación hacia los objetivos del proyecto.

## 22. Referencias académicas utilizadas
* Ausubel, D. P. (1968). *Educational psychology: A cognitive view*. Holt, Rinehart and Winston.
* Biggs, J., & Tang, C. (2011). *Teaching for quality learning at university* (4th ed.). Open University Press.
* Mishra, P., & Koehler, M. J. (2006). Technological pedagogical content knowledge: A framework for teacher knowledge. *Teachers College Record*, 108(6), 1017–1054. https://doi.org/10.1111/j.1467-9620.2006.00684.x
* Peinado Pineda, O., & Díaz Salas, F. (2023). Desafíos de la formación docente universitaria en el Caribe colombiano: Tecnologías de la información e inclusión educativa. *Revista Educación y Humanismo*, 25(44), 112–131.
* Piaget, J. (1976). *Psicología y pedagogía*. Editorial Ariel.
* Redecker, C. (2017). *European framework for the digital competence of educators: DigCompEdu* (Y. Punie, Ed.). Publications Office of the European Union. https://doi.org/10.2760/159770
* Sánchez Vera, M. M. (2024). Inteligencia artificial en educación: Retos pedagógicos y éticos para la formación docente. *Revista Interuniversitaria de Investigación en Tecnología Educativa*, (16), 1–15. https://doi.org/10.6018/riite.598211
* Schön, D. A. (1983). *The reflective practitioner: How professionals think in action*. Basic Books.
* Shulman, L. S. (1986). Those who understand: Knowledge growth in teaching. *Educational Researcher*, 15(2), 4–14. https://doi.org/10.3102/0013189X015002004
* Siemens, G. (2005). Connectivism: A learning theory for the digital age. *International Journal of Instructional Technology and Distance Learning*, 2(1), 3–10.
* Tramallino, C. P., & Zeni, L. (2024). Percepciones y prácticas en torno a la inteligencia artificial generativa en la formación docente inicial. *Revista Electrónica de Investigación Educativa*, 26, e12. https://doi.org/10.24320/redie.2024.26.e12.5932
* UNESCO. (2023). *Guidance for generative AI in education and research*. UNESCO Publishing. https://unesdoc.unesco.org/ark:/48223/pf0000386693
* UNESCO. (2024). *AI competency framework for teachers*. UNESCO Publishing. https://unesdoc.unesco.org/ark:/48223/pf0000391104
* Vanegas-Giraldo, O. (2025). Brecha digital y mediación de inteligencias artificiales generativas en la educación superior en Colombia. *Revista Latinoamericana de Tecnología Educativa*, 24(1), 45–62.
* Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.
