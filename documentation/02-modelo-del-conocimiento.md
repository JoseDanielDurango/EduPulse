DOCUMENTO 02 | MODELO DEL CONOCIMIENTO: CATEGORÍAS, SABERES Y MARCOS CURADOS

# DOCUMENTO — 02
# Modelo del Conocimiento: Categorías, Saberes y Marcos Curados
### Ontología Epistemológica y Curricular de EduPulse · Versión 2.0

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Componente documentado** | Modelo del Conocimiento (Estructura de dominios expertos, ontología de categorías cualitativas y dimensiones cuantitativas, marcos normativos y reglas de triangulación) |
| **Documento** | 02 — Modelo del Conocimiento (Versión 2.0) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico para la especificación del dominio conceptual, categorías hermenéuticas, pilares epistemológicos y fundamentación mixta del agente.*

---

## 1. Identificación del proyecto
* **Título del proyecto:** La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba.
* **Investigadores:** José Daniel Durango Caballero y Jefersson Ramírez Oviedo.
* **Director del proyecto:** Juan Carlos Giraldo Cardozo.
* **Institución:** Universidad de Córdoba (Montería, Córdoba, Colombia).
* **Unidad académica:** Facultad de Educación y Ciencias Humanas, Departamento de Informática Educativa.
* **Programa:** Licenciatura en Informática.
* **Componente documentado:** Modelo del Conocimiento (Estructura de dominios expertos, bases conceptuales y reglas de decisión).

## 2. Propósito del modelo
Organizar y representar el conocimiento experto que la agente inteligente (**Cereza**) necesita poseer, relacionar y contrastar para asistir de manera rigurosa en la conducción de entrevistas cualitativas, en el análisis de instrumentos diagnósticos y en la pre-categorización hermenéutica de las intervenciones docentes, integrando los marcos teóricos de la investigación (TPACK, DigCompEdu, directrices de la UNESCO, Ley de Educación Digital 2626 de 2026, teoría del efecto muleta y autoeficacia docente) bajo cinco dimensiones de pertinencia conceptual.

## 3. Dominio general del conocimiento
El conocimiento del agente se estructura en cinco grandes dominios interconectados:
1. **Dominio Pedagógico y Curricular:** Teorías del aprendizaje, didáctica de la informática, práctica reflexiva y fases de rediseño curricular (Exploración, Integración, Innovación).
2. **Dominio Disciplinar y Contextual:** Plan de estudios de la Licenciatura en Informática y realidad regional de la Universidad de Córdoba (Montería y sedes provinciales: Lorica, Planeta Rica, Sahagún, Montelíbano).
3. **Dominio Tecnológico:** Modelos de lenguaje extensos (LLMs), arquitecturas generativas multimodales, herramientas de software educativo y entornos de programación.
4. **Dominio Tecnopedagógico:** Integración armónica entre tecnología, pedagogía y contenido disciplinar (TPACK).
5. **Dominio Metodológico Mixto:** Técnicas de entrevista semiestructurada socrática, saturación cualitativa, psicometría diagnóstica (Escala Likert) y triangulación hermenéutica-estadística.

## 4. Cinco Pilares Teóricos Centrales del Modelo
El motor de razonamiento de Cereza (`server.ts`) fundamenta cada una de sus intervenciones en cinco principios teóricos irrenunciables:

1. **"Inteligencia Humana Aumentada":** La IA se concibe como un aliado cognitivo y mediador didáctico, jamás como un sustituto del juicio crítico, la sensibilidad ética y la transposición pedagógica humana del educador.
2. **"El Efecto Muleta" (*The Crutch Effect*, Bastani et al., 2024):** Alerta empírica sobre el riesgo de que el uso indiscriminado de asistentes generativos deprima la capacidad de resolución autónoma de problemas y el pensamiento crítico a largo plazo (-17% de rendimiento autónomo sin la herramienta).
3. **Autoeficacia Docente (Bandura, 1997; Tschannen-Moran & Woolfolk Hoy, 2001):** Grado de confianza y preparación práctica del futuro licenciado para planificar, mediar y evaluar experiencias de aprendizaje asistidas por IA.
4. **Transición Curricular y Ley 2626 de 2026:** Marco normativo de la "Ley de Educación Digital" en Colombia, que estructura el modelo pedagógico universitario en tres fases evolutivas (Exploración, Integración e Innovación) en ambientes presenciales, híbridos y virtuales.
5. **Coaprendizaje y Realidad Contextual:** Co-construcción de saberes entre docentes, estudiantes y tecnología, reconociendo las tensiones de conectividad e infraestructura en Montería y los centros de tutoría municipales de Córdoba.

## 5. Arquitectura u Ontología de Categorías Cualitativas y Dimensiones Cuantitativas

