DOCUMENTO 07 | INSTRUMENTOS CUANTITATIVOS DE DIAGNÓSTICO Y TRIANGULACIÓN MIXTA

# DOCUMENTO — 07
# Instrumentos Cuantitativos de Diagnóstico y Triangulación Mixta
### Plataforma EduPulse · Enfoque Metodológico Multimétodo

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Componente documentado** | Instrumentos cuantitativos (Cuestionarios estructurados en escala Likert, persistencia en Firestore, visualizador estadístico y protocolo de triangulación hermenéutica-estadística) |
| **Documento** | 07 — Instrumentos y Triangulación (Versión 1.0) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico-metodológico para la especificación de los cuestionarios diagnósticos, análisis psicométrico descriptivo y convergencia metodológica en la investigación mixta.*

---

## 1. Identificación y Fundamentación Epistemológica del Enfoque Mixto

### 1.1 Identificación Institucional
* **Título del proyecto:** La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba.
* **Investigadores principales:** José Daniel Durango Caballero y Jefersson Ramírez Oviedo.
* **Director de investigación:** Juan Carlos Giraldo Cardozo.
* **Institución:** Universidad de Córdoba (Montería, Colombia).
* **Unidad académica:** Facultad de Educación y Ciencias Humanas · Licenciatura en Informática.
* **Línea de investigación:** Estudio de impacto de las tecnologías de la información y comunicación en educación · Sublínea: Evaluación educativa y TIC.

### 1.2 Justificación Metodológica del Diseño Mixto Concurrente
La investigación adopta un diseño mixto de triangulación concurrente (**QUAN + QUAL**), fundamentado epistemológicamente en los postulados de Creswell y Creswell (2018), Denzin (2012) y Hernández-Sampieri et al. (2014). Si bien el núcleo central de EduPulse reside en la recolección cualitativa en profundidad mediada por la agente inteligente **Cereza**, la incorporación sistemática de instrumentos cuantitativos responde a tres imperativos científicos:

1. **Validez Convergente y Robustez:** Contrastar las tendencias estadísticas globales de autoeficacia y apropiación con las narrativas biográficas y reflexivas expresadas en los turnos de diálogo.
2. **Mitigación del Sesgo de Deseabilidad Social:** Permitir que los docentes en formación manifiesten sus percepciones de manera individual y estandarizada antes o después de la entrevista interactiva.
3. **Mapeo Diagnóstico Inicial:** Establecer una línea base descriptiva sobre el uso real, la familiaridad y los dilemas éticos que permean la cotidianidad académica en los distintos semestres del plan de estudios.

```text
+───────────────────────────────────────────────────────────────────────────+
|               DISEÑO MIXTO DE TRIANGULACIÓN CONCURRENTE                   |
+───────────────────────────────────────────────────────────────────────────+
                     │                                   │
                     ▼                                   ▼
    [ FASE CUANTITATIVA (QUAN) ]        [ FASE CUALITATIVA (QUAL) ]
     Instrumentos 1 y 2 (Likert 1-5)      Entrevistas socráticas con Cereza
     Muestra diagnóstica de informantes   Diálogo hermenéutico en profundidad
     Cloud Firestore: instrument_responses Cloud Firestore: sessions
                     │                                   │
                     ▼                                   ▼
          Estadística Descriptiva              Pre-codificación Temática
          (Media x̄, Desviación σ)              (Citas textuales categorizadas)
                     │                                   │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     [ MATRIZ DE TRIANGULACIÓN MIXTA ]
                      Capítulos 4 y 5 del Informe de Grado
                      Convergencia, complementariedad y tensión
```

---

## 2. Especificación del Instrumento 1: Cuestionario Diagnóstico sobre Percepciones, Usos y Apropiación de la IA

### 2.1 Ficha Técnica del Instrumento 1
* **Nombre:** Cuestionario de Percepciones y Usos de Herramientas de Inteligencia Artificial en Educación.
* **Población objetivo:** Estudiantes de 1° a 10° semestre de la Licenciatura en Informática.
* **Tipo de escala:** Escala Likert de 5 puntos (1 = Totalmente en desacuerdo / Nunca; 2 = En desacuerdo / Rara vez; 3 = Neutral / A veces; 4 = De acuerdo / Frecuentemente; 5 = Totalmente de acuerdo / Siempre).
* **Número de reactivos:** 16 ítems organizados en 4 dimensiones teóricas.
* **Modalidad de aplicación:** Auto-administrado vía web a través de la vista `InstrumentForm.tsx` en EduPulse.

### 2.2 Tabla de Dimensiones e Ítems del Instrumento 1

