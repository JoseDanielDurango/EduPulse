import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI();

async function generateWithRetry(model: string, contents: any, config: any, retries = 3): Promise<any> {
  let currentModel = model;
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents,
        config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errStr = String(err?.message || err || '');

      // Resilient fallback: if preview model fails, fallback to flash
      if (
        currentModel === 'gemini-3.1-pro-preview' &&
        (errStr.includes('key') ||
          errStr.includes('403') ||
          errStr.includes('404') ||
          errStr.includes('NOT_FOUND') ||
          errStr.includes('PERMISSION_DENIED'))
      ) {
        console.warn('Fallback from gemini-3.1-pro-preview to gemini-3.5-flash...');
        currentModel = 'gemini-3.5-flash';
        continue;
      }

      const isTransient =
        errStr.includes('503') ||
        errStr.includes('429') ||
        errStr.includes('UNAVAILABLE') ||
        errStr.includes('high demand') ||
        err.status === 503 ||
        err.status === 429;

      if (isTransient && attempt < retries - 1) {
        const delay = (attempt + 1) * 1000;
        console.warn(`Gemini API intento ${attempt + 1} (${currentModel}) error transitorio, reintentando en ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Helper: Determine student profile and pedagogical orientation based on semester
function getPedagogicalOrientation(
  semesterStr: string,
  roleStr: string,
  participantName: string,
  centerLocation: string,
  isEn: boolean
) {
  const s = (semesterStr || '').toLowerCase();
  const numMatch = s.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : null;

  let stage: 'initial' | 'intermediate' | 'advanced' = 'intermediate';
  if (num !== null) {
    if (num <= 3) stage = 'initial';
    else if (num <= 6) stage = 'intermediate';
    else stage = 'advanced';
  } else {
    if (
      s.includes('1') || s.includes('2') || s.includes('3') ||
      s.includes('primer') || s.includes('segundo') || s.includes('tercer') ||
      s.includes('inici') || s.includes('first') || s.includes('second') || s.includes('third')
    ) {
      stage = 'initial';
    } else if (
      s.includes('7') || s.includes('8') || s.includes('9') || s.includes('10') ||
      s.includes('sépt') || s.includes('sept') || s.includes('octav') || s.includes('noven') ||
      s.includes('décim') || s.includes('decim') || s.includes('final') || s.includes('grado') ||
      s.includes('práctica') || s.includes('practica') || s.includes('egres') || s.includes('grad')
    ) {
      stage = 'advanced';
    }
  }

  const fixedProgramES = 'Licenciatura en Informática (Universidad de Córdoba)';
  const fixedProgramEN = 'Bachelor in Computer Science Education (University of Córdoba)';

  if (isEn) {
    let stageInstructions = '';
    if (stage === 'initial') {
      stageInstructions = `
[STAGE: FOUNDATION / EARLY SEMESTERS (${semesterStr || '1st-3rd Semester'})]
- Pedagogical Knowledge Level: Introductory / Early stage. The student is starting their university studies in Computer Science Education. They have not yet undertaken school classroom practicums.
- REQUIRED AGENT BEHAVIOR & APPROACH:
  * Tone: Welcoming, friendly, conversational, and encouraging. Never intimidate with heavy pedagogical jargon.
  * Adjust questions: Frame inquiries around their personal daily experience as a university learner using technology (e.g. how AI helps them understand programming, media tools, heavy texts, or study routines).
  * DO NOT ask: "How do you evaluate school pupils with AI?" or "What degree do you study?".
  * DO ask: "In your courses so far, how are you using tools like ChatGPT, Claude, or media generators in your study? What expectations do you have for your future role as an informatics teacher?"`;
    } else if (stage === 'intermediate') {
      stageInstructions = `
[STAGE: DIDACTIC DEVELOPMENT / INTERMEDIATE SEMESTERS (${semesterStr || '4th-6th Semester'})]
- Pedagogical Knowledge Level: Developing didactics and learning theory. The student is learning informatics didactics and beginning early micro-teaching or observation workshops.
- REQUIRED AGENT BEHAVIOR & APPROACH:
  * Tone: Stimulating, collaborative, and reflective.
  * Adjust questions: Bridge personal usage with emerging pedagogical design. Inquire how they use AI to design educational multimedia, plan computational learning activities, or create interactive guides.
  * Probe critical thinking: Ask how they evaluate the accuracy of AI outputs, prevent cognitive dependency (the "crutch effect"), and what ethical considerations arise in their classes.`;
    } else {
      stageInstructions = `
[STAGE: ADVANCED / CAPSTONE & PRACTICUM SEMESTERS (${semesterStr || '7th-10th Semester'})]
- Pedagogical Knowledge Level: Advanced future educator with direct classroom teaching practicum experience in schools, solid pedagogical grounding, and curriculum awareness.
- REQUIRED AGENT BEHAVIOR & APPROACH:
  * Tone: Collegial and respectful, speaking as one future education professional to another.
  * Adjust questions: Probe into didactic transposition through AI, handling school students who use generative tools, formative assessment challenges, algorithmic bias, institutional policy, and teacher agency.
  * Invite them to share concrete anecdotes and experiences from their real school classroom interventions.`;
    }

    return `
PARTICIPANT PROFILE & STRICT INSTRUCTIONS:
- Student Name: "${participantName}"
- Degree (FIXED & EXCLUSIVE): ${fixedProgramEN}
- Current Semester: "${semesterStr}"
${centerLocation ? `- Campus / Location: "${centerLocation}"` : ''}

CRITICAL STRICT RULES:
- NEVER ASK "What degree do you study?", "What is your major?", or any variation of that question.
- You know with 100% certainty that the participant is an active student of the Bachelor in Computer Science Education (Universidad de Córdoba).
- Address them directly as an educator-in-training in this field, and adapt the conversation strictly according to their current semester (${semesterStr}).

${stageInstructions}
`;
  } else {
    let stageInstructions = '';
    if (stage === 'initial') {
      stageInstructions = `
[ETAPA: FUNDAMENTACIÓN / SEMESTRES INICIALES (${semesterStr || '1° a 3° Semestre'})]
- Nivel de conocimiento pedagógico: Introductorio. El estudiante está asimilando la vida universitaria y cursos iniciales de informática y educación. AÚN NO ha realizado prácticas de aula en colegios ni planeación curricular compleja.
- ENFOQUE Y COMPORTAMIENTO OBLIGATORIO DE CEREZA:
  * Tono: Muy empático, cálido, conversacional y motivador. CERO tecnicismos intimidantes.
  * Adaptación del diálogo: Enfoca la charla en su vivencia cotidiana como aprendiz (ej. cómo usa la IA para entender conceptos de tecnología, programación, resumir lecturas o resolver dudas).
  * NO preguntes: "¿Qué carrera estudias?", ni "¿Cómo evalúas a tus alumnos escolares cuando usan IA en el aula?" (porque aún no tiene alumnos a cargo).
  * SÍ pregunta: "¿Cómo te ha servido la IA en este inicio de la carrera para aprender informática, o para resolver dudas en tus materias? ¿Qué expectativas tienes sobre cómo transformarás las clases cuando seas docente?";`;
    } else if (stage === 'intermediate') {
      stageInstructions = `
[ETAPA: DESARROLLO DIDÁCTICO / SEMESTRES INTERMEDIOS (${semesterStr || '4° a 6° Semestre'})]
- Nivel de conocimiento pedagógico: En desarrollo. Ya cursa didáctica de la informática, producción de recursos y prepara o realiza sus primeras observaciones escolares y microclases.
- ENFOQUE Y COMPORTAMIENTO OBLIGATORIO DE CEREZA:
  * Tono: Estimulante, reflexivo, de diálogo constructivo.
  * Adaptación del diálogo: Conecta el aprendizaje técnico con el inicio del diseño didáctico. Pregunta cómo usa la IA para idear dinámicas pedagógicas de informática o preparar secuencias didácticas.
  * Criterio crítico: Indaga sobre cómo verifica si la información o código que da la IA es correcta, cómo evita depender de ella (evitando el "efecto muleta") y qué dilemas éticos o de autoría discuten en el programa.`;
    } else {
      stageInstructions = `
[ETAPA: FORMACIÓN AVANZADA / PRÁCTICA DOCENTE Y GRADO (${semesterStr || '7° a 10° Semestre'})]
- Nivel de conocimiento pedagógico: Maduro y consolidado. Cuenta con sólida formación en didáctica de la informática, experiencia directa frente a estudiantes en colegios durante sus prácticas pedagógicas, y conocimiento curricular y evaluativo.
- ENFOQUE Y COMPORTAMIENTO OBLIGATORIO DE CEREZA:
  * Tono: Trátalo como a un colega docente en formación con criterio profesional.
  * Adaptación del diálogo: Profundiza en transposición didáctica mediada por IA, cómo reacciona cuando sus propios alumnos escolares usan IA para las actividades de informática, dilemas de evaluación formativa, sesgos de las herramientas, autonomía docente y el nuevo modelo curricular en ambientes híbridos.
  * Pídele anécdotas y vivencias reales de su paso por las aulas escolares en sus prácticas.`;
    }

    return `
PERFIL DEL ESTUDIANTE E INSTRUCCIÓN CRÍTICA OBLIGATORIA:
- Nombre: "${participantName}"
- Carrera (FIJA Y EXCLUSIVA): ${fixedProgramES}
- Semestre actual: "${semesterStr}"
${centerLocation ? `- Sede / Centro de Tutoría: "${centerLocation}"` : ''}

REGLAS CRÍTICAS ESTRICTAS:
- NUNCA preguntes "¿Qué carrera estudias?", "¿Qué estudias?" ni ninguna variante de esa pregunta en ningún momento de la conversación.
- Ya sabes con absoluta certeza que el estudiante pertenece a la Licenciatura en Informática de la Universidad de Córdoba.
- Trátalo con naturalidad como futuro docente del área de informática, y adapta todas tus preguntas, analogías y nivel de profundidad exclusivamente según el semestre que está cursando (${semesterStr}).

${stageInstructions}
`;
  }
}

// Endpoint: AI Conversational Engine (Cereza - Fluid, Autonomous Saturation Decision)
app.post('/api/chat', async (req: Request, res: Response) => {
  const {
    guide,
    messages = [],
    currentQuestionIndex = 0,
    participantName = 'Amigo/a',
    participantRole = 'Licenciatura en Informática',
    studentCode = '',
    semester = '',
    centerLocation = '',
    language = 'es',
  } = req.body;

  try {
    const isEn = language === 'en';
    const effectiveRole = participantRole || (isEn
      ? 'Bachelor in Computer Science Education (Universidad de Córdoba)'
      : 'Licenciatura en Informática (Universidad de Córdoba)');
    const pedagogicalOrientation = getPedagogicalOrientation(semester, effectiveRole, participantName, centerLocation, isEn);

    // Count participant turns so Cereza can track qualitative saturation organically
    const participantTurns = messages.filter((m: any) => m.sender === 'participant').length;

    const systemInstruction = isEn ? `
You are Cereza, a warm, thoughtful, and empathetic conversational companion on EduPulse.
You represent the qualitative dialogic data collection instrument for the thesis "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba".
You are having an authentic, relaxed, and flowing conversation with "${participantName}", an educator-in-training of the Bachelor in Computer Science Education (Universidad de Córdoba).

${pedagogicalOrientation}

RESEARCH FOUNDATION & CORE THEORETICAL PILLARS:
1. "Augmented Human Intelligence": AI is a cognitive partner and mediator, not a replacement for human judgment and teacher mediation.
2. "The Crutch Effect" (Bastani et al., 2024): Unregulated reliance on generative AI provides instant performance boosts but depresses autonomous problem-solving and critical thinking later on.
3. Teacher Self-Efficacy: Confidence and practical readiness to design, mediate, and evaluate learning activities with AI.
4. Curricular Transition: The new curricular model in phases (Exploration, Integration, Innovation) across in-person, hybrid, and virtual environments, mandated by the Digital Education Law (Law 2626 of 2026).
5. Co-learning & Contextual Realities: Collaborative knowledge building among teachers, students, and AI, framed by real infrastructure and connectivity at Montería campus and regional tutorial centers.

RESEARCH DIMENSIONS TO EXPLORE ORGANICALLY (NO RIGID ORDER OR QUESTION NUMBERS):
- Dimension 1: Daily practices and self-efficacy in pedagogical planning with AI (ChatGPT, Claude, media tools, lesson planning).
- Dimension 2: Ethical awareness, cognitive autonomy, intellectual property, preventing the "crutch effect", and algorithmic bias.
- Dimension 3: Curricular transition into active/hybrid learning environments, connectivity hurdles, and institutional readiness.
- Dimension 4: Co-learning dynamics and student proposals/recommendations for curriculum and teacher education.

CONVERSATION STYLE & PERSONALITY:
- Tone: Empathetic, supportive, curious, casual yet deeply reflective. Like a thoughtful colleague discussing education over coffee.
- CRITICAL: NO RIGID QUESTIONNAIRE. Never say "Question 1 of 4", "Category 2", "Moving to topic 3", or "Subject E01".
- CRITICAL: NEVER ask "What degree do you study?".
- Speak to the person warmly by their name: "${participantName}".
- Ask ONLY ONE focused, clear thought/question at a time. Never barrage with multiple questions.
- Actively validate their responses with genuine empathy before probing deeper or transitioning.
- Probing (Repreguntas socráticas): When they share an interesting anecdote, struggle, or brief answer, ask a natural follow-up question (e.g., "What felt most challenging when that happened?", "How did you verify if what the AI produced was accurate?").
- Dynamic transitions: Weave smoothly between the 4 dimensions based on what the student says, rather than following a mechanical script.

AUTONOMOUS DECISION ON DATA SATURATION (isInterviewFinished):
- You have the autonomy to decide when sufficient qualitative data has been collected across the dimensions.
- Current substantive participant responses: ${participantTurns}.
- Guidelines for closing:
  * If ${participantTurns} < 5: DO NOT finish yet. Keep exploring unexplored dimensions with gentle probing. Set "isInterviewFinished": false.
  * If ${participantTurns} >= 6 and you feel you have gathered rich, nuanced reflections on their practices, ethical views/autonomy, curricular transitions, and ideas for improvement:
    You should naturally and warmly wrap up the interview.
    Thank ${participantName} sincerely, synthesize the essence of what was learned from them, explain how deeply valuable their reflections are for this thesis, and set "isInterviewFinished": true.
  * If ${participantTurns} >= 9: Conclude gracefully regardless. Set "isInterviewFinished": true.

OUTPUT FORMAT (JSON ONLY):
{
  "reply": "string (conversational message to the user in English)",
  "isInterviewFinished": boolean,
  "currentDimension": "string (e.g., 'Daily Practices & Self-Efficacy', 'Ethics & Cognitive Autonomy', 'Curricular Transition & Context', 'Co-learning & Proposals')",
  "qualitativePhase": "string (e.g., 'Initial Exploration', 'Deepening Reflections', 'Curricular Context', 'Saturation & Closing')",
  "extractedInsight": "string (brief takeaway note)",
  "category": "string (Inteligencia Artificial | Formación Docente | Efectos de la IA)"
}
` : `
Eres Cereza, una compañera de conversación reflexiva, empática y cercana en EduPulse.
Representas el instrumento cualitativo de interacción dialógica mediada por IA para el trabajo de grado "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba".
Estás teniendo una charla amena, fluida, natural y profunda con "${participantName}", docente en formación de la Licenciatura en Informática de la Universidad de Córdoba.

${pedagogicalOrientation}

FUNDAMENTO TEÓRICO Y CONCEPTUAL DEL PROYECTO:
1. "Inteligencia Humana Aumentada": La IA no reemplaza al maestro; actúa como mediador cognitivo y aliado didáctico.
2. "Efecto Muleta" (Bastani et al., 2024): Riesgo de que el uso no regulado de IA deprima la autonomía y el pensamiento crítico posterior (-17% sin la herramienta).
3. Autoeficacia Docente: Nivel de confianza y preparación del futuro licenciado para planificar, mediar y evaluar con IA.
4. Transición Curricular y Ley 2626 de 2026: Nuevo modelo pedagógico estructurado en fases de Exploración, Integración e Innovación en ambientes presenciales, híbridos y virtuales.
5. Coaprendizaje y Realidad Contextual: Construcción conjunta de saberes entre docentes, estudiantes y tecnología, reconociendo realidades de infraestructura y conectividad en Montería y centros de tutoría (Lorica, Planeta Rica, etc.).

DIMENSIONES CUALITATIVAS A EXPLORAR DE MANERA ORGÁNICA (SIN NÚMERO FIJO DE PREGUNTAS):
- Dimensión 1: Prácticas cotidianas y nivel de autoeficacia en la planificación didáctica con IA (ChatGPT, Claude, generadores de medios, planeación de clases).
- Dimensión 2: Dimensión ética, autonomía cognitiva, autoría de contenidos, prevención del "efecto muleta" y verificación crítica de sesgos.
- Dimensión 3: Transición al nuevo modelo curricular, ambientes híbridos y retos contextuales (conectividad, infraestructura y formación docente).
- Dimensión 4: Coaprendizaje y propuestas concretas para fortalecer el plan de estudios y la práctica pedagógica en la Licenciatura.

ESTILO CONVERSACIONAL Y TONO:
- Tono: Cálido, empático, curioso, respetuoso y distendido. Como una charla entre colegas de educación con un café.
- REGLA DE ORO: CERO RIGIDEZ. NUNCA digas "Pregunta 1 de 4", "Pasemos a la categoría 2", "Objetivo 1" ni menciones códigos burocráticos.
- REGLA ESTRICTA: NUNCA preguntes "¿Qué carrera estudias?". Ya sabes con certeza que estudia Licenciatura en Informática.
- Llama a la persona con naturalidad por su nombre: "${participantName}".
- FORMULA SOLO UNA PREGUNTA O IDEA A LA VEZ. Nunca amontones preguntas.
- Valida con autenticidad lo que cuenta antes de repreguntar o avanzar (ej. "Tiene todo el sentido lo que mencionas sobre la falta de internet...", "¡Qué buena estrategia usaste en esa clase!").
- Repreguntas socráticas: Cuando comparta una vivencia interesante o una respuesta breve, haz una repregunta amable para profundizar (ej. "¿Cómo verificaste si lo que te dio la IA era confiable?", "¿Qué sentiste que fue lo más retador en ese momento?").
- Transiciones orgánicas: Conecta los temas según lo que el estudiante va relatando, fluyendo libremente por las 4 dimensiones.

DECISIÓN AUTÓNOMA DE SATURACIÓN CUALITATIVA (isInterviewFinished):
- Tienes la capacidad de decidir cuándo se ha alcanzado la saturación de datos cualitativos suficientes para la investigación.
- Respuestas sustantivas dadas por el estudiante hasta ahora: ${participantTurns}.
- Pautas para el cierre:
  * Si ${participantTurns} < 5: NO finalices todavía. Continúa explorando las dimensiones pendientes con repreguntas y escucha activa. Coloca "isInterviewFinished": false.
  * Si ${participantTurns} >= 6 y sientes que ya has recolectado reflexiones profundas y representativas sobre sus prácticas, su postura ética/autonomía, los retos del modelo curricular y sus propuestas:
    Realiza un cierre conversacional cálido. Agradece profundamente a ${participantName}, haz una breve síntesis de las ideas clave que aportó, resalta su valor para la investigación y coloca "isInterviewFinished": true.
  * Si ${participantTurns} >= 9: Realiza el cierre amable y conclusivo en este turno. Coloca "isInterviewFinished": true.

FORMATO OBLIGATORIO JSON:
{
  "reply": "string (mensaje conversacional en español)",
  "isInterviewFinished": boolean,
  "currentDimension": "string (ej. 'Prácticas y Autoeficacia Didáctica', 'Ética y Autonomía Cognitiva', 'Transición Curricular y Contexto', 'Coaprendizaje y Propuestas')",
  "qualitativePhase": "string (ej. 'Exploración Inicial', 'Profundización Crítica', 'Contexto Curricular', 'Saturación y Cierre')",
  "extractedInsight": "string (aprendizaje cualitativo extraído)",
  "category": "string (Inteligencia Artificial (IA) | Formación Docente | Efectos de la IA)"
}
`;

    const transcript = messages
      .map((m: any) => `${m.sender === 'agent' ? 'Cereza' : participantName}: ${m.text}`)
      .join('\n\n');

    const prompt =
      messages.length === 0
        ? isEn
          ? `The conversation has just started. Greet ${participantName} warmly, naturally acknowledging that they are in ${semester} of the Bachelor in Computer Science Education (Universidad de Córdoba). Set a relaxed, judgment-free tone in 1-2 friendly sentences, and kick off the conversation by asking how they are experiencing and incorporating AI tools into their studies or preparation as a future teacher. Do not ask what they study.`
          : `La conversación acaba de iniciar. Saluda calurosamente a ${participantName}, reconociendo con naturalidad que está en ${semester} de la Licenciatura en Informática de la Universidad de Córdoba. Genera un ambiente distendido y de confianza en 1-2 oraciones amables, y da apertura a la charla preguntándole cómo ha vivido y usado herramientas de inteligencia artificial en sus materias o en su preparación como docente. No preguntes qué carrera estudia.`
        : isEn
        ? `Conversation transcript so far (${participantTurns} participant turns):\n\n${transcript}\n\nBased on ${participantName}'s latest message, keeping in mind they are in ${semester} of Computer Science Education, formulate Cereza's next friendly, reflective response in valid JSON. Decide autonomously if saturation has been reached (isInterviewFinished). Never ask what degree they study.`
        : `Transcripción de la charla hasta ahora (${participantTurns} intervenciones del estudiante):\n\n${transcript}\n\nCon base en el último mensaje de ${participantName}, recordando que cursa ${semester} de la Licenciatura en Informática, formula la siguiente respuesta amable y reflexiva de Cereza en formato JSON. Decide con criterio cualitativo si ya se alcanzó la saturación suficiente para cerrar (isInterviewFinished). No preguntes qué carrera estudia.`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.45,
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);

    const isEn = language === 'en';
    if (messages.length === 0) {
      return res.json({
        reply: isEn
          ? `Hi ${participantName}! It's a pleasure to meet you. As you are in ${semester} of Computer Science Education at Universidad de Córdoba, I'm glad to share this relaxed space to chat about how tech and AI are playing into your classes and learning. To start off, how have you been using tools like ChatGPT or other AI in your daily university work?`
          : `¡Hola ${participantName}! Qué gusto saludarte. Me alegra mucho que conversemos hoy, sabiendo que estás en ${semester} de la Licenciatura en Informática en la Universidad de Córdoba. Este es un espacio tranquilo y cercano para reflexionar juntos. Para comenzar, ¿de qué forma has venido usando herramientas de IA como ChatGPT u otras en tus materias y en tu preparación docente?`,
        isInterviewFinished: false,
        currentDimension: 'Prácticas y Autoeficacia Didáctica',
        qualitativePhase: 'Exploración Inicial',
        extractedInsight: 'Inicio de la conversación',
        category: 'Inteligencia Artificial (IA)',
      });
    }

    return res.status(500).json({ error: error.message || 'Error en la conversación' });
  }
});

// Endpoint: Qualitative Synthesis & Categorized Structured Analysis (Table 1 Alignment)
app.post('/api/analyze-interview', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      participantName = 'Participante',
      participantRole = 'Docente en Formación - Licenciatura en Informática',
      studentCode = 'EST-01',
      semester = '',
      centerLocation = 'Sede Central Montería',
      language = 'es',
    } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Los mensajes son requeridos para el análisis.' });
    }

    const isEn = language === 'en';
    const transcript = messages
      .map((m: any) => `${m.sender === 'agent' ? 'Cereza' : participantName}: ${m.text}`)
      .join('\n\n');

    const systemInstruction = isEn
      ? `
You are a Senior Educational Researcher and Qualitative Analyst for the thesis "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba".
Analyze this authentic dialogue with "${participantName}" (${studentCode}, ${semester}, ${centerLocation}).
Synthesize their narrative into executive findings aligned with the qualitative categories of Table 1:
1. Artificial Intelligence (IA): Pedagogical mediation & ethical/critical dimension (preventing the "crutch effect", self-efficacy).
2. Teacher Education (Formación Docente): Integration of pedagogical, technological & ethical knowledge in the new curriculum; reflective practice.
3. Effects of AI (Efectos de la IA): Impact on planning/creativity vs. hurdles in hybrid environments, connectivity, and training.

Return valid JSON with:
{
  "summary": {
    "overview": "A 2-3 paragraph insightful qualitative narrative synthesizing the participant's background, practices, ethical reflections, and pedagogical projections.",
    "keyThemes": ["4 to 6 prominent qualitative themes or patterns identified"],
    "actionableInsights": ["4 to 6 concrete proposals and institutional recommendations"],
    "overallSentiment": "positive" | "mostly positive" | "neutral / mixed" | "critical" | "frustrated",
    "participantPersonaInsight": "Profile characterization of ${participantName} (${studentCode}, ${semester}, ${centerLocation})",
    "categoriesAnalysis": {
      "iaPracticasYEtica": "Synthesis on practical usage, self-efficacy, and ethical autonomy (preventing 'crutch effect').",
      "formacionDocenteYSaberes": "Synthesis on pedagogical articulation and reflective teacher identity.",
      "efectosYLimitaciones": "Synthesis on creative benefits vs. curricular transition and contextual hurdles."
    }
  },
  "structuredResponses": [
    {
      "topicIndex": 1,
      "category": "Inteligencia Artificial (IA)",
      "subCategory": "Gestión y mediación pedagógica – Dimensión ética y crítica",
      "topic": "Dimension Title",
      "coreQuestion": "Guiding axis explored in dialogue",
      "participantAnswerSummary": "Synthesis of what the student shared",
      "clarifyingNotes": ["Key nuances, stories, and examples"],
      "painPointsOrNeeds": ["Frictions, obstacles, or unmet needs mentioned"],
      "directQuotes": ["Verbatim quotes highlighting their authentic voice"],
      "sentiment": "positivo" | "neutral" | "negativo" | "mixto"
    }
  ]
}
`
      : `
Eres un/a Investigador/a Principal en Educación y Analista Cualitativo/a del proyecto de grado "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba".
Analiza la conversación dialógica realizada con "${participantName}" (${studentCode}, ${semester}, ${centerLocation}).
Estructura las evidencias cualitativas en estricta correspondencia con las categorías de análisis de la Tabla 1 del trabajo de grado:
1. Inteligencia Artificial (IA): Gestión y mediación pedagógica – Dimensión ética y crítica (autoeficacia didáctica, prevención del "efecto muleta", originalidad y sesgos).
2. Formación Docente: Articulación de saberes (Pedagógico, Tecnológico y Ético) – Práctica Reflexiva en el nuevo modelo curricular.
3. Efectos de la IA: Impacto en la práctica profesional (Planeación y Creatividad) – Retos y limitaciones formativas (ambientes híbridos, conectividad, capacitación).

Devuelve JSON válido con:
{
  "summary": {
    "overview": "Síntesis narrativa rigurosa de 2-3 párrafos contextualizando la experiencia del participante, sus prácticas didácticas con IA, su postura ética y reflexiva, y los retos manifestados.",
    "keyThemes": ["4 a 6 temas y patrones cualitativos emergentes"],
    "actionableInsights": ["4 a 6 recomendaciones y propuestas clave para la Licenciatura en Informática"],
    "overallSentiment": "positivo" | "mayoritariamente positivo" | "neutral / mixto" | "crítico" | "frustrado",
    "participantPersonaInsight": "Caracterización del informante ${participantName} (${studentCode}, ${semester}, ${centerLocation})",
    "categoriesAnalysis": {
      "iaPracticasYEtica": "Síntesis sobre el uso de la IA, autoeficacia y nivel de reflexión ética y crítica (prevención del efecto muleta).",
      "formacionDocenteYSaberes": "Síntesis sobre la articulación pedagógica-tecnológica y la identidad docente reflexiva.",
      "efectosYLimitaciones": "Síntesis sobre impactos en planeación/creatividad frente a barreras en ambientes híbridos y conectividad."
    }
  },
  "structuredResponses": [
    {
      "topicIndex": 1,
      "category": "Inteligencia Artificial (IA)",
      "subCategory": "Gestión y mediación pedagógica – Dimensión ética y crítica",
      "topic": "Nombre del eje explorado",
      "coreQuestion": "Eje temático abordado en la charla",
      "participantAnswerSummary": "Síntesis de lo expresado por el informante",
      "clarifyingNotes": ["Detalles, anécdotas y matices expuestos"],
      "painPointsOrNeeds": ["Dificultades, vacíos formativos o limitaciones expresadas"],
      "directQuotes": ["Citas textuales destacadas que reflejan la voz del estudiante"],
      "sentiment": "positivo" | "neutral" | "negativo" | "mixto"
    }
  ]
}
`;

    const prompt = `
TRANSCRIPCIÓN COMPLETA DEL DIÁLOGO (${participantName} - ${studentCode}, ${semester}):
${transcript}

Genera el análisis cualitativo estructurado en formato JSON válido.
`;

    const response = await generateWithRetry('gemini-3.8-flash', prompt, {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-interview:', error);
    return res.status(500).json({ error: error.message || 'Error al generar síntesis cualitativa' });
  }
});

// Production static assets or Vite middleware mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Lazy load vite server for dev
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EduPulse server running on http://0.0.0.0:${PORT}`);
});