```text
[ Dominios Generales del Sistema ]
       ├── 1. Dominio Pedagógico (Constructivismo, Schön, Biggs)
       ├── 2. Dominio Disciplinar/Contextual (UniCórdoba, Licenciatura en Informática)
       ├── 3. Dominio Tecnológico (LLMs, Google Gemini, Generación Multimodal)
       ├── 4. Dominio Tecnopedagógico (TPACK, DigCompEdu, UNESCO)
       └── 5. Dominio Metodológico (Investigación Mixta, Saturación, Triangulación)
               │
               ▼
[ Ontología Deductiva de Categorías Cualitativas (Tabla 1 de la Tesis) ]
       ├── Categoría A: Inteligencia Artificial (IA)
       │       ├── Subcategoría A1: Gestión y mediación pedagógica
       │       └── Subcategoría A2: Dimensión ética y crítica (prevención del efecto muleta)
       ├── Categoría B: Formación Docente
       │       ├── Subcategoría B1: Articulación de saberes (Pedagógico, Tecnológico, Ético)
       │       └── Subcategoría B2: Práctica reflexiva, autoeficacia e identidad profesional
       └── Categoría C: Efectos de la Inteligencia Artificial
               ├── Subcategoría C1: Impacto en la práctica profesional (Planeación y Creatividad)
               ├── Subcategoría C2: Retos y limitaciones formativas (Infraestructura y Conectividad)
               └── Subcategoría C3: Propuesta de estrategias formativas y transición curricular
               │
               ▼
[ Articulación con Dimensiones Cuantitativas (Documento 07) ]
       ├── Instrumento 1: Percepciones y Usos (D1 Uso, D2 Utilidad, D3 Competencia, D4 Ética)
       └── Instrumento 2: Autoeficacia Didáctica (D1 Planeación, D2 Mediación, D3 Autonomía, D4 Ley 2626)
```

## 6. Dominio pedagógico
* Teorías del aprendizaje constructivista (Piaget, 1976), significativo (Ausubel, 1968) y sociocultural (Vygotsky, 1978).
* Paradigma del profesor reflexivo y metacognición en la acción educativa (Schön, 1983).
* Alineación constructiva y diseño curricular por competencias (Biggs & Tang, 2011).
* Estrategias de mediación docente, andamiaje pedagógico y transposición didáctica de contenidos computacionales.

## 7. Dominio disciplinar y contextual
* **Realidad institucional de la Universidad de Córdoba (Montería, Colombia):**
  * Población estudiantil de la Licenciatura en Informática (~430 estudiantes activos).
  * Distribución formativa por semestres (1° a 10°) y áreas curriculares: ciencias de la computación, medios audiovisuales, pedagogía y práctica docente.
  * Contexto geográfico y presencia en centros de tutoría y sedes regionales (Montería, Lorica, Planeta Rica, Sahagún, Montelíbano).
  * Condiciones de infraestructura tecnológica, salas de cómputo, disponibilidad de ancho de banda y brechas digitales regionales del departamento de Córdoba.

## 8. Dominio tecnológico
* Inteligencia artificial generativa aplicada a la educación: arquitectura Transformer, ventanas contextuales, límites probabilísticos y mitigación de alucinaciones.
* Familias de modelos fundacionales: Google Gemini (arquitectura de cascada `gemini-3.5-flash-lite`, `gemini-3.5-flash`), Claude y GPT.
* Herramientas de generación multimodal (texto, imagen, video, síntesis de voz con Web Speech API) y entornos de desarrollo asistido (GitHub Copilot, Cursor).
* Protocolos de privacidad de datos, anonimización PII y gobernanza algorítmica.

## 9. Dominio tecnopedagógico: Marco TPACK
Dominio propuesto por Mishra y Koehler (2006), basado en Shulman (1986). Articula el conocimiento del contenido disciplinar (CK - informática y algoritmos), el conocimiento pedagógico (PK - didáctica, evaluación y metodologías) y el conocimiento tecnológico (TK - software e IA). Cereza emplea este marco para evaluar si el informante concibe la IA como un artefacto instrumental aislado o como un catalizador de transformación didáctica.

## 10. Marco DigCompEdu y Directrices de la UNESCO
* **Marco DigCompEdu (Redecker, 2017):** Compromiso profesional, contenidos digitales, enseñanza-aprendizaje, evaluación formativa, empoderamiento de estudiantes y desarrollo de la competencia digital.
* **Directrices de la UNESCO (2023, 2024):** Preservación de la agencia humana, transparencia en la atribución del uso de modelos generativos, equidad en el acceso y protección de la privacidad estudiantil.