| Dimensión | Código | Enunciado del Reactivo (Ítem) | Opciones de Escala | Fundamentación Teórica |
| :--- | :--- | :--- | :--- | :--- |
| **D1: Frecuencia y Familiaridad de Uso** | `d1_p1` | Utilizo herramientas de IA generativa (ChatGPT, Claude, Gemini u otras) para apoyar el desarrollo de mis actividades académicas. | 1 (Nunca) a 5 (Siempre) | Apropiación tecnológica cotidiana (UNESCO, 2023). |
| | `d1_p2` | He explorado herramientas de IA especializadas en generación de imágenes, audio, video o código para proyectos universitarios. | 1 (Nunca) a 5 (Siempre) | Competencia digital multimodal (Rediseño Curricular). |
| | `d1_p3` | Recurro a la IA como primera opción cuando necesito comprender un concepto abstracto o resolver dudas de programación. | 1 (Nunca) a 5 (Siempre) | Efecto muleta vs. mediación (Bastani et al., 2024). |
| | `d1_p4` | Dedico tiempo a probar nuevas plataformas o asistentes inteligentes fuera de los requerimientos explícitos de mis clases. | 1 (Nunca) a 5 (Siempre) | Autoaprendizaje y curiosidad epistémica. |
| **D2: Utilidad Percibida en Aprendizaje** | `d2_p1` | Considero que la IA facilita la estructuración y organización de mis trabajos y proyectos formativos. | 1 (Desacuerdo) a 5 (De acuerdo) | Modelo TAM (Davis, 1989; Venkatesh et al., 2003). |
| | `d2_p2` | La IA me permite optimizar el tiempo dedicado a tareas mecánicas o repetitivas de estudio. | 1 (Desacuerdo) a 5 (De acuerdo) | Eficiencia cognitiva y productividad académica. |
| | `d2_p3` | Siento que mi comprensión conceptual de las materias mejora cuando dialogo interactivamente con un asistente inteligente. | 1 (Desacuerdo) a 5 (De acuerdo) | Aprendizaje dialógico mediado por IA. |
| | `d2_p4` | El uso de la IA estimula mi creatividad al plantearme enfoques o perspectivas que no había contemplado previamente. | 1 (Desacuerdo) a 5 (De acuerdo) | Inteligencia Humana Aumentada e ideación. |
| **D3: Competencia y Autoeficacia Digital** | `d3_p1` | Me siento capacitado/a para diseñar instrucciones (prompts) precisas que obtengan resultados pedagógicamente útiles. | 1 (Desacuerdo) a 5 (De acuerdo) | Ingeniería de prompts y autoeficacia (Bandura, 1997). |
| | `d3_p2` | Sé identificar cuándo una respuesta generada por una IA contiene alucinaciones, inexactitudes o sesgos conceptuales. | 1 (Desacuerdo) a 5 (De acuerdo) | Criterio epistemológico y verificación crítica. |
| | `d3_p3` | Considero que cuento con las habilidades necesarias para integrar herramientas de IA en secuencias didácticas escolares. | 1 (Desacuerdo) a 5 (De acuerdo) | Marco TPACK (Mishra & Koehler, 2006). |
| | `d3_p4` | Conozco los fundamentos técnicos básicos (algoritmos, entrenamiento, datos) sobre cómo operan estos modelos. | 1 (Desacuerdo) a 5 (De acuerdo) | Alfabetización en IA (UNESCO, 2024). |
| **D4: Conciencia Ética y Criterio Crítico** | `d4_p1` | Declaro de manera transparente el uso de IA cuando presento informes, códigos o tareas en la universidad. | 1 (Nunca) a 5 (Siempre) | Honestidad académica y atribución autoral. |
| | `d4_p2` | Me preocupa que el uso excesivo de IA debilite mi capacidad autónoma para redactar y resolver problemas sin ayuda tecnológica. | 1 (Desacuerdo) a 5 (De acuerdo) | Dependencia cognitiva y prevención del efecto muleta. |
| | `d4_p3` | Verifico la privacidad y los términos de uso antes de compartir información sensible o archivos personales en plataformas de IA. | 1 (Nunca) a 5 (Siempre) | Protección de datos y seguridad digital (Ley 1581). |
| | `d4_p4` | Considero indispensable que la Licenciatura incluya asignaturas obligatorias sobre el uso ético y crítico de la IA en la docencia. | 1 (Desacuerdo) a 5 (De acuerdo) | Prospectiva curricular y Ley 2626 de 2026. |

---

## 3. Especificación del Instrumento 2: Escala de Autoeficacia y Prácticas Pedagógicas con IA

