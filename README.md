# EduPulse
### Plataforma Inteligente para la Recolección, Diagnóstico y Análisis Mixto en Investigación Educativa
**Instrumento de Investigación para la Formación Docente en la Era de la Inteligencia Artificial**

---

## Contexto de la Investigación

**EduPulse** es una plataforma web y agente conversacional inteligente diseñado como instrumento principal de recolección de datos mixtos (cualitativos y cuantitativos) para el proyecto de trabajo de grado:

* **Título:** *La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba*
* **Autores (Investigadores):** José Daniel Durango Caballero & Jefersson Ramírez Oviedo
* **Director del proyecto:** Juan Carlos Giraldo Cardozo
* **Institución:** Universidad de Córdoba
* **Facultad:** Facultad de Educación y Ciencias Humanas
* **Programa:** Licenciatura en Informática
* **Línea de investigación:** Estudio de impacto de las tecnologías de la información y comunicación en educación
* **Sublínea:** Evaluación educativa y TIC
* **Población y Muestra:** ~430 estudiantes activos del programa · Muestra intencional: 20 a 40 informantes en formación docente
* **Marco Legal y Curricular:** Ley No. 2626 del 24 de agosto de 2026 ("Ley de Educación Digital") y Rediseño Curricular por fases (Exploración, Integración e Innovación)
* **Año:** 2025 – 2026

---

## Propósito del Instrumento y Enfoque Metodológico Mixto

Bajo el **paradigma hermenéutico–interpretativo** y un diseño concurrente de **triangulación multimétodo (QUAN + QUAL)**, EduPulse integra dos canales complementarios de indagación científica:

1. **Interacción Dialógica Cualitativa Mediada por IA (Cereza):** Conversación socrática en profundidad que explora vivencias reales, transposición didáctica, prevención del "efecto muleta" (*Bastani et al., 2024*) y dilemas éticos. Cereza evalúa la densidad discursiva y determina de manera autónoma la **saturación cualitativa** (`isInterviewFinished: true`).
2. **Diagnóstico Cuantitativo Estructurado (Escalas Likert 1 a 5):** Cuestionarios psicométricos sobre *Percepciones y Usos de IA* y *Autoeficacia en Prácticas Pedagógicas*, con guardado automático de borradores offline (`localStorage`), sincronización reactiva en Cloud Firestore y panel de visualización estadística descriptiva (medias $\bar{x}$, desviaciones estándar $\sigma$ y distribuciones porcentuales).

### Matriz de Categorías Cualitativas de la Investigación

| Categoría de Análisis | Subcategorías | Foco y Unidades de Análisis |
| :--- | :--- | :--- |
| **Inteligencia Artificial (IA)** | Gestión y mediación pedagógica <br> Dimensión ética y crítica | Uso de IA para retroalimentación, planeación y recursos multimedia. Reflexiones sobre privacidad de datos, sesgos algorítmicos, autoría y prevención de la dependencia cognitiva. |
| **Formación Docente** | Articulación de saberes (Pedagógico, Tecnológico, Ético) <br> Práctica Reflexiva | Presencia de la IA en el currículo de la Licenciatura en Informática, mediación consciente, autoeficacia docente, autoevaluación y transformación del rol educador. |
| **Efectos de la IA** | Impacto en la práctica profesional (Planeación y Creatividad) <br> Retos y limitaciones formativas | Cambios en la autonomía, pensamiento crítico, barreras de infraestructura tecnológica, brecha digital en Córdoba y propuestas para la Ley 2626 de 2026. |

---

## Características de la Agente Conversacional ("Cereza")

1. **Voz y Personalidad Magnética (Inspirada en Bayonetta):**
   * Presencia sofisticada, aplomo aristocrático y trato empático entre futuros colegas.
   * Toque lúdico, inteligente y sutilmente mordaz (*playful & sharp*): interpela con simpatía e ironía cómplice las respuestas evasivas o de manual para desarmar la deseabilidad social.
   * Mentoría protectora y exigente: combate la pereza intelectual y el "efecto muleta", exigiendo autonomía reflexiva.
   * Profesionalismo inquebrantable y estricta neutralidad axiológica.