## 11. Cuatro Dimensiones Cualitativas Orgánicas de Indagación
En lugar de una secuencia rígida de preguntas, el Modelo del Conocimiento guía la conversación de Cereza por cuatro dimensiones orgánicas:
1. **Dimensión 1: Prácticas cotidianas y autoeficacia en la planificación didáctica:** Uso de ChatGPT, Claude, generadores de medios, diseño de unidades didácticas y microclases.
2. **Dimensión 2: Dimensión ética, autonomía cognitiva y prevención del "efecto muleta":** Atribución autoral, honestidad académica, sesgos algorítmicos y preservación del pensamiento crítico autónomo.
3. **Dimensión 3: Transición curricular hacia ambientes híbridos y retos contextuales:** Desafíos de conectividad e infraestructura en Córdoba, y apropiación de las directrices de la Ley 2626 de 2026.
4. **Dimensión 4: Coaprendizaje y propuestas curriculares:** Iniciativas estudiantiles para reformar el plan de estudios, crear semilleros de IA y fortalecer las prácticas pedagógicas en las escuelas.

## 12. Extracción analítica y pre-codificación cualitativa
El modelo formaliza la lógica implementada en el backend (`server.ts` y `/api/analyze-interview`):
* Extrae citas textuales directas categorizadas según la ontología deductiva (IA, Formación Docente, Efectos).
* Detecta tensiones y necesidades formativas prioritarias (*pain points*).
* Exporta información estructurada para su triangulación directa en herramientas CAQDAS (ATLAS.ti y NVivo) y matrices en Google Sheets.

## 13. Reglas de pertinencia y triangulación mixta
El agente cruza los testimonios con las métricas cuantitativas descritas en el Documento 07:
* **Convergencia metodológica:** Si los informantes manifiestan alta autoeficacia en los cuestionarios cuantitativos, Cereza comprueba si en el diálogo cualitativo son capaces de describir secuencias didácticas concretas o si se limitan a un uso instrumental básico.
* **Tolerancia a la discrepancia:** Identifica contrastes entre lo que los informantes declaran saber y sus prácticas reales en el aula escolar.

## 14. Relaciones entre los dominios

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
[ Diálogo Socrático Orgánico con Cereza (Dimensiones 1 - 4) ]
                         │
                         ▼
[ Extracción Estructurada & Triangulación Mixta con Documento 07 ]
```

## 15. Síntesis del modelo
El Modelo del Conocimiento de EduPulse proporciona una base epistemológica robusta que unifica los marcos pedagógicos consolidados (TPACK, DigCompEdu) con los desarrollos contemporáneos de la inteligencia artificial y las directrices normativas colombianas (Ley 2626 de 2026), guiando tanto la recolección cualitativa socrática como el diagnóstico cuantitativo del proyecto de grado.

## 16. Referencias académicas utilizadas
* Ausubel, D. P. (1968). *Educational psychology: A cognitive view*. Holt, Rinehart and Winston.
* Bandura, A. (1997). *Self-efficacy: The exercise of control*. W. H. Freeman and Company.
* Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, H., & Mariman, R. (2024). Generative AI can harm learning: Evidence from high school mathematics. *SSRN Electronic Journal*. https://doi.org/10.2139/ssrn.4895486
* Biggs, J., & Tang, C. (2011). *Teaching for quality learning at university* (4th ed.). Open University Press.
* Congreso de la República de Colombia. (2026). *Ley No. 2626 del 24 de agosto de 2026, por medio de la cual se expide la Ley de Educación Digital en Colombia*. Diario Oficial No. 53.489.
* Mishra, P., & Koehler, M. J. (2006). Technological pedagogical content knowledge: A framework for teacher knowledge. *Teachers College Record*, 108(6), 1017–1054. https://doi.org/10.1111/j.1467-9620.2006.00684.x
* Piaget, J. (1976). *Psicología y pedagogía*. Editorial Ariel.
* Redecker, C. (2017). *European framework for the digital competence of educators: DigCompEdu*. Publications Office of the European Union. https://doi.org/10.2760/159770
* Schön, D. A. (1983). *The reflective practitioner: How professionals think in action*. Basic Books.
* Shulman, L. S. (1986). Those who understand: Knowledge growth in teaching. *Educational Researcher*, 15(2), 4–14. https://doi.org/10.3102/0013189X015002004
* Tschannen-Moran, M., & Woolfolk Hoy, A. (2001). Teacher efficacy: Capturing an elusive construct. *Teaching and Teacher Education*, 17(7), 783–805. https://doi.org/10.1016/S0742-051X(01)00036-1
* UNESCO. (2023). *Guidance for generative AI in education and research*. UNESCO Publishing.
* UNESCO. (2024). *AI competency framework for teachers*. UNESCO Publishing.
* Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.
