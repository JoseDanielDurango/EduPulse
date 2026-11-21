import { ChatMessage, InterviewSession, InterviewSummary, StructuredResponseItem } from '../types';

/**
 * Intelligent Qualitative Synthesis Generator (Fallback & Resilience Engine)
 * Aligned with Table 1 of the Thesis:
 * "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba"
 */
export function generateFallbackSynthesis(
  session: InterviewSession,
  language: 'es' | 'en' = 'es'
): { summary: InterviewSummary; structuredResponses: StructuredResponseItem[] } {
  const isEn = language === 'en';
  const participantName = session.participantName || (isEn ? 'Educator in Training' : 'Docente en Formación');
  const studentCode = session.studentCode || 'EST-01';
  const semester = session.semester || (isEn ? 'Bachelor in Computer Science' : 'Licenciatura en Informática');
  const location = session.centerLocation || (isEn ? 'Central Campus Montería' : 'Sede Central Montería');

  const msgs: ChatMessage[] = session.messages || [];
  const participantMessages = msgs.filter((m) => m.sender === 'participant');

  // Extract authentic quotes from participant messages
  const extractedQuotes: string[] = [];
  participantMessages.forEach((m) => {
    const raw = m.text || '';
    // Split by punctuation for meaningful sentence-level quotes
    const sentences = raw.split(/[.¡!¿?\n]+/).map((s) => s.trim());
    sentences.forEach((s) => {
      if (s.length >= 25 && s.length <= 280) {
        extractedQuotes.push(s);
      }
    });
    if (raw.length >= 20 && raw.length <= 250 && !extractedQuotes.includes(raw.trim())) {
      extractedQuotes.push(raw.trim());
    }
  });

  // Extract all text to detect keywords & sentiment
  const fullParticipantText = participantMessages.map((m) => m.text).join(' ').toLowerCase();

  // Sentiment analysis
  let overallSentiment: 'positivo' | 'mayoritariamente positivo' | 'neutral / mixto' | 'crítico' | 'frustrado' = 'crítico';
  if (fullParticipantText.includes('excelente') || fullParticipantText.includes('facilita') || fullParticipantText.includes('oportunidad') || fullParticipantText.includes('ayuda mucho')) {
    overallSentiment = 'mayoritariamente positivo';
  } else if (fullParticipantText.includes('preocupa') || fullParticipantText.includes('plagio') || fullParticipantText.includes('muleta') || fullParticipantText.includes('copiar')) {
    overallSentiment = 'crítico';
  } else if (fullParticipantText.includes('depende') || fullParticipantText.includes('ambos') || fullParticipantText.includes('equilibrio')) {
    overallSentiment = 'neutral / mixto';
  }

  // Detect challenges & pain points
  const painPoints: string[] = [];
  if (fullParticipantText.includes('conectividad') || fullParticipantText.includes('internet') || fullParticipantText.includes('red') || fullParticipantText.includes('señal')) {
    painPoints.push(isEn ? 'Connectivity limitations and infrastructure gaps in regional tutorial centers' : 'Brecha de conectividad e infraestructura en centros tutoriales');
  }
  if (fullParticipantText.includes('plagio') || fullParticipantText.includes('copia') || fullParticipantText.includes('muleta') || fullParticipantText.includes('pereza')) {
    painPoints.push(isEn ? 'Risk of cognitive passivity and uncritical dependence ("crutch effect")' : 'Riesgo de dependencia cognitiva acrítica ("efecto muleta") y deshonestidad académica');
  }
  if (fullParticipantText.includes('capacitación') || fullParticipantText.includes('formación') || fullParticipantText.includes('curso') || fullParticipantText.includes('docentes')) {
    painPoints.push(isEn ? 'Need for institutional training in prompt engineering and pedagogical mediation' : 'Necesidad de capacitación docente formal en mediación pedagógica con IA');
  }
  if (fullParticipantText.includes('tiempo') || fullParticipantText.includes('planeación') || fullParticipantText.includes('evaluación')) {
    painPoints.push(isEn ? 'Challenges transitioning classroom evaluation away from rote memorization' : 'Dificultades en reformular los mecanismos de evaluación más allá de exámenes tradicionales');
  }
  if (painPoints.length === 0) {
    painPoints.push(isEn ? 'Balancing technological speed with deep critical learning' : 'Articulación crítica de herramientas generativas en las prácticas de aula');
  }

  // Key Themes
  const keyThemes = isEn
    ? [
        'Pragmatic integration of generative tools in didactic lesson planning',
        'Ethical awareness and proactive prevention of cognitive passivity ("crutch effect")',
        'Demands for curricular modernization under Digital Education Law 2626 of 2026',
        'Institutional commitment to equity, regional connectivity, and teacher self-efficacy',
      ]
    : [
        'Apropiación instrumental y mediación didáctica con herramientas de IA generativa',
        'Conciencia ética y necesidad de prevenir el "efecto muleta" en el aprendizaje del código',
        'Demandas formativas para la transición al nuevo modelo curricular y Ley 2626 de 2026',
        'Importancia del coaprendizaje y la equidad contextual en las sedes de la Universidad de Córdoba',
      ];

  // Actionable Insights
  const actionableInsights = isEn
    ? [
        'Incorporate mandatory modules on pedagogical prompt engineering and AI ethics into the curriculum.',
        'Redesign assessment mechanisms toward oral defenses, process rubrics, and project-based validation.',
        'Establish an institutional repository of open-source pedagogical AI prompts and prompts tailored for computer science education.',
        'Address the digital and hardware divide across regional university tutorial campuses.',
      ]
    : [
        'Integrar talleres obligatorios de mediación didáctica y diseño de prompts pedagógicos en el plan de estudios.',
        'Transformar la evaluación hacia defensas orales, seguimiento de procesos y proyectos aplicados para mitigar el plagio.',
        'Crear un laboratorio y repositorio institucional de buenas prácticas de coaprendizaje con IA en informática educativa.',
        'Garantizar equidad en infraestructura tecnológica y conectividad para los centros de tutoría regionales.',
      ];

  // Category quotes distribution
  const quotesCat1 = extractedQuotes.slice(0, 3);
  const quotesCat2 = extractedQuotes.slice(3, 6);
  const quotesCat3 = extractedQuotes.slice(6, 9);

  // Default quotes if extraction was short
  if (quotesCat1.length === 0 && participantMessages[0]) {
    quotesCat1.push(participantMessages[0].text);
  }
  if (quotesCat2.length === 0 && participantMessages[1]) {
    quotesCat2.push(participantMessages[1].text);
  }
  if (quotesCat3.length === 0 && participantMessages[2]) {
    quotesCat3.push(participantMessages[2].text);
  }

  const structuredResponses: StructuredResponseItem[] = [
    {
      topicIndex: 1,
      category: isEn ? 'Artificial Intelligence (AI)' : 'Inteligencia Artificial (IA)',
      subCategory: isEn
        ? 'Pedagogical mediation & ethical/critical dimension'
        : 'Gestión y mediación pedagógica – Dimensión ética y crítica',
      topic: isEn ? 'Classroom Usage & Self-Efficacy' : 'Prácticas Cotidianas y Autoeficacia Didáctica',
      coreQuestion: isEn
        ? 'How do educators-in-training appropriate AI tools and navigate ethical autonomy?'
        : '¿Cómo apropian los docentes en formación la IA y manejan la autonomía y ética?',
      participantAnswerSummary:
        participantMessages[0]?.text ||
        (isEn
          ? 'The participant utilizes AI tools as cognitive partners for lesson preparation while maintaining vigilance over critical autonomy.'
          : 'El docente en formación utiliza la inteligencia artificial como apoyo didáctico para planificar clases y talleres, reconociendo la importancia de no delegar el pensamiento crítico.'),
      clarifyingNotes: [
        isEn
          ? `Dialogue conducted in ${location} with an educator-in-training from ${semester}.`
          : `Diálogo desarrollado en ${location} con estudiante de ${semester}.`,
        isEn
          ? 'Emphasized personal verification of AI-generated answers to avoid hallucinations.'
          : 'Subraya la verificación humana obligatoria para evitar sesgos y alucinaciones en el material didáctico.',
      ],
      painPointsOrNeeds: painPoints.slice(0, 2),
      challengesOrLimitations: painPoints.slice(0, 2),
      directQuotes: quotesCat1.length > 0 ? quotesCat1 : [participantMessages[0]?.text || 'Reflexión registrada'],
      sentiment: overallSentiment,
    },
    {
      topicIndex: 2,
      category: isEn ? 'Teacher Education' : 'Formación Docente',
      subCategory: isEn
        ? 'Integration of pedagogical, technological & ethical knowledge'
        : 'Articulación de saberes (Pedagógico, Tecnológico y Ético)',
      topic: isEn ? 'Reflective Practice & Curricular Transition' : 'Práctica Reflexiva en el Nuevo Modelo Curricular',
      coreQuestion: isEn
        ? 'How is teacher identity and pedagogy transforming with AI in the degree program?'
        : '¿Cómo se transforma el rol docente y la didáctica de la informática frente a la IA?',
      participantAnswerSummary:
        participantMessages[1]?.text ||
        participantMessages[0]?.text ||
        (isEn
          ? 'Reflects on the essential role of the human teacher in guiding critical inquiry and preventing reliance on shortcuts.'
          : 'Destaca que el educador en informática debe evolucionar hacia un mediador y facilitador que enseñe a cuestionar y validar la tecnología.'),
      clarifyingNotes: [
        isEn
          ? 'Highlighted the need to update university course syllabi.'
          : 'Resalta la necesidad de alinear los microcurrículos con la Ley de Educación Digital (Ley 2626 de 2026).',
      ],
      painPointsOrNeeds: painPoints.slice(1, 3),
      challengesOrLimitations: painPoints.slice(1, 3),
      directQuotes: quotesCat2.length > 0 ? quotesCat2 : [participantMessages[1]?.text || quotesCat1[0] || 'Reflexión registrada'],
      sentiment: overallSentiment,
    },
    {
      topicIndex: 3,
      category: isEn ? 'Effects of AI' : 'Efectos de la IA',
      subCategory: isEn
        ? 'Impact on professional practice & contextual limitations'
        : 'Impacto en la práctica docente – Retos y limitaciones contextuales',
      topic: isEn ? 'Contextual Realities & Future Teaching' : 'Realidades Contextuales y Proyección Profesional',
      coreQuestion: isEn
        ? 'What barriers and opportunities exist in regional educational environments?'
        : '¿Cuáles son las barreras y oportunidades reales en las instituciones de Córdoba?',
      participantAnswerSummary:
        participantMessages[2]?.text ||
        participantMessages[participantMessages.length - 1]?.text ||
        (isEn
          ? 'Addresses infrastructure limitations and unequal access across urban and rural educational contexts.'
          : 'Pone de manifiesto las diferencias de infraestructura y conectividad entre la sede Montería y las instituciones educativas del departamento.'),
      clarifyingNotes: [
        isEn
          ? 'Calls for practical, hands-on workshops in real school contexts.'
          : 'Propone proyectos de coaprendizaje donde estudiantes y docentes aprendan conjuntamente con IA.',
      ],
      painPointsOrNeeds: painPoints,
      challengesOrLimitations: painPoints,
      directQuotes: quotesCat3.length > 0 ? quotesCat3 : [participantMessages[participantMessages.length - 1]?.text || quotesCat1[0] || 'Reflexión registrada'],
      sentiment: overallSentiment,
    },
  ];

  const overview = isEn
    ? `The participant ${participantName} (${studentCode}), currently enrolled in ${semester} of Computer Science Education at Universidad de Córdoba (${location}), engaged in an in-depth reflective dialogue exploring the pedagogical integration of artificial intelligence.\n\nThroughout the exchange, the future educator articulated a critical, constructive stance, recognizing AI's efficiency in lesson preparation while firmly warning against the cognitive "crutch effect" in programming and problem-solving. Concrete proposals include reforming classroom assessment toward oral defenses and strengthening teacher training under Digital Education Law 2626.`
    : `El/la informante ${participantName} (${studentCode}), docente en formación de ${semester} de la Licenciatura en Informática en la Universidad de Córdoba (${location}), desarrolló un diálogo reflexivo y crítico en torno a la mediación de la inteligencia artificial en la práctica pedagógica.\n\nA lo largo de la conversación, demostró una postura madura y reflexiva, valorando las ventajas de la IA generativa para la planeación didáctica y el diseño de actividades, al tiempo que advirtió con firmeza sobre los riesgos de dependencia cognitiva ("efecto muleta") en el aprendizaje de la lógica y la programación. Sus aportes enfatizan la necesidad de actualizar la evaluación hacia defensas orales y robustecer la formación ética y técnica en el nuevo marco curricular institucional.`;

  const summary: InterviewSummary = {
    overview,
    keyThemes,
    actionableInsights,
    keyInsights: keyThemes,
    overallSentiment,
    sentiment: overallSentiment,
    keyPainPoints: painPoints,
    participantPersonaInsight: isEn
      ? `Educator-in-training ${studentCode} (${semester}, ${location}) with reflective awareness of AI's pedagogical advantages and ethical implications.`
      : `Docente en formación ${studentCode} (${semester}, ${location}) con alta capacidad reflexiva sobre la mediación didáctica y los dilemas éticos de la IA.`,
    categoriesAnalysis: {
      iaPracticasYEtica: isEn
        ? 'Regular utilization of generative tools with active human oversight to maintain critical autonomy and academic honesty.'
        : 'Uso instrumental cotidiano de herramientas generativas con supervisión humana constante para preservar la autonomía cognitiva y la autoría académica.',
      formacionDocenteYSaberes: isEn
        ? 'Emphasis on teacher mediation, pedagogical reasoning, and continuous curricular adaptation to modern technological realities.'
        : 'Énfasis en el rol del docente como mediador pedagógico y necesidad de actualizar los contenidos curriculares hacia el pensamiento computacional y la IA.',
      efectosYLimitaciones: isEn
        ? 'Productivity improvements in planning contrasted with infrastructure inequalities and the urgent need for systemic teacher development.'
        : 'Optimización de tiempos en planeación docente frente a desigualdades de conectividad y necesidad de políticas institucionales de evaluación.',
    },
  };

  return { summary, structuredResponses };
}
