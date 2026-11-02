import { InterviewGuide } from '../types';

export const DEFAULT_GUIDES: InterviewGuide[] = [
  {
    id: 'dialogo-cualitativo-unicordoba-ia',
    title: 'Diálogo Reflexivo sobre Inteligencia Artificial en la Formación Docente',
    description:
      'Interacción dialógica mediada por IA para recolectar las experiencias, desafíos y perspectivas de los docentes en formación de la Licenciatura en Informática (Universidad de Córdoba).',
    targetPersona: 'Docentes en formación del programa de Licenciatura en Informática',
    institutionalContext: 'Universidad de Córdoba - Montería, Colombia',
    researchGoals: [
      'Identificar las prácticas actuales y el nivel de autoeficacia de los docentes en formación en el uso de la IA para la planificación y diseño didáctico.',
      'Describir percepciones y vivencias sobre dilemas éticos, autonomía cognitiva, prevención del "efecto muleta" y originalidad de contenidos.',
      'Evaluar los retos en la transición hacia enfoques de aprendizaje activo y ambientes híbridos según el rediseño curricular y la Ley 2626 de 2026.',
      'Recoger propuestas y recomendaciones fundamentadas para fortalecer la apropiación crítica y el coaprendizaje con IA en el programa.',
    ],
    isTemplate: true,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'dim-1',
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Gestión y mediación pedagógica – Autoeficacia didáctica',
        topic: 'Prácticas Cotidianas y Autoeficacia en la Planificación Didáctica',
        question:
          '¿De qué manera estás incorporando herramientas de inteligencia artificial en tus materias y en tu preparación como futuro docente, y qué tanta confianza o autoeficacia sientes al planear actividades formativas con su apoyo?',
        probingTips:
          'Pregunta qué herramientas concretas utiliza (ChatGPT, Claude, generadores de medios, etc.), en qué asignaturas y cómo concibe la IA como apoyo sin sustituir la mediación pedagógica.',
        objectiveLink: 'Objetivo Específico 1: Prácticas actuales y autoeficacia en diseño didáctico.',
      },
      {
        id: 'dim-2',
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Dimensión ética y crítica – Autonomía cognitiva',
        topic: 'Dilemas Éticos, Autonomía Cognitiva y Prevención del "Efecto Muleta"',
        question:
          'Al apoyarte en la IA para estudiar o diseñar clases, ¿cómo manejas dilemas éticos como la autoría, los sesgos algorítmicos y el riesgo de depender excesivamente de la herramienta (el llamado "efecto muleta")?',
        probingTips:
          'Indaga si verifica críticamente lo que entrega la IA, si en el programa se debaten estos dilemas y cómo cuida su propia autonomía de pensamiento y la de sus futuros alumnos.',
        objectiveLink: 'Objetivo Específico 2: Dilemas éticos, autonomía cognitiva y pensamiento crítico.',
      },
      {
        id: 'dim-3',
        category: 'Formación Docente',
        subCategory: 'Articulación de saberes y transición curricular en ambientes híbridos',
        topic: 'Transición Curricular, Ambientes Híbridos y Realidad Contextual',
        question:
          'Frente al nuevo modelo curricular de la Licenciatura (fases de exploración, integración e innovación) y la Ley de Educación Digital (Ley 2626 de 2026), ¿qué retos has enfrentado en ambientes presenciales o híbridos, considerando las condiciones de conectividad e infraestructura en la universidad y en las sedes?',
        probingTips:
          'Profundiza en la articulación de saberes pedagógicos y tecnológicos, la preparación de los docentes formadores y las realidades contextuales de Montería o centros de tutoría.',
        objectiveLink: 'Objetivo Específico 3: Retos en la transición hacia el nuevo modelo curricular.',
      },
      {
        id: 'dim-4',
        category: 'Efectos de la IA',
        subCategory: 'Coaprendizaje y propuestas transformadoras',
        topic: 'Coaprendizaje y Recomendaciones para Fortalecer la Licenciatura',
        question:
          'Pensando en el coaprendizaje entre docentes, estudiantes e inteligencia artificial, ¿qué recomendaciones concretas propondrías a la Universidad de Córdoba y al programa de Licenciatura en Informática para consolidar una formación crítica y transformadora?',
        probingTips:
          'Invita a proponer talleres, adecuaciones curriculares, laboratorios maker, directrices éticas claras o acompañamiento a la práctica pedagógica.',
        objectiveLink: 'Objetivo Específico 4: Propuestas y recomendaciones fundamentadas.',
      },
    ],
  },
];