2. **Adaptabilidad Curricular por Semestres:**
   * **Semestres Iniciales (1° a 3° - Fundamentación):** Tono formativo inicial enfocado en su experiencia como aprendiz universitario de informática (algoritmos, dudas conceptuales).
   * **Semestres Intermedios (4° a 6° - Desarrollo Didáctico):** Indaga sobre diseño de recursos multimedia, microclases, guías interactivas y debates éticos.
   * **Semestres Avanzados (7° a 10° - Formación Avanzada):** Diálogo profesional sobre prácticas pedagógicas en colegios de Córdoba, transposición didáctica y mediación con escolares.
3. **Decisión Autónoma de Saturación Cualitativa:**
   * Monitorea el número de turnos sustantivos del participante (`participantTurns`).
   * Explora orgánicamente cuatro dimensiones clave (Prácticas/Autoeficacia, Ética/Autonomía, Transición Curricular y Coaprendizaje).
   * Tras 6 a 8 intervenciones maduras, sintetiza los hallazgos y concluye con elegancia.
4. **Voz Multimodal y Bilingüismo (ES / EN):**
   * Reconocimiento de voz continuo vía Web Speech API y síntesis de voz opcional.
   * Soporte idiomático dual instantáneo en toda la plataforma.
5. **Pre-Codificación Semántica y Triangulación CAQDAS (`/api/analyze-interview`):**
   * Clasifica automáticamente citas textuales directas en las categorías de la tesis y permite exportaciones a Google Sheets, CSV, ATLAS.ti y NVivo.

---

## Experiencia de Usuario y Soporte Móvil

* **Estética Frutiger Aero Modern Glassmorphism:** Interfaz oscura y translúcida con acentos cian, esmeralda y el sello simbólico de Umbra (*Umbran Watch*).
* **Navegación Móvil Inferior (`MobileBottomNav.tsx`):** Barra ergonómica flotante diseñada para smartphones y tablets.
* **Navegación Protegida con Botones de Retorno (`ArrowLeft`):** Botones explícitos de regreso en pantalla para evitar el cierre accidental de páginas.
* **Intercepción de Gestos del Navegador (`popstate` + `beforeunload`):** Protección contra el botón atrás nativo del dispositivo y gestos táctiles de deslizamiento durante las sesiones de entrevista activa.

---

## Seguridad y Gobernanza de Datos (RBAC & 2FA)

* **Autenticación Dual para Investigadores (`AdminAuthModal.tsx`):**
  * Factor 1: Google OAuth verificado contra lista blanca institucional (`josedudaca@gmail.com`, `jdurangocaballero59@correo.unicordoba.edu.co`, `jramirezoviedo06@correo.unicordoba.edu.co`, `jgiraldo@correo.unicordoba.edu.co`).
  * Factor 2: PIN Maestro de Investigador (`0412`).
* **Protección de Datos Personales (Ley 1581 de 2012):** Desidentificación con códigos seudo-anonimizados (`E01`...`E40`); sin recolección de cédulas ni teléfonos.
* **Reglas de Seguridad en Cloud Firestore (`firestore.rules`):** Escritura controlada de sesiones e instrumentos con consentimiento ético; lectura masiva y analítica reservada a investigadores.
* **Endpoint Seguro de Diagnóstico (`/api/health`):** Comprobación en vivo del estado del motor de IA sin exponer credenciales privadas.

---

