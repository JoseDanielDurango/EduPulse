import { InstrumentDefinition } from '../types/instruments';
import { Language } from './i18n';

export const INSTRUMENTS_ES: InstrumentDefinition[] = [
  {
    id: 'cuestionario-tecnico-pedagogico',
    code: 'INS-01',
    title: 'Cuestionario Técnico-Pedagógico de Diagnóstico Inicial',
    shortTitle: 'Diagnóstico Inicial de IA',
    description:
      'Este cuestionario tiene como propósito analizar las prácticas, percepciones y experiencias actuales de los estudiantes del programa frente al uso de la inteligencia artificial (IA) en su proceso formativo.',
    phase: 'Fase 1: Diagnóstico Inicial y Evaluación de Conocimientos Previos',
    methodologicalObjective:
      'Establecer una línea base sobre el nivel de familiaridad, uso y percepciones iniciales de la IA generativa en la Licenciatura en Informática (Universidad de Córdoba).',
    questions: [
      {
        id: 'q1_nombre',
        type: 'text',
        title: '1. Nombre Completo',
        placeholder: 'Escribe tus nombres y apellidos',
        required: true,
        category: 'Información Sociodemográfica',
      },
      {
        id: 'q2_edad',
        type: 'number',
        title: '2. Edad',
        placeholder: 'ej. 21',
        required: true,
        category: 'Información Sociodemográfica',
      },
      {
        id: 'q3_semestre',
        type: 'rating',
        title: '3. Semestre actual',
        description: 'Selecciona tu semestre en curso (1 al 10)',
        ratingMin: 1,
        ratingMax: 10,
        ratingMinLabel: '1° Semestre',
        ratingMaxLabel: '10° Semestre',
        required: true,
        category: 'Información Sociodemográfica',
      },
      {
        id: 'q4_materias_ia',
        type: 'single_choice',
        title: '4. ¿Has visto temas de Inteligencia Artificial en alguna materia de la universidad?',
        required: true,
        category: 'Formación Docente',
        subCategory: 'Articulación curricular de saberes',
        options: [
          'Sí',
          'No',
          'He aprendido por mi cuenta autodidacta',
        ],
      },
      {
        id: 'q5_frecuencia_usos',
        type: 'matrix_grid',
        title: '5. Marca qué tan seguido utilizas estas herramientas de Inteligencia Artificial',
        required: true,
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Gestión y mediación pedagógica',
        matrixRows: [
          { id: 'textos_info', label: 'Para crear textos o buscar información' },
          { id: 'imagenes_videos', label: 'Para crear imágenes o videos' },
          { id: 'diapositivas_presentaciones', label: 'Para hacer diapositivas o presentaciones' },
          { id: 'automatizar_conectar', label: 'Para automatizar tareas o conectar aplicaciones' },
        ],
        matrixColumns: [
          { id: 'todos_los_dias', label: 'Todos los días' },
          { id: 'cada_semana', label: 'Cada semana' },
          { id: 'cada_mes', label: 'Cada mes' },
          { id: 'nunca', label: 'Nunca' },
        ],
      },
      {
        id: 'q6_que_es_ia',
        type: 'paragraph',
        title: '6. ¿Qué es para ti la Inteligencia Artificial y cómo crees que ayuda o cambia la forma en que estudiamos hoy en día?',
        placeholder: 'Comparte tu definición personal y tu visión sobre su influencia en el estudio...',
        required: true,
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Concepto y mediación pedagógica',
      },
      {
        id: 'q7_ventajas_problemas_docente',
        type: 'paragraph',
        title: '7. Como futuro docente de informática y medios audiovisuales, ¿qué ventajas o problemas te genera usar la Inteligencia Artificial para preparar tus clases?',
        placeholder: 'Describe impactos positivos (optimización, recursos) o dificultades (dependencia, falta de rigor)...',
        required: true,
        category: 'Efectos de la IA',
        subCategory: 'Impacto en la práctica profesional (Planeación y Creatividad)',
      },
      {
        id: 'q8_herramientas_exploradas',
        type: 'multiple_choice',
        title: '8. ¿Cuál de las siguientes herramientas de IA has explorado o utilizado para fines académicos?',
        description: 'Puedes marcar todas las que apliquen',
        required: true,
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Prácticas tecnológicas actuales',
        options: [
          'Chatbots (ej. ChatGPT, Claude)',
          'Generadores de imágenes (ej. Midjourney, DALL-E)',
          'Herramientas de programación (ej. GitHub Copilot)',
          'Herramientas de investigación/resumen (ej. Perplexity, Elicit)',
          'Ninguna de las anteriores',
        ],
      },
      {
        id: 'q9_probabilidad_curriculo',
        type: 'single_choice',
        title: '9. Como futuro docente, ¿qué tan probable es que integres la IA en tu currículo escolar?',
        required: true,
        category: 'Formación Docente',
        subCategory: 'Autoeficacia y transposición didáctica',
        options: [
          'Muy probable',
          'Probable',
          'Neutral',
          'Poco probable',
          'Nada probable',
        ],
      },
    ],
  },
  {
    id: 'encuesta-experiencias-ia',
    code: 'INS-02',
    title: 'Encuesta sobre Experiencias y Uso de Inteligencia Artificial',
    shortTitle: 'Experiencias y Prácticas de IA',
    description:
      'Esta encuesta tiene como objetivo explorar tus experiencias y reflexiones sobre el uso de la inteligencia artificial en tu formación docente.',
    phase: 'Fase 2: Análisis Crítico de Experiencias y Contexto Regional',
    methodologicalObjective:
      'Profundizar en la postura institucional docente, dilemas cognitivos (creatividad vs. pensamiento crítico), el rol del prompt pedagógico y los retos de infraestructura en Córdoba.',
    questions: [
      {
        id: 'q1_nombre',
        type: 'text',
        title: '1. Nombre Completo',
        placeholder: 'Escribe tus nombres y apellidos',
        required: true,
        category: 'Información Sociodemográfica',
      },
      {
        id: 'q2_edad',
        type: 'number',
        title: '2. Edad',
        placeholder: 'ej. 22',
        required: true,
        category: 'Información Sociodemográfica',
      },
      {
        id: 'q3_semestre',
        type: 'rating',
        title: '3. Semestre actual',
        description: 'Selecciona tu semestre en curso (1 al 10)',
        ratingMin: 1,
        ratingMax: 10,
        ratingMinLabel: '1° Semestre',
        ratingMaxLabel: '10° Semestre',
        required: true,
        category: 'Información Sociodemográfica',
      },
      {
        id: 'q4_profesores_vision',
        type: 'single_choice',
        title: '4. ¿Cómo ven tus profesores de la Licenciatura el uso de la Inteligencia Artificial?',
        required: true,
        category: 'Formación Docente',
        subCategory: 'Percepción docente institucional',
        options: [
          'Te la prohíben',
          'Te permiten usarla libremente',
          'Te enseñan a usarla correctamente',
          'No la mencionan en clase',
        ],
      },
      {
        id: 'q5_experiencia_tarea',
        type: 'paragraph',
        title: '5. Cuéntame una experiencia o tarea donde usar IA te haya ayudado a entender mucho mejor un tema de diseño audiovisual o informática.',
        placeholder: 'Relata la anécdota o actividad puntual, qué herramienta usaste y qué lograste comprender...',
        required: true,
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Gestión y mediación pedagógica',
      },
      {
        id: 'q6_creatividad_vs_critica',
        type: 'single_choice',
        title: '6. ¿Crees que usar IA para hacer tareas automáticas te ayuda a concentrarte en ser más creativo, o por el contrario, hace que dejes de pensar críticamente por ti mismo?',
        required: true,
        category: 'Efectos de la IA',
        subCategory: 'Autonomía cognitiva y prevención del "efecto muleta"',
        options: [
          'Ayuda a ser más creativo',
          'Hace que dejes de pensar críticamente',
          'Ambas situaciones ocurren',
          'Ninguna de las anteriores',
        ],
      },
      {
        id: 'q7_prompts_rol_docente',
        type: 'paragraph',
        title: '7. ¿Cómo crees que saber usar prompts (instrucciones escritas para la IA) cambia el rol de un profesor de informática hoy en día?',
        placeholder: 'Explica cómo influye la ingeniería de prompts y la mediación en la labor de enseñanza...',
        required: true,
        category: 'Formación Docente',
        subCategory: 'Competencias tecnopedagógicas docentes',
      },
      {
        id: 'q8_brecha_conectividad_cordoba',
        type: 'paragraph',
        title: '8. Pensando en los problemas de internet y la falta de computadores en las instituciones de Córdoba, ¿qué dificultades crees que tendrías al querer usar clases con inteligencia artificial en tus prácticas pedagógicas?',
        placeholder: 'Reflexiona sobre las realidades de conectividad, laboratorios y brecha digital en los colegios de la región...',
        required: true,
        category: 'Efectos de la IA',
        subCategory: 'Retos y limitaciones formativas (Contexto regional)',
      },
    ],
  },
];

