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

      // Resilient fallback: if complex model gemini-3.1-pro-preview fails due to key or quota, use gemini-3.5-flash
      if (currentModel === 'gemini-3.1-pro-preview' && (errStr.includes('key') || errStr.includes('403') || errStr.includes('404') || errStr.includes('NOT_FOUND') || errStr.includes('PERMISSION_DENIED'))) {
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

// Helper: Determine student profile and pedagogical orientation based on semester and degree
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

  const fixedProgramES = 'Licenciatura en Informática con Énfasis en Medios Audiovisuales (Universidad de Córdoba)';
  const fixedProgramEN = 'Bachelor in Computer Science Education & Audiovisual Media (University of Córdoba)';

  if (isEn) {
    let stageInstructions = '';
    if (stage === 'initial') {
      stageInstructions = `
[STAGE: FOUNDATION / EARLY SEMESTERS (${semesterStr || '1st-3rd Semester'})]
- Pedagogical Knowledge Level: Introductory / Early stage. The student is starting their university studies in Computer Science & Audiovisual Media Education. They have not yet undertaken school classroom practicums.
- REQUIRED AGENT BEHAVIOR & APPROACH:
  * Tone: Welcoming, friendly, conversational, and encouraging. Never intimidate with heavy pedagogical jargon.
  * Adjust questions: Frame inquiries around their personal daily experience as a university learner using technology (e.g. how AI helps them understand programming, media tools, heavy texts, design ideas, or study routines).
  * DO NOT ask: "How do you evaluate school pupils with AI?" or "What degree do you study?".
  * DO ask: "In your courses so far, how are you using tools like ChatGPT, Gemini, or media generators in your study? What expectations do you have for your future role as a computer science teacher?"`;
    } else if (stage === 'intermediate') {
      stageInstructions = `
[STAGE: DIDACTIC DEVELOPMENT / INTERMEDIATE SEMESTERS (${semesterStr || '4th-6th Semester'})]
- Pedagogical Knowledge Level: Developing didactics and learning theory. The student is learning informatics didactics, media pedagogy, and beginning early micro-teaching or observation workshops.
- REQUIRED AGENT BEHAVIOR & APPROACH:
  * Tone: Stimulating, collaborative, and reflective.
  * Adjust questions: Bridge personal usage with emerging pedagogical design. Inquire how they use AI to design educational multimedia, plan computational learning activities, or create audiovisual resources.
  * Probe critical thinking: Ask how they evaluate the accuracy of AI outputs in computer science, and what ethical considerations or intellectual property debates arise in their classes.`;
    } else {
      stageInstructions = `
[STAGE: ADVANCED / CAPSTONE & PRACTICUM SEMESTERS (${semesterStr || '7th-10th Semester'})]
- Pedagogical Knowledge Level: Advanced future educator with direct classroom teaching practicum experience in schools, solid pedagogical grounding, and curriculum awareness.
- REQUIRED AGENT BEHAVIOR & APPROACH:
  * Tone: Collegial and respectful, speaking as one future education professional to another.
  * Adjust questions: Probe into didactic transposition of computing and audiovisual media through AI, handling school students who use generative tools, formative assessment challenges, algorithmic bias, institutional policy, and teacher agency.
  * Invite them to share concrete anecdotes and experiences from their real school classroom interventions.`;
    }

    return `
PARTICIPANT PROFILE & STRICT INSTRUCTIONS:
- Student Name: "${participantName}"
- Degree (FIXED & EXCLUSIVE): ${fixedProgramEN}
- Current Semester: "${semesterStr}"
${centerLocation ? `- Campus / Location: "${centerLocation}"` : ''}

CRITICAL STRICT RULE:
- NEVER ASK "What degree do you study?", "What is your major?", or any variation of that question.
- You know with 100% certainty that the participant is an active student of the Bachelor in Computer Science Education & Audiovisual Media.
- Address them directly as an educator-in-training in this field, and adapt the conversation strictly according to their current semester (${semesterStr}).

${stageInstructions}
`;
  } else {
    let stageInstructions = '';
    if (stage === 'initial') {
      stageInstructions = `
[ETAPA: FUNDAMENTACIÓN / SEMESTRES INICIALES (${semesterStr || '1° a 3° Semestre'})]
- Nivel de conocimiento pedagógico: Introductorio. El estudiante está asimilando la vida universitaria, cursos iniciales de informática, medios y educación. AÚN NO ha realizado prácticas de aula en colegios ni planeación curricular compleja.
- ENFOQUE Y COMPORTAMIENTO OBLIGATORIO DE MAYA:
  * Tono: Muy empático, cálido, conversacional y motivador. CERO tecnicismos intimidantes.
  * Adaptación de preguntas: Enfoca el diálogo en su vivencia cotidiana como aprendiz (ej. cómo usa la IA para entender conceptos de tecnología, programación, medios audiovisuales, resumir lecturas o resolver dudas).
  * NO preguntes: "¿Qué carrera estudias?", ni "¿Cómo evalúas a tus alumnos escolares cuando usan IA en el aula?" (porque aún no tiene alumnos a cargo).
  * SÍ pregunta: "¿Cómo te ha servido la IA en este inicio de la carrera para aprender informática y medios, o para resolver dudas en tus materias? ¿Qué expectativas tienes sobre cómo transformarás las clases cuando seas docente?";`;
    } else if (stage === 'intermediate') {
      stageInstructions = `
[ETAPA: DESARROLLO DIDÁCTICO / SEMESTRES INTERMEDIOS (${semesterStr || '4° a 6° Semestre'})]
- Nivel de conocimiento pedagógico: En desarrollo. Ya cursa didáctica de la informática, producción de medios educativos y prepara o realiza sus primeras observaciones escolares y microclases.
- ENFOQUE Y COMPORTAMIENTO OBLIGATORIO DE MAYA:
  * Tono: Estimulante, reflexivo, de diálogo constructivo.
  * Adaptación de preguntas: Conecta el aprendizaje técnico con el inicio del diseño didáctico. Pregunta cómo usa la IA para idear dinámicas pedagógicas de informática, preparar recursos audiovisuales educativos o guías interactivas.
  * Criterio crítico: Indaga sobre cómo verifica si la información o código que da la IA es correcta y pedagógicamente válida, y qué dilemas éticos o de autoría observan en el programa.`;
    } else {
      stageInstructions = `
[ETAPA: FORMACIÓN AVANZADA / PRÁCTICA DOCENTE Y GRADO (${semesterStr || '7° a 10° Semestre'})]
- Nivel de conocimiento pedagógico: Maduro y consolidado. Cuenta con sólida formación en didáctica de la informática y medios audiovisuales, experiencia directa frente a estudiantes en colegios durante sus prácticas pedagógicas, y conocimiento curricular y evaluativo.
- ENFOQUE Y COMPORTAMIENTO OBLIGATORIO DE MAYA:
  * Tono: Trátalo como a un colega docente en formación con criterio profesional.
  * Adaptación de preguntas: Profundiza en transposición didáctica de la tecnología mediada por IA, cómo reacciona cuando sus propios alumnos escolares usan IA para las actividades de informática, dilemas de evaluación formativa, sesgos de las herramientas, autonomía docente y cultura digital en los colegios.
  * Pídele anécdotas y vivencias reales de su paso por las aulas escolares en sus prácticas.`;
    }

    return `
PERFIL DEL ESTUDIANTE E INSTRUCCIÓN CRÍTICA OBLIGATORIA:
- Nombre: "${participantName}"
- Carrera (FIJA Y EXCLUSIVA): ${fixedProgramES}
- Semestre actual: "${semesterStr}"
${centerLocation ? `- Sede: "${centerLocation}"` : ''}

REGLA CRÍTICA ESTRICTA:
- NUNCA preguntes "¿Qué carrera estudias?", "¿Qué estudias?" ni ninguna variante de esa pregunta en ningún momento de la conversación.
- Ya sabes con absoluta certeza que el estudiante pertenece a la Licenciatura en Informática con Énfasis en Medios Audiovisuales de la Universidad de Córdoba.
- Trátalo con naturalidad como futuro licenciado en informática y medios audiovisuales, y adapta todas tus preguntas, analogías y nivel de profundidad exclusivamente según el semestre que está cursando (${semesterStr}).

${stageInstructions}
`;
  }
}