### 3.1 Ficha Técnica del Instrumento 2
* **Nombre:** Escala de Autoeficacia en Prácticas Didácticas y Mediación Pedagógica con Inteligencia Artificial.
* **Población objetivo:** Docentes en formación cursando asignaturas de didáctica, práctica pedagógica investigativa o semestres intermedios/avanzados (4° a 10°).
* **Tipo de escala:** Escala Likert de 5 puntos (1 = Totalmente incapaz / Muy bajo; 2 = Poco capaz / Bajo; 3 = Medianamente capaz / Moderado; 4 = Bastante capaz / Alto; 5 = Completamente seguro / Muy alto).
* **Número de reactivos:** 16 ítems agrupados en 4 dimensiones formativas.
* **Constructo subyacente:** Autoeficacia docente percibida (Bandura, 1997; Tschannen-Moran & Woolfolk Hoy, 2001) aplicada a la mediación de tecnologías inteligentes en el aula de informática.

### 3.2 Tabla de Dimensiones e Ítems del Instrumento 2

| Dimensión | Código | Enunciado del Reactivo (Ítem) | Enfoque Pedagógico |
| :--- | :--- | :--- | :--- |
| **D1: Planificación Didáctica y Recursos** | `d1_auto_p1` | Qué tan seguro/a te sientes de planificar una unidad didáctica integrando herramientas de IA para enriquecer los contenidos. | Diseño instruccional tecnopedagógico. |
| | `d1_auto_p2` | Qué tan capaz te consideras de crear recursos educativos multimedia interactivos con apoyo de IA adaptados a tu contexto. | Creación mediática y transposición didáctica. |
| | `d1_auto_p3` | Qué tan preparado/a estás para seleccionar la herramienta de IA más apropiada según el objetivo de aprendizaje planteado. | Criterio curricular del marco TPACK. |
| | `d1_auto_p4` | Qué tan seguro/a te sientes de diseñar actividades que fomenten el aprendizaje activo utilizando la IA como aliada. | Metodologías activas y coaprendizaje. |
| **D2: Mediación y Evaluación del Aprendizaje** | `d2_auto_p1` | Qué tan seguro/a te sientes de guiar a tus estudiantes de colegio en el uso responsable de asistentes inteligentes en clase. | Mediación docente directa en el aula. |
| | `d2_auto_p2` | Qué tan capaz te consideras de diseñar instrumentos de evaluación auténtica que no sean fácilmente resueltos por una IA. | Evaluación auténtica y metacognición. |
| | `d2_auto_p3` | Qué tan preparado/a estás para ofrecer retroalimentación cualitativa apoyándote en herramientas de análisis automatizado. | Formative assessment y feedback docente. |
| | `d2_auto_p4` | Qué tan seguro/a te sientes de moderar debates en clase sobre los límites y alcances de la inteligencia artificial. | Desarrollo del pensamiento crítico en educandos. |
| **D3: Autonomía Cognitiva y Prevención del Efecto Muleta** | `d3_auto_p1` | Qué tan seguro/a te sientes de mantener tu autonomía intelectual cuando utilizas IA para preparar tus clases. | Agencia docente y soberanía pedagógica. |
| | `d3_auto_p2` | Qué tan preparado/a estás para detectar cuándo un estudiante ha utilizado IA como sustituto del esfuerzo reflexivo. | Diagnóstico del "efecto muleta" en el aula. |
| | `d3_auto_p3` | Qué tan capaz te consideras de promover estrategias didácticas que exijan al estudiante pensar antes de consultar la máquina. | Andamiaje previo a la consulta tecnológica. |
| | `d3_auto_p4` | Qué tan seguro/a te sientes de formular problemas abiertos y contextualizados que desafíen la automatización algorítmica. | Diseño de situaciones problema complejas. |
| **D4: Transición Curricular y Contexto Regional** | `d4_auto_p1` | Qué tan preparado/a te sientes para liderar procesos de educación digital e híbrida en el marco de la Ley 2626 de 2026. | Políticas educativas nacionales de digitalización. |
| | `d4_auto_p2` | Qué tan capaz te consideras de adaptar el uso pedagógico de la IA en instituciones educativas con conectividad precaria. | Resiliencia contextual y brecha digital en Córdoba. |
| | `d4_auto_p3` | Qué tan seguro/a te sientes de trabajar colaborativamente con otros docentes para co-construir saberes sobre IA. | Comunidades de práctica docente. |
| | `d4_auto_p4` | Qué tan motivado/a y capacitado/a estás para actualizar continuamente tus saberes ante la rápida evolución de la IA. | Aprendizaje a lo largo de la vida y desarrollo profesional. |