export const INSTRUMENTS_EN: InstrumentDefinition[] = [
  {
    id: 'cuestionario-tecnico-pedagogico',
    code: 'INS-01',
    title: 'Techno-Pedagogical Baseline Diagnostic Questionnaire',
    shortTitle: 'AI Baseline Diagnostic',
    description:
      'The purpose of this questionnaire is to analyze the current practices, perceptions, and experiences of students regarding generative artificial intelligence (AI) in their pedagogical training.',
    phase: 'Phase 1: Initial Diagnosis and Prior Knowledge Assessment',
    methodologicalObjective:
      'Establish a comprehensive baseline on the level of familiarity, practical use, and initial perceptions of generative AI in the Bachelor in Computer Science program (University of Córdoba).',
    questions: [
      {
        id: 'q1_nombre',
        type: 'text',
        title: '1. Full Name',
        placeholder: 'Enter your first and last names',
        required: true,
        category: 'Sociodemographic Information',
      },
      {
        id: 'q2_edad',
        type: 'number',
        title: '2. Age',
        placeholder: 'e.g. 21',
        required: true,
        category: 'Sociodemographic Information',
      },
      {
        id: 'q3_semestre',
        type: 'rating',
        title: '3. Current Semester',
        description: 'Select your currently enrolled semester (1 to 10)',
        ratingMin: 1,
        ratingMax: 10,
        ratingMinLabel: '1st Semester',
        ratingMaxLabel: '10th Semester',
        required: true,
        category: 'Sociodemographic Information',
      },
      {
        id: 'q4_materias_ia',
        type: 'single_choice',
        title: '4. Have you covered Artificial Intelligence topics in any university course?',
        required: true,
        category: 'Teacher Training',
        subCategory: 'Curricular articulation of knowledge',
        options: [
          'Yes',
          'No',
          'I have learned on my own (self-taught)',
        ],
      },
      {
        id: 'q5_frecuencia_usos',
        type: 'matrix_grid',
        title: '5. Indicate how frequently you use these Artificial Intelligence tools',
        required: true,
        category: 'Artificial Intelligence (AI)',
        subCategory: 'Pedagogical management and mediation',
        matrixRows: [
          { id: 'textos_info', label: 'To create texts or search for information' },
          { id: 'imagenes_videos', label: 'To generate images or video assets' },
          { id: 'diapositivas_presentaciones', label: 'To build slides or presentations' },
          { id: 'automatizar_conectar', label: 'To automate tasks or connect apps' },
        ],
        matrixColumns: [
          { id: 'todos_los_dias', label: 'Every day' },
          { id: 'cada_semana', label: 'Every week' },
          { id: 'cada_mes', label: 'Every month' },
          { id: 'nunca', label: 'Never' },
        ],
      },
      {
        id: 'q6_que_es_ia',
        type: 'paragraph',
        title: '6. What does Artificial Intelligence mean to you, and how do you believe it helps or transforms the way we learn today?',
        placeholder: 'Share your personal definition and your perspective on its pedagogical impact...',
        required: true,
        category: 'Artificial Intelligence (AI)',
        subCategory: 'Concept and pedagogical mediation',
      },
      {
        id: 'q7_ventajas_problemas_docente',
        type: 'paragraph',
        title: '7. As a future educator in computer science and media, what advantages or challenges does using Artificial Intelligence bring to your lesson planning?',
        placeholder: 'Describe positive impacts (optimization, resource generation) or hurdles (dependence, lack of critical rigor)...',
        required: true,
        category: 'Effects of AI',
        subCategory: 'Impact on professional practice (Planning and Creativity)',
      },
      {
        id: 'q8_herramientas_exploradas',
        type: 'multiple_choice',
        title: '8. Which of the following AI tools have you explored or used for academic purposes?',
        description: 'You may select all that apply',
        required: true,
        category: 'Artificial Intelligence (AI)',
        subCategory: 'Current technological practices',
        options: [
          'Chatbots (e.g. ChatGPT, Claude)',
          'Image generators (e.g. Midjourney, DALL-E)',
          'Coding assistants (e.g. GitHub Copilot)',
          'Research/summarization tools (e.g. Perplexity, Elicit)',
          'None of the above',
        ],
      },
      {
        id: 'q9_probabilidad_curriculo',
        type: 'single_choice',
        title: '9. As a future educator, how likely are you to integrate AI into your school curriculum?',
        required: true,
        category: 'Teacher Training',
        subCategory: 'Self-efficacy and didactic transposition',
        options: [
          'Very likely',
          'Likely',
          'Neutral',
          'Unlikely',
          'Very unlikely',
        ],
      },
    ],
  },
  {
    id: 'encuesta-experiencias-ia',
    code: 'INS-02',
    title: 'Survey on Experiences and Uses of Artificial Intelligence',
    shortTitle: 'AI Experiences & Practices',
    description:
      'The purpose of this survey is to explore your personal experiences, critical reflections, and practices regarding artificial intelligence in your teacher education.',
    phase: 'Phase 2: Critical Analysis of Experiences and Regional Context',
    methodologicalObjective:
      'Examine faculty institutional stances, cognitive trade-offs (creativity vs. critical thinking), the role of prompt engineering in pedagogy, and infrastructural challenges in Córdoba.',
    questions: [
      {
        id: 'q1_nombre',
        type: 'text',
        title: '1. Full Name',
        placeholder: 'Enter your first and last names',
        required: true,
        category: 'Sociodemographic Information',
      },
      {
        id: 'q2_edad',
        type: 'number',
        title: '2. Age',
        placeholder: 'e.g. 22',
        required: true,
        category: 'Sociodemographic Information',
      },
      {
        id: 'q3_semestre',
        type: 'rating',
        title: '3. Current Semester',
        description: 'Select your currently enrolled semester (1 to 10)',
        ratingMin: 1,
        ratingMax: 10,
        ratingMinLabel: '1st Semester',
        ratingMaxLabel: '10th Semester',
        required: true,
        category: 'Sociodemographic Information',
      },
      {
        id: 'q4_profesores_vision',
        type: 'single_choice',
        title: '4. How do your university professors view the use of Artificial Intelligence?',
        required: true,
        category: 'Teacher Training',
        subCategory: 'Institutional faculty perception',
        options: [
          'They prohibit it',
          'They allow you to use it freely',
          'They teach you how to use it properly',
          'They do not mention it in class',
        ],
      },
      {
        id: 'q5_experiencia_tarea',
        type: 'paragraph',
        title: '5. Tell me about an experience or assignment where using AI helped you understand a computer science or media design topic much better.',
        placeholder: 'Describe the specific experience, which tool was used, and what you came to comprehend...',
        required: true,
        category: 'Artificial Intelligence (AI)',
        subCategory: 'Pedagogical management and mediation',
      },
      {
        id: 'q6_creatividad_vs_critica',
        type: 'single_choice',
        title: '6. Do you believe that using AI for automated tasks helps you focus on being more creative, or on the contrary, leads you to stop thinking critically for yourself?',
        required: true,
        category: 'Effects of AI',
        subCategory: 'Cognitive autonomy and preventing the "crutch effect"',
        options: [
          'Helps you be more creative',
          'Leads you to stop thinking critically',
          'Both situations occur',
          'None of the above',
        ],
      },
      {
        id: 'q7_prompts_rol_docente',
        type: 'paragraph',
        title: '7. How do you think knowing how to use prompts (written instructions for AI) changes the role of a computer science teacher today?',
        placeholder: 'Explain how prompt engineering and mediation reshape the teaching role...',
        required: true,
        category: 'Teacher Training',
        subCategory: 'Teacher techno-pedagogical competencies',
      },
      {
        id: 'q8_brecha_conectividad_cordoba',
        type: 'paragraph',
        title: '8. Considering internet connectivity issues and the lack of computers in schools across Córdoba, what difficulties do you anticipate when trying to teach with artificial intelligence during your pedagogical practicum?',
        placeholder: 'Reflect on connectivity realities, computer labs, and digital divide constraints in regional schools...',
        required: true,
        category: 'Effects of AI',
        subCategory: 'Formative challenges & limitations (Regional context)',
      },
    ],
  },
];