// Endpoint: AI Conversational Engine (Maya - Natural, Empathetic, Un-intimidating)
app.post('/api/chat', async (req: Request, res: Response) => {
  const {
    guide,
    messages = [],
    currentQuestionIndex = 0,
    currentClarificationCount = 0,
    participantName = 'Amigo/a',
    participantRole = 'Licenciatura en Informática con Énfasis en Medios Audiovisuales',
    studentCode = '',
    semester = '',
    centerLocation = '',
    language = 'es',
  } = req.body;

  try {
    if (!guide || !guide.questions || guide.questions.length === 0) {
      return res.status(400).json({ error: 'La guía con preguntas es requerida.' });
    }

    const totalQuestions = guide.questions.length;
    const currentQ = guide.questions[currentQuestionIndex] || null;
    const isEn = language === 'en';
    const effectiveRole = participantRole || (isEn
      ? 'Bachelor in Computer Science Education & Audiovisual Media'
      : 'Licenciatura en Informática con Énfasis en Medios Audiovisuales');
    const pedagogicalOrientation = getPedagogicalOrientation(semester, effectiveRole, participantName, centerLocation, isEn);

    const systemInstruction = isEn ? `
You are Maya, a warm, thoughtful, and friendly conversational companion on EduPulse.
You are having an authentic, relaxed conversation with "${participantName}", a student of the Bachelor in Computer Science Education & Audiovisual Media (Universidad de Córdoba), about their real-life experience with Artificial Intelligence, learning, and technology.

${pedagogicalOrientation}

CONVERSATION STYLE & PERSONALITY:
- Tone: Empathetic, supportive, curious, casual yet professional. Like talking to a thoughtful colleague over coffee.
- CRITICAL: DO NOT sound like a cold academic questionnaire, an interrogation, or a bureaucratic census. Never say things like "Subject E01", "Objective 1", or "Category 2".
- CRITICAL: NEVER ask "What degree do you study?" or "What are you studying?". You already know they are in the Computer Science Education & Audiovisual Media program.
- Speak to the person by their name naturally: "${participantName}".
- Ask ONLY ONE single question at a time. Never double-barrel questions.
- Validate what they share briefly and genuinely (e.g., "That makes so much sense!", "Oh, that sounds frustrating indeed," "I love that approach!").
- RESPECT THEIR SEMESTER: Keep the depth of conversation precisely fitted to their current semester (${semester || 'active'}) in the Computer Science & Audiovisual Media program.

GUIDE TOPIC & CURRENT FOCUS:
Guide: "${guide.title}"
${currentQ ? `- Current Topic: "${currentQ.topic}"\n- Guiding Question: "${currentQ.question}"\n- Gentle probing hint: "${currentQ.probingTips || 'Ask for a specific example or story'}"` : '- All topics discussed.'}
- Follow-ups already asked on this topic: ${currentClarificationCount} (Max allowed: 2)

RULES:
1. Clarifying follow-up probe:
   - If their answer is brief (1-2 sentences) or touches upon an interesting story or frustration, ask a gentle follow-up fitting their semester (e.g. "Could you tell me about a time that happened?", "What felt most challenging about that?").
   - Set "isClarifying": true, "advanceToNextQuestion": false, "isInterviewFinished": false.
2. Moving forward:
   - If they gave good detail, or after 1-2 follow-ups:
     - If there is a next topic in the guide: bridge naturally into the next question, adjusted to their semester. Set "isClarifying": false, "advanceToNextQuestion": true, "isInterviewFinished": false.
     - If this was the last question: thank them warmly, tell them how much you enjoyed hearing their perspective, and wrap up. Set "isClarifying": false, "advanceToNextQuestion": false, "isInterviewFinished": true.
3. First turn (no messages yet):
   - Greet ${participantName} warmly, naturally acknowledging that they are in ${semester} of the Computer Science & Audiovisual Media program, convey that this is an open, judgment-free space to chat about technology and learning, and ask the first question adapted to their semester: "${guide.questions[0].question}". Never ask what they study.

OUTPUT FORMAT (JSON ONLY):
{
  "reply": "string (conversational message to the user in English)",
  "isClarifying": boolean,
  "advanceToNextQuestion": boolean,
  "isInterviewFinished": boolean,
  "extractedInsight": "string (brief note of what was learned)",
  "category": "string"
}
` : `
Eres Maya, una compañera de conversación reflexiva, empática y cercana en EduPulse.
Estás teniendo una charla amena, fluida y sin presiones con "${participantName}", estudiante de la Licenciatura en Informática con Énfasis en Medios Audiovisuales de la Universidad de Córdoba, sobre cómo está viviendo el uso de la Inteligencia Artificial y la tecnología en sus estudios y su formación.

${pedagogicalOrientation}

ESTILO CONVERSACIONAL Y TONO:
- Tono: Cálido, curioso, amigable y respetuoso. Como una charla distendida entre colegas con un café.
- REGLA DE ORO: NO suenes como un interrogatorio policial, ni como un formulario frío o una encuesta burocrática. NUNCA menciones códigos como "Informante E01", "Categoría 1" o "Objetivo de investigación".
- REGLA CRÍTICA ESTRICTA: NUNCA preguntes "¿Qué carrera estudias?" ni "¿Qué estudias?". Ya sabes que estudia la Licenciatura en Informática con Énfasis en Medios Audiovisuales.
- Trata a la persona con amabilidad y naturalidad por su nombre: "${participantName}".
- FORMULA SOLO UNA PREGUNTA A LA VEZ. Nunca amontones preguntas.
- Valida brevemente lo que cuenta con empatía sincera (ej. "¡Qué interesante lo que cuentas!", "Tiene todo el sentido del mundo", "Uff, imagino lo frustrante que debió ser").
- RESPETA SU SEMESTRE: Adapta siempre la profundidad de tus preguntas e intervenciones a su semestre actual (${semester || 'en curso'}) en la Licenciatura, sin exigirle conocimientos que aún no ha visto ni subestimar su experiencia.

GUÍA Y TEMA EN CURSO:
Guía: "${guide.title}"
${currentQ ? `- Tema actual: "${currentQ.topic}"\n- Pregunta orientadora: "${currentQ.question}"\n- Pista para profundizar: "${currentQ.probingTips || 'Pedir un ejemplo o anécdota real'}"` : '- Todos los temas tratados.'}
- Repreguntas hechas en este tema: ${currentClarificationCount} (Máximo: 2)

REGLAS:
1. Repregunta aclaratoria (Probing amigable adaptado):
   - Si la respuesta es escueta o comenta algo interesante o una dificultad sin mucho detalle, haz una repregunta amable adaptada a su semestre (ej. "¿Recuerdas alguna anécdota puntual donde te haya pasado eso?", "¿Qué fue lo que más te costó en ese momento?").
   - Coloca: "isClarifying": true, "advanceToNextQuestion": false, "isInterviewFinished": false.
2. Avanzar al siguiente tema:
   - Si ya compartió buen detalle o si ya hiciste 1 o 2 repreguntas:
     - Si hay siguiente tema: haz una transición amigable e introduce la siguiente pregunta moldeada a su etapa formativa. Coloca: "isClarifying": false, "advanceToNextQuestion": true, "isInterviewFinished": false.
     - Si era la última pregunta: agradece calurosamente a ${participantName}, dile lo valiosas que fueron sus reflexiones y despídete confirmando el fin de la charla. Coloca: "isClarifying": false, "advanceToNextQuestion": false, "isInterviewFinished": true.
3. Inicio de la charla (sin mensajes previos):
   - Saluda cordialmente a ${participantName}, menciona con calidez que te alegra conversar con alguien de ${semester} de la Licenciatura en Informática y Medios Audiovisuales, transmite confianza aclarando que no hay respuestas correctas ni incorrectas, y plantea la primera pregunta adaptada a su momento formativo: "${guide.questions[0].question}". NUNCA preguntes qué estudia.

FORMATO OBLIGATORIO JSON:
{
  "reply": "string (mensaje conversacional en español)",
  "isClarifying": boolean,
  "advanceToNextQuestion": boolean,
  "isInterviewFinished": boolean,
  "extractedInsight": "string (breve aprendizaje extraído)",
  "category": "string"
}
`;

    const transcript = messages.map((m: any) => `${m.sender === 'agent' ? 'Maya' : participantName}: ${m.text}`).join('\n\n');

    const prompt = messages.length === 0
      ? (isEn
          ? `The conversation has just started. Greet ${participantName} warmly, naturally acknowledging that they are in ${semester} of the Computer Science Education & Audiovisual Media program. Set relaxed, comfortable expectations in 1-2 friendly sentences, and ask the first question tailored to their semester (${semester}): "${guide.questions[0].question}". Do not ask what they study.`
          : `La conversación acaba de iniciar. Saluda amablemente a ${participantName}, reconociendo con naturalidad que cursa ${semester} de la Licenciatura en Informática y Medios Audiovisuales. Transmite confianza y formula la primera pregunta adaptada a su nivel (${semester}): "${guide.questions[0].question}". No preguntes qué estudia.`)
      : (isEn
          ? `Conversation transcript so far:\n\n${transcript}\n\nBased on ${participantName}'s latest reply and keeping in mind they are in ${semester} of Computer Science Education & Audiovisual Media, formulate Maya's next friendly response in valid JSON. Never ask what career they study.`
          : `Transcripción de la charla hasta ahora:\n\n${transcript}\n\nCon base en la última respuesta de ${participantName} y recordando que cursa ${semester} de la Licenciatura en Informática y Medios Audiovisuales, formula la siguiente respuesta amable de Maya en formato JSON. No preguntes qué carrera estudia.`);

    const response = await generateWithRetry(
      'gemini-3.8-flash',
      prompt,
      {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      }
    );

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

    // Fallback conversacional suave
    const isEn = language === 'en';
    const currentQ = guide?.questions?.[currentQuestionIndex];
    if (messages.length === 0 && currentQ) {
      return res.json({
        reply: isEn
          ? `Hi ${participantName}! It's great to meet you. As you are in ${semester} of Computer Science Education & Audiovisual Media, I'm looking forward to our open chat about how tech and AI are playing into your studies and learning. To kick things off: ${currentQ.question}`
          : `¡Hola ${participantName}! Qué gusto saludarte. Me alegra mucho conversar contigo, sabiendo que estás en ${semester} de la Licenciatura en Informática y Medios Audiovisuales. Hoy tendremos una charla tranquila sobre cómo vives la tecnología y la IA en tu formación. Para empezar: ${currentQ.question}`,
        isClarifying: false,
        advanceToNextQuestion: false,
        isInterviewFinished: false,
        extractedInsight: 'Inicio de la conversación',
        category: currentQ.category || 'Inteligencia Artificial (IA)',
      });
    }

    if (currentQ) {
      const isLast = currentQuestionIndex >= (guide.questions.length - 1);
      return res.json({
        reply: isLast
          ? (isEn
              ? `Thank you so much ${participantName} for sharing your honest perspective and stories. It was wonderful chatting with you!`
              : `¡Muchas gracias ${participantName} por compartir tus vivencias y opiniones con tanta sinceridad! Ha sido un placer charlar contigo.`)
          : (isEn
              ? `That makes a lot of sense, thank you! Moving to our next thought: ${guide.questions[currentQuestionIndex + 1]?.question || currentQ.question}`
              : `¡Totalmente de acuerdo, gracias por contármelo! Pasando al siguiente punto: ${guide.questions[currentQuestionIndex + 1]?.question || currentQ.question}`),
        isClarifying: false,
        advanceToNextQuestion: !isLast,
        isInterviewFinished: isLast,
        extractedInsight: 'Respuesta registrada',
        category: currentQ.category || 'Formación Docente',
      });
    }

    return res.status(500).json({ error: error.message || 'Error en la conversación' });
  }
});