---

## 4. Persistencia, Resiliencia Offline y Estructura en Cloud Firestore

### 4.1 Mecanismo de Guardado Automático de Borradores (`localStorage`)
Reconociendo las condiciones materiales de conectividad intermitente en las salas universitarias y hogares de los informantes (Documento 04), el componente `InstrumentForm.tsx` implementa un sistema reactivo de tolerancia a fallos:
* **Autosave por evento:** Cada selección de opción en la escala Likert se persiste inmediatamente en el almacenamiento local del navegador bajo la clave `edupulse_instrument_draft_${instrumentId}_${userEmail}`.
* **Restauración transparente:** Si el informante sufre un corte eléctrico, cierre accidental de pestaña o refresca la página, el formulario recupera íntegramente las respuestas previas, desplegando una notificación visual de recuperación.
* **Limpieza post-sincronización:** Una vez que la transacción es confirmada con éxito por Cloud Firestore, el borrador temporal se purga automáticamente.

### 4.2 Modelo de Datos en Cloud Firestore (`instrument_responses`)
Las respuestas son almacenadas en la colección raíz `instrument_responses` de Firebase Firestore con la siguiente estructura de documento JSON:

```json
{
  "id": "auto_generated_firestore_doc_id",
  "instrumentId": "instrument_1_perceptions",
  "instrumentTitle": "Percepciones y Usos de la Inteligencia Artificial",
  "studentCode": "E04",
  "participantName": "Docente en Formación 04",
  "semester": "6° Semestre",
  "centerLocation": "Sede Central Montería",
  "consent": true,
  "submittedAt": "2026-11-10T21:15:30.450Z",
  "responses": {
    "d1_p1": 5,
    "d1_p2": 4,
    "d1_p3": 3,
    "d1_p4": 4,
    "d2_p1": 5,
    "d2_p2": 4,
    "d2_p3": 4,
    "d2_p4": 5,
    "d3_p1": 4,
    "d3_p2": 3,
    "d3_p3": 4,
    "d3_p4": 3,
    "d4_p1": 4,
    "d4_p2": 5,
    "d4_p3": 3,
    "d4_p4": 5
  },
  "dimensionScores": {
    "D1_Frecuencia": 4.0,
    "D2_Utilidad": 4.5,
    "D3_Autoeficacia": 3.5,
    "D4_Etica": 4.25
  },
  "globalMean": 4.06
}
```

---

## 5. Módulo de Visualización y Análisis Estadístico (`InstrumentResponsesViewer.tsx`)

### 5.1 Arquitectura del Visor para Investigadores
Ubicado en el portal protegido de administración e investigación (`AdminAuthModal`), el componente `InstrumentResponsesViewer.tsx` proporciona un motor de cálculo descriptivo en tiempo real sin requerir exportaciones intermedias. Sus capacidades analíticas abarcan:

1. **Agregación Dinámica de Muestra:** Filtrado en tiempo real por instrumento (Percepciones vs. Autoeficacia), por etapa formativa (Semestres 1°-3°, 4°-6°, 7°-10°) y por sede institucional (Montería, Lorica, Planeta Rica).
2. **Medidas de Tendencia Central y Dispersión:**
   * **Media aritmética por reactivo ($\bar{x}_i$):**
     $$\bar{x}_i = \frac{1}{N} \sum_{k=1}^{N} R_{k,i}$$
   * **Desviación estándar ($\sigma_i$):** Mide la dispersión u homogeneidad de criterio entre los participantes:
     $$\sigma_i = \sqrt{\frac{1}{N - 1} \sum_{k=1}^{N} (R_{k,i} - \bar{x}_i)^2}$$
   * **Puntaje medio consolidado por dimensión ($\bar{D}_j$):** Permite comparar rápidamente qué áreas presentan mayor fortaleza o vacíos pedagógicos.
3. **Distribución Porcentual de Respuestas:** Visualización mediante barras de distribución segmentadas que representan el porcentaje de participantes en cada nivel de la escala Likert (1 a 5).
4. **Exportación Estructurada:** Generación instantánea de archivos tabulares (.CSV) compatibles con SPSS, R, Python (Pandas) y Google Sheets.

---

## 6. Protocolo de Triangulación Concurrente (Hermenéutica-Estadística)

### 6.1 Matriz de Convergencia Metodológica
Para garantizar la validez de constructo en los Capítulos 4 y 5 del informe de grado, los hallazgos cuantitativos se cruzan directamente con los testimonios discursivos recolectados por **Cereza**:

