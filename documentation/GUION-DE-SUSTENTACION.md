# Guion y Estructura de Sustentación Final · EduPulse v2.3
### Presentación de Trabajo de Grado · Universidad de Córdoba · Licenciatura en Informática

| Campo | Detalle |
| :--- | :--- |
| **Título de la Tesis** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Sustentantes (Autores)** | José Daniel Durango Caballero & Jefersson Ramírez Oviedo |
| **Director de Tesis** | Mag. Juan Carlos Giraldo Cardozo |
| **Archivo de Presentación** | `EduPulse_Sustentacion_Final.pptx` (14 diapositivas en formato panorámico 16:9) |
| **Tiempo Estimado de Exposición** | 15 a 20 minutos (más sesión de preguntas del jurado) |

---

## Índice y Distribución Temporal de Diapositivas

```text
Diapositiva 01: Portada Institucional y Ficha Técnica                    [01:00 min]
Diapositiva 02: Planteamiento del Problema y Justificación Epistémica     [01:30 min]
Diapositiva 03: Pregunta Central y Objetivos de Investigación             [01:00 min]
Diapositiva 04: Enfoque Metodológico Mixto Concurrente (QUAN + QUAL)      [01:30 min]
Diapositiva 05: Génesis y Evolución de EduPulse (Fases 1 a 5)             [01:30 min]
Diapositiva 06: El Modelo del Tutor: Cereza y Mediación Socrática        [02:00 min]
Diapositiva 07: Arquitectura Pedagógica de los Cuatro Modelos            [01:30 min]
Diapositiva 08: El Prompt Maestro y Framework ROCAS                       [01:30 min]
Diapositiva 09: Innovaciones Técnicas de la Versión Final (v2.3)          [02:00 min]
Diapositiva 10: Suite de Analítica Visual Tipo Google Forms               [01:30 min]
Diapositiva 11: Gobernanza Ética, Seguridad y Google Cloud OAuth 2.0      [01:30 min]
Diapositiva 12: Principales Hallazgos y Triangulación Metodológica        [02:00 min]
Diapositiva 13: Conclusiones, Impacto Institucional y Aportes             [01:30 min]
Diapositiva 14: Demostración en Vivo y Apertura al Jurado                 [01:00 min]
                                                    TOTAL ESTIMADO: ~19:30 min
```

---

## Guion Detallado Diapositiva por Diapositiva

### Diapositiva 01 · Portada Institucional y Ficha Técnica
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Muy buenos días / tardes, respetado jurado calificador, profesor Juan Carlos Giraldo y comunidad académica presente. En el día de hoy tenemos el inmenso honor de presentar la sustentación final de nuestro trabajo de grado titulado: 'La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba'.  
  > Como parte medular de este proceso, hemos desarrollado e implementado **EduPulse**, una plataforma y agente inteligente orientado a la recolección, diagnóstico y análisis mixto de datos para comprender cómo la IA generativa está reconfigurando la formación de los futuros licenciados en informática."*

---

### Diapositiva 02 · El Problema de Investigación y Justificación Epistémica
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"El punto de partida de nuestra investigación radica en una contradicción evidente: la IA generativa irrumpió con fuerza masiva en la educación superior, transformando la planificación docente, la programación y el diseño de recursos. Sin embargo, este avance trajo consigo lo que Bastani y colaboradores denominan el 'efecto muleta' (crutch effect): el riesgo de que la máquina resuelva tareas mecánicamente, atrofiando el pensamiento crítico y la autonomía del futuro educador.  
  > En nuestro territorio cordobés, donde conviven brechas de conectividad e infraestructura en Montería y los centros de tutoría de Lorica, Sahagún, Montelíbano y Planeta Rica, y en el marco de la reciente Ley 2626 de Educación Digital, nos preguntamos: ¿cómo mediar e investigar esta realidad sin caer en encuestas frías o cuestionarios protocolarios? De allí nace la urgencia de EduPulse."*

---

### Diapositiva 03 · Pregunta Central y Objetivos
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Nuestra pregunta central orientó todo el desarrollo: ¿De qué manera los docentes en formación perciben, apropian e integran la IA en sus prácticas pedagógicas, y cómo la mediación dialógica inteligente facilita la comprensión de sus dilemas formativos?  
  > Para responderla, nos trazamos como objetivo general desarrollar e implementar EduPulse. Esto se materializó en tres objetivos específicos: primero, diagnosticar cuantitativamente autoeficacia y familiaridad; segundo, diseñar a Cereza, un agente socrático que guía entrevistas en profundidad; y tercero, triangular concurrentemente estos datos para proponer lineamientos curriculares a nuestro programa."*

---

