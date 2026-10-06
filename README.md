# EduPulse 🎓🤖
### Plataforma Inteligente para la Recolección y Análisis de Datos Cualitativos
**Instrumento de Investigación para la Formación Docente en la Era de la Inteligencia Artificial**

---

## 📌 Contexto de la Investigación

**EduPulse** es una plataforma y agente conversacional inteligente diseñado como instrumento principal de recolección de datos cualitativos para el proyecto de trabajo de grado:

* **Título:** *La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba*
* **Autores:** José Daniel Durango Caballero & Jefersson Ramírez Oviedo
* **Institución:** Universidad de Córdoba
* **Facultad:** Facultad de Educación y Ciencias Humanas
* **Programa:** Licenciatura en Informática con Énfasis en Medios Audiovisuales
* **Línea de investigación:** Estudio de impacto de las tecnologías de la información y comunicación en educación
* **Sublínea:** Evaluación educativa y TIC
* **Año:** 2025

---

## 🎯 Propósito del Instrumento

Bajo el **paradigma hermenéutico–interpretativo** y un **enfoque cualitativo**, EduPulse reemplaza el formulario rígido tradicional por una experiencia de **entrevista semiestructurada asistida por IA**. 

El agente conversacional (denominado **Maya**) interactúa con una muestra intencional de 8 a 12 estudiantes en formación docente del programa, adaptando su lenguaje pedagógico, garantizando el rigor ético, y profundizando mediante repreguntas reflexivas (*probing*) neutrales.

### 📐 Matriz de Categorías Cualitativas (Tabla 1 de la Investigación)

| Categoría de análisis | Subcategorías | Foco y Unidades de Análisis |
| :--- | :--- | :--- |
| **Inteligencia Artificial (IA)** | Gestión y mediación pedagógica <br> Dimensión ética y crítica | Uso de IA para retroalimentación, planeación y recursos multimedia. Reflexiones sobre privacidad de datos, sesgos algorítmicos y honestidad académica. |
| **Formación Docente** | Articulación de saberes (Pedagógico, Tecnológico, Ético) <br> Práctica Reflexiva | Presencia de la IA en el currículo de la Licenciatura, mediación consciente, autoevaluación y transformación del rol docente. |
| **Efectos de la IA** | Impacto en la práctica profesional (Planeación y Creatividad) <br> Retos y limitaciones formativas | Cambios en la autonomía, pensamiento crítico, barreras de infraestructura tecnológica, conectividad y propuestas curriculares de mejora. |

---

## 🧠 Características del Agente Conversacional ("Maya")

1. **Adaptabilidad Formativa según Semestre:**
   * **Semestres Iniciales (1° a 3°):** Aborda la experiencia como aprendiz de tecnologías y medios, evitando tecnicismos curriculares o suponer prácticas de aula aún no realizadas.
   * **Semestres Intermedios (4° a 6°):** Explora la didáctica computacional, la creación de recursos audiovisuales y microclases.
   * **Semestres Avanzados (7° a 10°):** Diálogo profesional sobre prácticas pedagógicas en colegios, transposición didáctica y mediación con estudiantes escolares.
2. **Protocolo de Repregunta Hermenéutica (*Probing*):**
   * Detecta respuestas breves o dilemas pedagógicos y formula hasta 2 repreguntas reflexivas para enriquecer el discurso cualitativo antes de cambiar de categoría.
   * Mantiene neutralidad estricta para no sesgar ni inducir respuestas que confirmen hipótesis.
3. **Anonimización y Consentimiento Informado:**
   * Registro previo de consentimiento informado digital.
   * Codificación seudo-anonimizada del participante (`E01`, `E02`, etc.).
4. **Voz Bidireccional (Web Speech API):**
   * Reconocimiento de voz para dictado natural por parte del estudiante.
   * Síntesis de voz opcional para escuchar las intervenciones del agente.
5. **Motor de Síntesis y Pre-Codificación (`/api/analyze-interview`):**
   * Genera de forma automatizada resúmenes interpretativos y extrae **citas textuales directas** categorizadas, listas para alimentar el **Capítulo 4 (Desarrollo)** y el **Capítulo 5 (Resultados)** de la tesis.

---

## 🛠️ Arquitectura Técnica y Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
* **Backend:** Node.js, Express, TypeScript (`tsx`).
* **Inteligencia Artificial:** Google GenAI SDK (`@google/genai`) con el modelo `gemini-3.8-flash` (y respaldo inteligente).
* **Base de Datos & Auth:** Firebase Firestore (tiempo real) y Firebase Authentication.
* **Exportación de Datos:** Exportación estructurada a formato CSV, Excel y Google Sheets.

---

## 📂 Estructura del Proyecto

```text
EduPulse/
├── src/
│   ├── components/
│   │   ├── GuidesManager.tsx        # Gestor de guiones y preguntas cualitativas
│   │   ├── InterviewRoom.tsx        # Sala de entrevista con chat, voz y progreso
│   │   ├── Navbar.tsx               # Barra de navegación e idioma
│   │   ├── NewSessionModal.tsx      # Modal de inicio y consentimiento informado
│   │   ├── SessionsDashboard.tsx    # Panel de administración de entrevistas
│   │   ├── SummaryView.tsx          # Vista de análisis, citas y síntesis
│   │   └── ThesisProjectModal.tsx   # Ficha técnica y contexto de la tesis
│   ├── lib/
│   │   ├── defaultGuides.ts         # Guion oficial estructurado por categorías
│   │   ├── firebase.ts              # Conexión Firestore y autenticación
│   │   ├── i18n.ts                  # Traducciones (Español / Inglés)
│   │   ├── sheetsExport.ts          # Pipeline de exportación a Sheets/CSV
│   │   └── thesisContext.ts         # Metadatos del proyecto UniCórdoba
│   ├── types/
│   │   └── index.ts                 # Tipos y esquemas de datos TypeScript
│   ├── App.tsx                      # Componente principal de la aplicación
│   ├── main.tsx                     # Punto de entrada React
│   └── index.css                    # Estilos globales y Tailwind
├── server.ts                        # Servidor Express con endpoints de IA
├── firestore.rules                  # Reglas de seguridad para Firestore
├── package.json                     # Dependencias y scripts de ejecución
├── tsconfig.json                    # Configuración TypeScript
├── vite.config.ts                   # Configuración Vite + Tailwind
├── .env.example                     # Plantilla de variables de entorno
└── README.md                        # Documentación técnica y metodológica
```

---

## 🚀 Instalación y Puesta en Marcha

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

---

## 📄 Licencia y Reconocimientos

Desarrollado para la investigación de pregrado en la **Universidad de Córdoba (Montería, Colombia)**. 
Bajo licencia Apache 2.0.