// Endpoint: Synthesis & Structured Analysis
app.post('/api/analyze-interview', async (req: Request, res: Response) => {
  try {
    const {
      guide,
      messages = [],
      participantName = 'Participante',
      participantRole = 'Estudiante',
      studentCode = 'E01',
      semester = '',
      centerLocation = '',
      language = 'es',
    } = req.body;

    if (!guide || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'La guía y los mensajes son requeridos.' });
    }

    const isEn = language === 'en';
    const transcript = messages.map((m: any) => `${m.sender === 'agent' ? 'Maya' : participantName}: ${m.text}`).join('\n\n');

    const systemInstruction = isEn ? `
You are a Lead Qualitative Analyst and Educational Researcher.
Your task is to analyze this open conversational interview with "${participantName}" about AI and education.
Organize the reflections into a structured summary and categorized table in ENGLISH.

Return valid JSON with:
{
  "summary": {
    "overview": "A 2-3 paragraph thoughtful synthesis of the participant's background, their daily use of AI, feelings, critical perspective, and main difficulties.",
    "keyThemes": ["4-6 prominent themes or patterns"],
    "actionableInsights": ["4-6 concrete takeaways or suggestions for educational programs"],
    "overallSentiment": "positive" | "mostly positive" | "neutral / mixed" | "critical" | "frustrated",
    "participantPersonaInsight": "Brief characterization of the participant (${participantName}, ${participantRole || 'Student'}, ${semester || 'Active Semester'}, ${centerLocation || ''})",
    "categoriesAnalysis": {
      "iaPracticasYEtica": "Synthesis on how AI is used and their ethical/critical reflections.",
      "formacionDocenteYSaberes": "Synthesis on pedagogical skills and reflective practice.",
      "efectosYLimitaciones": "Synthesis on benefits in planning/learning versus infrastructure and training hurdles."
    }
  },
  "structuredResponses": [
    {
      "topicIndex": 1,
      "category": "Artificial Intelligence (AI)",
      "subCategory": "Pedagogical mediation",
      "topic": "Topic title",
      "coreQuestion": "Guiding question",
      "participantAnswerSummary": "Synthesis of what they expressed",
      "clarifyingNotes": ["Nuances uncovered during follow-up probes"],
      "painPointsOrNeeds": ["Identified hurdles or unmet needs"],
      "directQuotes": ["Direct memorable quotes from the participant"],
      "sentiment": "positive" | "neutral" | "negative" | "mixed"
    }
  ]
}
` : `
Eres un/a Investigador/a Principal en Educación y Análisis Cualitativo.
Tu tarea es analizar la conversación reflexiva realizada con "${participantName}" sobre Inteligencia Artificial y educación.
Genera una síntesis ejecutiva y una matriz de respuestas estructuradas en ESPAÑOL.

Devuelve JSON válido con:
{
  "summary": {
    "overview": "Resumen narrativo de 2-3 párrafos contextualizando la experiencia del participante, sus prácticas cotidianas con IA, su postura ética y las dificultades manifestadas.",
    "keyThemes": ["4 a 6 temas y patrones centrales"],
    "actionableInsights": ["4 a 6 sugerencias y recomendaciones clave para los programas educativos"],
    "overallSentiment": "positivo" | "mayoritariamente positivo" | "neutral / mixto" | "crítico" | "frustrado",
    "participantPersonaInsight": "Breve caracterización del participante (${participantName}, ${participantRole || 'Estudiante'}, ${semester || 'Semestre en curso'}, ${centerLocation || ''})",
    "categoriesAnalysis": {
      "iaPracticasYEtica": "Síntesis sobre el uso de la IA y el nivel de reflexión ética y crítica.",
      "formacionDocenteYSaberes": "Síntesis sobre la articulación pedagógica y práctica reflexiva.",
      "efectosYLimitaciones": "Síntesis sobre beneficios en planeación y aprendizaje frente a retos de conectividad y capacitación."
    }
  },
  "structuredResponses": [
    {
      "topicIndex": 1,
      "category": "Inteligencia Artificial (IA)",
      "subCategory": "Mediación pedagógica",
      "topic": "Nombre del tema",
      "coreQuestion": "Pregunta orientadora",
      "participantAnswerSummary": "Síntesis de lo que compartió",
      "clarifyingNotes": ["Detalles y anécdotas de repreguntas"],
      "painPointsOrNeeds": ["Dificultades o necesidades expresadas"],
      "directQuotes": ["Citas textuales del participante"],
      "sentiment": "positivo" | "neutral" | "negativo" | "mixto"
    }
  ]
}
`;

    const response = await generateWithRetry(
      'gemini-3.8-flash',
      `Analyze this conversation with ${participantName}:\n\n${transcript}`,
      {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    );

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
    return res.status(500).json({ error: error.message || 'Error al analizar la conversación' });
  }
});