export const getInstruments = (language: Language = 'es'): InstrumentDefinition[] => {
  return language === 'en' ? INSTRUMENTS_EN : INSTRUMENTS_ES;
};

export const DEFAULT_INSTRUMENTS = INSTRUMENTS_ES;

// Helper to match options across ES and EN translations
export const isOptionMatch = (
  questionId: string,
  optionText: string,
  storedAnswer: string | undefined
): boolean => {
  if (!storedAnswer) return false;
  if (storedAnswer === optionText) return true;

  const qEs = INSTRUMENTS_ES.flatMap((i) => i.questions).find((q) => q.id === questionId);
  const qEn = INSTRUMENTS_EN.flatMap((i) => i.questions).find((q) => q.id === questionId);

  if (!qEs?.options || !qEn?.options) return false;

  let idx = qEs.options.indexOf(optionText);
  if (idx === -1) idx = qEn.options.indexOf(optionText);
  if (idx === -1) return false;

  return storedAnswer === qEs.options[idx] || storedAnswer === qEn.options[idx];
};

// Helper to translate stored answer text into target UI language for display
export const getLocalizedOptionLabel = (
  questionId: string,
  storedAnswer: string,
  targetLang: Language
): string => {
  const qEs = INSTRUMENTS_ES.flatMap((i) => i.questions).find((q) => q.id === questionId);
  const qEn = INSTRUMENTS_EN.flatMap((i) => i.questions).find((q) => q.id === questionId);

  if (!qEs?.options || !qEn?.options) return storedAnswer;

  let idx = qEs.options.indexOf(storedAnswer);
  if (idx === -1) idx = qEn.options.indexOf(storedAnswer);
  if (idx === -1) return storedAnswer;

  return targetLang === 'en' ? qEn.options[idx] : qEs.options[idx];
};