| Dimensión Cuantitativa | Indicador Estadístico Esperado | Foco Cualitativo en Diálogo con Cereza | Evidencia Triangulada en la Tesis |
| :--- | :--- | :--- | :--- |
| **D1: Uso y Frecuencia** | Alta media en `d1_p1` ($\bar{x} > 4.2$) y moderada en `d1_p2` ($\bar{x} \approx 3.1$). | Narrativas sobre herramientas concretas utilizadas en materias de programación o diseño multimedia. | Corrobora si la adopción es predominantemente textual (ChatGPT) o multimodal (generadores de video/código). |
| **D2: Autoeficacia y Didáctica** | Variación marcada entre etapas formativas: baja en semestres 1°-3° ($\bar{x} \approx 2.5$) y alta en 7°-10° ($\bar{x} > 4.0$). | Reflexiones sobre transposición didáctica en microclases y prácticas docentes en colegios de Montería. | Demuestra la maduración curricular del futuro licenciado a lo largo del plan de estudios. |
| **D3: Criterio Ético y Autonomía** | Media alta en inquietud sobre el "efecto muleta" en `d4_p2` ($\bar{x} > 4.1$). | Confesiones o dilemas compartidos ante las preguntas desafiantes de Cereza sobre dependencia cognitiva. | Evidencia la tensión viva entre la agilidad operativa que brinda la IA y el temor a perder habilidades críticas. |
| **D4: Transición Curricular (Ley 2626)** | Amplio consenso en la necesidad de formación institucional explícita en `d4_p4` ($\bar{x} > 4.6$). | Propuestas estudiantiles sobre reformas al plan de estudios y talleres pedagógicos obligatorios. | Fundamenta las recomendaciones curriculares y la propuesta formativa final de la investigación. |

### 6.2 Ejemplo de Triangulación Hermenéutica Aplicada
> **Hallazgo Cuantitativo:**  
> En el Instrumento 1, el ítem `d4_p2` (*"Me preocupa que el uso excesivo de IA debilite mi capacidad autónoma para redactar y resolver problemas sin ayuda tecnológica"*) obtuvo una media de $\bar{x} = 4.38$ con una desviación estándar $\sigma = 0.72$, evidenciando una notable conciencia del riesgo cognitivo.
>
> **Convergencia Cualitativa (Cereza con Informante E08, 7° Semestre):**  
> *Cereza:* *"Una jugada hábil, colega... pero cuéntame con honestidad: al preparar esa guía, ¿sentiste que la IA enriqueció tu propuesta o que terminó pensando por ti?"*  
> *Informante E08:* *"La verdad a veces asusta. Si no tengo cuidado, le pido a ChatGPT que redacte todo el taller y luego en el aula me siento inseguro porque no dominé la lógica interna del ejercicio. Se convierte en una muleta si uno no se pone límites."*  
>
> **Interpretación Hermenéutica Integrada:**  
> La alta media cuantitativa no es una cifra abstracta; se traduce en una vivencia cotidiana de vigilancia epistemológica donde el futuro educador experimenta la tensión documentada por Bastani et al. (2024), reafirmando la urgencia de fortalecer la mediación pedagógica crítica.

---

## 7. Referencias Académicas Utilizadas
* Bandura, A. (1997). *Self-efficacy: The exercise of control*. W. H. Freeman and Company.
* Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, H., & Mariman, R. (2024). Generative AI can harm learning: Evidence from high school mathematics. *Social Science Research Network (SSRN)*. https://doi.org/10.2139/ssrn.4895486
* Creswell, J. W., & Creswell, J. D. (2018). *Research design: Qualitative, quantitative, and mixed methods approaches* (5th ed.). SAGE Publications.
* Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. *MIS Quarterly*, 13(3), 319–340. https://doi.org/10.2307/249008
* Denzin, N. K. (2012). Triangulation 2.0. *Journal of Mixed Methods Research*, 6(2), 80–88. https://doi.org/10.1177/1558689812437186
* Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014). *Metodología de la investigación* (6.ª ed.). McGraw-Hill Education.
* Mishra, P., & Koehler, M. J. (2006). Technological pedagogical content knowledge: A framework for teacher knowledge. *Teachers College Record*, 108(6), 1017–1054. https://doi.org/10.1111/j.1467-9620.2006.00684.x
* Tschannen-Moran, M., & Woolfolk Hoy, A. (2001). Teacher efficacy: Capturing an elusive construct. *Teaching and Teacher Education*, 17(7), 783–805. https://doi.org/10.1016/S0742-051X(01)00036-1
* UNESCO. (2023). *Guía para el uso de IA generativa en educación e investigación*. Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura.