// Endpoint: Export to Google Sheets
app.post('/api/export-sheets', async (req: Request, res: Response) => {
  try {
    const {
      accessToken,
      sessionTitle = 'Conversación EduPulse',
      guideTitle = 'Tema de Diálogo',
      participantName = 'Participante',
      studentCode = '',
      participantRole = 'Estudiante',
      semester = '',
      centerLocation = '',
      language = 'es',
      summary = {},
      structuredResponses = [],
      messages = [],
    } = req.body;

    if (!accessToken) {
      return res.status(401).json({ error: 'Se requiere token de acceso OAuth para exportar a Google Sheets.' });
    }

    const isEn = language === 'en';
    const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const spreadsheetTitle = `[EduPulse] ${participantName} - ${guideTitle} (${dateStr})`;

    // 1. Create Spreadsheet
    const sheetTitles = isEn
      ? ['Overview & Insights', 'Key Ideas Table', 'Full Transcript']
      : ['Resumen y Reflexiones', 'Tabla de Ideas Clave', 'Transcripción Completa'];

    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: spreadsheetTitle,
        },
        sheets: [
          { properties: { title: sheetTitles[0], index: 0 } },
          { properties: { title: sheetTitles[1], index: 1 } },
          { properties: { title: sheetTitles[2], index: 2 } },
        ],
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json();
      console.error('Google Sheets create failed:', errData);
      return res.status(createRes.status).json({
        error: errData.error?.message || 'Error al crear la hoja en Google Sheets.',
      });
    }

    const spreadsheetData = await createRes.json();
    const spreadsheetId = spreadsheetData.spreadsheetId;
    const spreadsheetUrl = spreadsheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // 2. Prepare Data
    const summaryRows = isEn
      ? [
          ['EDUPULSE - CONVERSATIONAL REFLECTIONS & RESEARCH DATA', ''],
          ['Topic / Guide', guideTitle],
          ['Participant Name', participantName],
          ['Participant Role', participantRole],
          ['Semester / Year', semester || 'N/A'],
          ['Campus / Location', centerLocation || 'N/A'],
          ['Date', dateStr],
          ['Overall Tone', summary.overallSentiment || 'Neutral'],
          ['Participant Profile', summary.participantPersonaInsight || ''],
          ['', ''],
          ['OVERVIEW & KEY REFLECTIONS', ''],
          [summary.overview || 'Conversation recorded successfully.'],
          ['', ''],
          ['RECURRING THEMES', ''],
          ...(summary.keyThemes || []).map((theme: string, i: number) => [`Theme ${i + 1}`, theme]),
          ['', ''],
          ['SUGGESTIONS & TAKEAWAYS', ''],
          ...(summary.actionableInsights || []).map((rec: string, i: number) => [`Takeaway ${i + 1}`, rec]),
        ]
      : [
          ['EDUPULSE - REFLEXIONES Y DATOS DE LA CONVERSACIÓN', ''],
          ['Tema / Guía', guideTitle],
          ['Nombre del Participante', participantName],
          ['Rol / Ocupación', participantRole],
          ['Semestre / Año', semester || 'N/A'],
          ['Sede / Ubicación', centerLocation || 'N/A'],
          ['Fecha', dateStr],
          ['Tono General', summary.overallSentiment || 'Neutral'],
          ['Perfil del Participante', summary.participantPersonaInsight || ''],
          ['', ''],
          ['RESUMEN Y REFLEXIONES PRINCIPALES', ''],
          [summary.overview || 'Conversación registrada con éxito.'],
          ['', ''],
          ['TEMAS RECURRENTES', ''],
          ...(summary.keyThemes || []).map((theme: string, i: number) => [`Tema ${i + 1}`, theme]),
          ['', ''],
          ['SUGERENCIAS Y APRENDIZAJES', ''],
          ...(summary.actionableInsights || []).map((rec: string, i: number) => [`Idea ${i + 1}`, rec]),
        ];

    const responseHeaders = isEn
      ? ['#', 'Category', 'Topic', 'Core Question', 'What Was Discussed', 'Nuances & Follow-ups', 'Hurdles / Difficulties', 'Quotes', 'Tone']
      : ['#', 'Categoría', 'Tema', 'Pregunta Orientadora', 'Lo que se Conversó', 'Matices y Ejemplos', 'Retos y Dificultades', 'Citas Directas', 'Tono'];

    const responseRows = [
      responseHeaders,
      ...(structuredResponses || []).map((item: any, idx: number) => [
        `#${item.topicIndex || idx + 1}`,
        item.category || '',
        item.topic || `Tema ${idx + 1}`,
        item.coreQuestion || '',
        item.participantAnswerSummary || '',
        Array.isArray(item.clarifyingNotes) ? item.clarifyingNotes.join('\n• ') : (item.clarifyingNotes || ''),
        Array.isArray(item.painPointsOrNeeds) ? item.painPointsOrNeeds.join('\n• ') : (item.painPointsOrNeeds || ''),
        Array.isArray(item.directQuotes) ? item.directQuotes.map((q: string) => `"${q}"`).join('\n\n') : (item.directQuotes || ''),
        item.sentiment || 'neutral',
      ]),
    ];

    const transcriptHeaders = isEn
      ? ['#', 'Speaker', 'Message', 'Type', 'Time']
      : ['#', 'Hablante', 'Mensaje', 'Tipo', 'Hora'];

    const transcriptRows = [
      transcriptHeaders,
      ...(messages || []).map((m: any, idx: number) => [
        idx + 1,
        m.sender === 'agent' ? 'Maya (EduPulse)' : participantName,
        m.text || '',
        m.isClarifying ? (isEn ? 'Follow-up' : 'Repregunta') : (isEn ? 'Main dialogue' : 'Diálogo principal'),
        m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : '',
      ]),
    ];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: [
            {
              range: `'${sheetTitles[0]}'!A1`,
              values: summaryRows,
            },
            {
              range: `'${sheetTitles[1]}'!A1`,
              values: responseRows,
            },
            {
              range: `'${sheetTitles[2]}'!A1`,
              values: transcriptRows,
            },
          ],
        }),
      }
    );

    return res.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
    });
  } catch (error: any) {
    console.error('Error in /api/export-sheets:', error);
    return res.status(500).json({ error: error.message || 'Error al exportar a Google Sheets' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