### Diapositiva 04 · Enfoque Metodológico Multimétodo (QUAN + QUAL)
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Metodológicamente, adoptamos un diseño mixto de triangulación concurrente (QUAN + QUAL), respaldado epistemológicamente en Creswell y Hernández-Sampieri. Sobre una población de aproximadamente 430 estudiantes activos, seleccionamos una muestra intencional de informantes clave en los tres momentos del currículo: fundamentación, desarrollo didáctico y práctica pedagógica.  
  > La fase cuantitativa aplicó instrumentos tipo Likert y matrices de frecuencia con persistencia reactiva en Firestore; paralelamente, la fase cualitativa ejecutó entrevistas semiestructuradas con Cereza, alcanzando la saturación teórica y la pre-codificación de citas en tiempo real."*

---

### Diapositiva 05 · Génesis y Evolución de EduPulse (Fases 1 a 5)
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"EduPulse no fue un software improvisado; es el fruto de un proceso evolutivo riguroso en cinco fases. Comenzó en la Fase 1 con la delimitación ontológica de saberes bajo los marcos TPACK y UNESCO. En la Fase 2 creamos a Cereza y el framework ROCAS. En la Fase 3 incorporamos la psicometría cuantitativa con autosave offline. En la Fase 4 dimos vida a la experiencia visual Frutiger Aero y la navegación táctil móvil. Y en esta Fase 5 final, alcanzamos la versión 2.3 con motor de voz dual neuronal, analítica visual tipo Google Forms e integración con Google Cloud OAuth 2.0."*

---

### Diapositiva 06 · El Modelo del Tutor: Cereza y Mediación Socrática
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"El corazón cualitativo de EduPulse es su Modelo del Tutor, encarnado por Cereza. Rompiendo con los chatbots planos o serviles, Cereza posee aplomo, distinción e ingenio maduro (inspirada en la figura de Bayonetta). Cuando un estudiante responde con lugares comunes o respuestas 'políticamente correctas', Cereza aplica el probing socrático: sonríe cómplice y le pregunta: 'Vaya, qué respuesta tan correcta... pero entre tú y yo, colega: ¿fue una aliada didáctica o una muleta para salir del paso?'.  
  > Además, Cereza no depende de un número fijo de preguntas: evalúa algorítmicamente la densidad discursiva y declara la saturación autónoma (isInterviewFinished) tras 6 a 8 turnos sustantivos."*

---

### Diapositiva 07 · Arquitectura Pedagógica de los Cuatro Modelos
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"La plataforma se apoya en la clásica arquitectura de Sistemas Inteligentes en Educación, dividida en cuatro modelos articulados:  
  > 1. El Modelo del Tutor: define el cómo guiar y la neutralidad axiológica.  
  > 2. El Modelo del Conocimiento: define el qué investigar, con las tres categorías deductivas (IA, Formación Docente y Efectos).  
  > 3. El Modelo del Alumno: gestiona a quién se guía, adaptando las pistas socráticas según el semestre del informante (1° al 10°).  
  > 4. El Modelo del Mundo: el entorno visual translúcido, los controles móviles y la resiliencia técnica ante fluctuaciones de red."*

---

### Diapositiva 08 · El Prompt Maestro y Framework ROCAS
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Para gobernar el comportamiento de la IA en tiempo de ejecución, formalizamos el Prompt Maestro bajo el framework ROCAS: Rol (Cereza como colega formativa), Objetivo (desentrañar vivencias reales), Contexto (Universidad de Córdoba), Acciones (preguntas atómicas y probing de contraste) y Salida (esquema JSON estricto).  
  > El backend orquesta Google Gemini 2.5 Flash con una cascada inteligente y temperatura 0.4, ofreciendo bilingüismo nativo completo en español e inglés sin traducciones mecánicas."*

---

### Diapositiva 09 · Innovaciones Técnicas de la Versión Final (v2.3)
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"En esta versión final 2.3 que hoy presentamos, introdujimos cuatro avances técnicos decisivos:  
  > Primero, el Motor de Voz Dual: un visualizador de ondas dinámicas en canvas que graba audio con MediaRecorder y lo transcribe en el backend con Gemini multimodal, superando las caídas de Web Speech API en celulares.  
  > Segundo, el Motor de Síntesis Resiliente: un fallback determinista local que elimina condiciones de carrera y asegura que ninguna entrevista quede sin matriz de hallazgos.  
  > Tercero, la Validación Interactiva Guiada: un banner con píldoras de salto y resaltado fila por fila en matrices para que los estudiantes nunca se queden bloqueados.  
  > Y cuarto, la protección popstate que impide cierres accidentales al deslizar la pantalla del teléfono."*

---

### Diapositiva 10 · Suite Analítica Visual Tipo Google Forms
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Para procesar los datos con la máxima claridad visual, creamos una suite inspirada en la ergonomía de Google Forms:  
  > A nivel general, despliega diagramas de dona con la distribución por semestres y sedes, además de barras horizontales de frecuencia porcentual.  
  > A nivel individual, permite seleccionar a cualquier informante (E01 a E40) y traza su Radar de Competencias Tecno-pedagógicas, polaridad emocional dialógica y fichas con sus citas textuales más ricas. Todo esto blindado bajo control de acceso estricto solo para investigadores."*