## Arquitectura Técnica y Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion.
* **Backend:** Node.js, Express, TypeScript (`tsx`).
* **Inteligencia Artificial:** Google GenAI SDK (`@google/genai`) con cascada de modelos (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-3.6-flash`).
* **Base de Datos & Auth:** Google Cloud Firestore (tiempo real) y Firebase Authentication.
* **Exportación de Datos:** Pipeline de exportación a CSV, Excel, Google Sheets y software CAQDAS.

---

## Estructura del Proyecto

```text
EduPulse/
├── documentation/                   # Suite completa de documentación técnica y metodológica
│   ├── README.md                    # Índice general y articulación con la tesis
│   ├── 01-modelo-del-tutor.md        # Modelo del Tutor: Mediación socrática y voz de Cereza (v2.0)
│   ├── 02-modelo-del-conocimiento.md # Modelo del Conocimiento: TPACK, Ley 2626 y categorías (v2.0)
│   ├── 03-modelo-del-alumno.md       # Modelo del Alumno: Perfil formativo y traza mixta (v2.0)
│   ├── 04-modelo-del-mundo.md        # Modelo del Mundo: Glassmorphism, UX móvil y vistas (v2.0)
│   ├── 05-prompt-maestro-rocas.md    # Prompt Maestro ROCAS: Inferencia dual ES/EN y Gemini (v2.0)
│   ├── 06-arquitectura-del-sistema.md# Arquitectura del Sistema: Pipeline y endpoints Express (v2.0)
│   ├── 07-instrumentos-y-triangulacion.md # Instrumentos Likert, autosave y triangulación (v1.0)
│   └── 08-seguridad-y-control-de-acceso.md # Seguridad: RBAC, 2FA (OAuth + PIN 0412) y reglas (v1.0)
├── src/
│   ├── components/
│   │   ├── instruments/             # Módulo de instrumentos cuantitativos diagnósticos
│   │   │   ├── InstrumentForm.tsx           # Formulario Likert interactivo con autosave
│   │   │   ├── InstrumentResponsesViewer.tsx # Visor estadístico analítico (medias, gráficos)
│   │   │   └── InstrumentsView.tsx          # Portal de cuestionarios diagnósticos
│   │   ├── AdminAuthModal.tsx       # Modal de autenticación 2FA para investigadores
│   │   ├── GuidesManager.tsx        # Gestor de guiones cualitativos semiestructurados
│   │   ├── InterviewRoom.tsx        # Sala de entrevista multimodal interactiva con Cereza
│   │   ├── MobileBottomNav.tsx      # Barra de navegación flotante inferior para móviles
│   │   ├── Navbar.tsx               # Barra de navegación superior con retroceso e idioma
│   │   ├── NewSessionModal.tsx      # Modal de caracterización y consentimiento informado
│   │   ├── SessionsDashboard.tsx    # Panel de administración de entrevistas y exportación
│   │   ├── SummaryView.tsx          # Matriz de análisis cualitativo y extracción de citas
│   │   └── ThesisProjectModal.tsx   # Ficha técnica y contexto institucional de la tesis
│   ├── lib/
│   │   ├── adminAuth.ts             # Lógica de autorización RBAC (Google OAuth + PIN)
│   │   ├── defaultGuides.ts         # Guion oficial estructurado por categorías
│   │   ├── firebase.ts              # Conexión Firebase Firestore y Authentication
│   │   ├── i18n.ts                  # Diccionario de internacionalización (ES / EN)
│   │   ├── sheetsExport.ts          # Pipeline de exportación a Google Sheets / CSV
│   │   └── thesisContext.ts         # Metadatos del proyecto UniCórdoba
│   ├── types/
│   │   └── index.ts                 # Tipos y esquemas de datos TypeScript
│   ├── App.tsx                      # Orquestador principal de vistas y estados
│   ├── main.tsx                     # Punto de entrada React
│   └── index.css                    # Estilos globales y Tailwind CSS v4
├── server.ts                        # Servidor Express con endpoints de IA (/api/chat, /api/health)
├── firestore.rules                  # Reglas declarativas de seguridad para Cloud Firestore
├── package.json                     # Dependencias y scripts de ejecución
├── tsconfig.json                    # Configuración de compilación TypeScript
├── vite.config.ts                   # Configuración del empaquetador Vite
├── .env.example                     # Plantilla de variables de entorno requeridas
└── README.md                        # Documentación técnica y metodológica principal
```

---

## Instalación y Puesta en Marcha

### Prerrequisitos
* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).
* Llave de API de Google Gemini ([Google AI Studio](https://aistudio.google.com/)).

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JoseDanielDurango/EduPulse.git
   cd EduPulse
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea o verifica el archivo `.env` en la raíz del proyecto basándote en `.env.example`:
   ```env
   GEMINI_API_KEY="tu_llave_de_api_de_gemini"
   PORT=3000
   ```

4. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000` para interactuar con la plataforma.

5. **Construir para producción:**
   ```bash
   npm run build
   npm start
   ```

---

## Licencia y Reconocimientos

Desarrollado para la investigación de pregrado en la **Universidad de Córdoba (Montería, Colombia)**.  
Licenciatura en Informática · Facultad de Educación y Ciencias Humanas.  
Bajo licencia Apache 2.0.