---

### Diapositiva 11 · Gobernanza Ética, Seguridad y Google Cloud OAuth 2.0
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"La seguridad en EduPulse es un imperativo ético bajo la Ley 1581 de 2012 de Habeas Data: todos los informantes están seudo-anonimizados con códigos alfanuméricos y no se captura ningún dato sensible.  
  > Para los investigadores, implementamos autenticación de doble factor (Google OAuth en lista blanca institucional y PIN Maestro 0412). Además, integramos Google Cloud OAuth 2.0 en producción, permitiendo exportar con un solo clic libros de cálculo estructurados en tres pestañas directamente a Google Drive."*

---

### Diapositiva 12 · Hallazgos y Triangulación Metodológica
* **Voz sugerida (Investigador 2 / Jefersson):**
  > *"Al cruzar las métricas cuantitativas con los diálogos de Cereza, obtuvimos tres grandes hallazgos:  
  > Primero: Hay una alta adopción pragmática de herramientas de texto (82% usa ChatGPT), pero una escasa exploración de IA multimodal o generación de código.  
  > Segundo: Existe una marcada conciencia del efecto muleta; el 85% de los informantes reconoce el riesgo de perder autonomía reflexiva si no median críticamente la herramienta.  
  > Y tercero: La maduración formativa es palpable: en semestres iniciales la IA se percibe como ayuda para tareas, mientras que en la práctica docente avanzada se convierte en objeto de transposición didáctica reflexiva."*

---

### Diapositiva 13 · Conclusiones e Impacto Institucional
* **Voz sugerida (Investigador 1 / José Daniel):**
  > *"Como conclusiones fundamentales:  
  > 1. Validamos que la IA puede actuar como una co-investigadora hermenéutica empática y rigurosa, transformando la recolección cualitativa.  
  > 2. Demostramos la eficacia de la triangulación concurrente para sustentar con solidez empírica las reformas curriculares necesarias bajo la Ley 2626.  
  > 3. Entregamos a la Universidad de Córdoba un software libre, probado en producción, modular y reutilizable para futuras tesis de la Facultad de Educación."*

---

### Diapositiva 14 · Demostración en Vivo y Cierre
* **Voz sugerida (Investigadores 1 y 2):**
  > *"EduPulse se encuentra actualmente desplegado y operativo en la nube en edupulse-575b.onrender.com.  
  > Queremos expresar nuestro más sincero agradecimiento a nuestro director, Mag. Juan Carlos Giraldo Cardozo, a nuestros profesores y a los compañeros informantes de la Licenciatura.  
  > Con esto concluimos nuestra exposición y quedamos a entera disposición del honorable jurado calificador para la sesión de preguntas y deliberación. Muchas gracias."*

---

## Preguntas Frecuentes del Jurado Calificador y Cómo Responderlas

1. **¿Por qué usar un agente conversacional (Cereza) en lugar de un formulario de Google tradicional?**
   * *Respuesta:* Los formularios tradicionales capturan respuestas estáticas, superficiales y con alto sesgo de deseabilidad social. Cereza aplica *probing socrático*: cuando detecta una respuesta de manual, repregunta contextualmente sobre anécdotas reales y dilemas éticos, logrando una profundidad cualitativa equivalente a una entrevista cara a cara pero de forma estandarizada y escalable.

2. **¿Cómo garantizan que la IA no invente o alucine las respuestas de los estudiantes?**
   * *Respuesta:* El LLM no genera los datos del estudiante; el estudiante es quien habla. El rol de Gemini se limita a la mediación dialógica mediante el framework ROCAS (temperatura baja 0.4) y a la extracción de citas textuales verificables turno por turno. Además, contamos con el motor de síntesis local determinista (`qualitativeSynthesis.ts`) que audita y verifica las citas directamente sobre los mensajes originales.

3. **¿Cómo se articuló la Ley 2626 de 2026 en el instrumento?**
   * *Respuesta:* La Ley de Educación Digital exige que la formación docente no se limite al uso técnico de herramientas, sino que desarrolle ciudadanía digital, pensamiento crítico y ética algorítmica. Nuestras dimensiones cuantitativas y las pistas socráticas de Cereza indagan específicamente si el estudiante comprende el impacto territorial y curricular de esta normativa en los colegios de Córdoba.

4. **¿Qué sucede si un estudiante en zona rural no tiene buena conexión a internet?**
   * *Respuesta:* EduPulse fue diseñado con resiliencia regional: implementa guardado automático reactivo en `localStorage`, motor de voz dual para dictar con audio nativo sin requerir servidores de reconocimiento continuo de Google, y manejo de reconexión transparente que permite reanudar la entrevista en el turno exacto sin perder información.
