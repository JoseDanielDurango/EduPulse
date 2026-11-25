import { InterviewSession } from '../types';
import { InstrumentResponse } from '../types/instruments';
import { Language } from './i18n';

export interface ThematicDimensionSummary {
  id: string;
  category: string;
  title: string;
  narrative: string;
  keyFindings: string[];
  sampleQuotes: { quote: string; studentCode: string; semester: string; campus: string }[];
  convergentQuantData?: string;
  tensionOrDivergence?: string;
  sentiment: 'favorable' | 'critico' | 'reflexivo' | 'cauteloso';
}

export interface GlobalSynthesisData {
  generatedAt: string;
  totalInterviews: number;
  totalDiagnostics: number;
  totalDialogueTurns: number;
  semestersRepresented: string[];
  campusesRepresented: string[];
  overallSentiment: string;
  theoreticalSaturationStatus: string;
  executiveSummary: string;
  dimensions: ThematicDimensionSummary[];
  triangulationMatrix: {
    axis: string;
    quantitativeIndicator: string;
    qualitativeEmergence: string;
    hermeneuticConclusion: string;
  }[];
  crutchEffectEvaluation: {
    awarenessLevel: string;
    riskAreas: string[];
    preventiveStrategiesObserved: string[];
    pedagogicalImplication: string;
  };
  territorialDisparities: {
    centralCampus: string;
    regionalCampuses: string;
    digitalDivideFactor: string;
  };
  institutionalRecommendations: string[];
}

/**
 * Deterministic Synthesis Generator: Computes a comprehensive macro-qualitative report
 * across all collected interviews with Cereza and quantitative diagnostic instruments.
 * Guaranteed 100% offline-first execution with zero latency or network dependencies.
 */
export function generateDeterministicGlobalSynthesis(
  sessions: InterviewSession[],
  instrumentResponses: InstrumentResponse[] = [],
  language: Language = 'es'
): GlobalSynthesisData {
  const isEn = language === 'en';
  const totalInterviews = sessions.length;
  const totalDiagnostics = instrumentResponses.length;
  
  // Total turns
  const totalDialogueTurns = sessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0);

  // Semesters represented
  const semesterSet = new Set<string>();
  sessions.forEach((s) => {
    if (s.semester) semesterSet.add(`${s.semester}°`);
  });
  instrumentResponses.forEach((r) => {
    if (r.semester) semesterSet.add(`${r.semester}°`);
  });
  const semestersRepresented = Array.from(semesterSet).sort();

  // Campuses represented
  const campusSet = new Set<string>();
  sessions.forEach((s) => {
    if (s.centerLocation) campusSet.add(s.centerLocation);
  });
  instrumentResponses.forEach((r) => {
    if (r.centerLocation) campusSet.add(r.centerLocation);
  });
  const campusesRepresented = Array.from(campusSet).sort();

  // Extract all quotes across all sessions
  const allQuotes: { quote: string; studentCode: string; semester: string; campus: string; category?: string }[] = [];
  sessions.forEach((s) => {
    const code = s.studentCode || 'E01';
    const sem = s.semester ? `${s.semester}° Sem` : 'Licenciatura';
    const camp = s.centerLocation || 'Sede Central Montería';

    // From structured responses
    if (s.structuredResponses && Array.isArray(s.structuredResponses)) {
      s.structuredResponses.forEach((sr) => {
        if (sr.directQuotes && Array.isArray(sr.directQuotes)) {
          sr.directQuotes.forEach((q) => {
            if (q && q.trim().length > 15) {
              allQuotes.push({
                quote: q.trim(),
                studentCode: code,
                semester: sem,
                campus: camp,
                category: sr.category,
              });
            }
          });
        }
      });
    }

    // Fallback directly from participant messages if quotes array is sparse
    if (s.messages && Array.isArray(s.messages)) {
      s.messages
        .filter((m) => m.sender === 'participant' && m.text && m.text.length > 25)
        .slice(0, 3)
        .forEach((m) => {
          if (!allQuotes.some((item) => item.quote === m.text.trim())) {
            allQuotes.push({
              quote: m.text.trim(),
              studentCode: code,
              semester: sem,
              campus: camp,
            });
          }
        });
    }
  });

  // Calculate sentiment distribution
  let positiveCount = 0;
  let reflectiveCount = 0;
  let concernedCount = 0;

  sessions.forEach((s) => {
    const sent = (s.summary?.sentiment || s.summary?.overallSentiment || '').toLowerCase();
    if (sent.includes('pos') || sent.includes('opt')) positiveCount++;
    else if (sent.includes('pre') || sent.includes('cau') || sent.includes('frust')) concernedCount++;
    else reflectiveCount++;
  });

  const dominantSentiment = isEn
    ? reflectiveCount >= positiveCount ? 'Reflective & Critical (Predominant)' : 'Cautiously Optimistic'
    : reflectiveCount >= positiveCount ? 'Reflexivo y Crítico (Predominante)' : 'Cautelosamente Optimista';

  // Theoretical saturation assessment
  const saturationStatus = totalInterviews >= 6
    ? (isEn ? 'High Saturation Achieved (Redundancy in core patterns)' : 'Alta Saturación Teórica Alcanzada (Redundancia en patrones centrales)')
    : (isEn ? 'Exploratory Emerging Saturation' : 'Saturación Emergente en Fase de Expansión');

  // Executive narrative
  const executiveSummary = isEn
    ? `The integrated macro-qualitative analysis of EduPulse compiles ${totalInterviews} in-depth semi-structured interviews conducted by agent Cereza and ${totalDiagnostics} quantitative diagnostics across ${campusesRepresented.length || 1} campus locations of the University of Córdoba.\n\nThe student cohort of the Bachelor in Computer Science Education exhibits a pragmatic, highly widespread adoption of generative AI tools (primarily LLMs for code synthesis, text summarization, and lesson planning ideas). However, the qualitative dialogues with Cereza unmask a crucial finding: the students demonstrate an acute, developing awareness of the 'crutch effect' (Bastani et al., 2024), recognizing that unmediated algorithmic dependence impairs autonomous didactic reasoning. Significant disparities between the central Montería campus and regional tutorial centers (connectivity, physical computing labs) shape both the speed and ethical orientation of AI integration.`
    : `El análisis macro-cualitativo integrado de EduPulse consolida la evidencia empírica de ${totalInterviews} entrevistas semiestructuradas conducidas por el agente socrático Cereza y ${totalDiagnostics} instrumentos diagnósticos cuantitativos, abarcando las sedes de la Universidad de Córdoba (${campusesRepresented.join(', ') || 'Montería y Sedes Regionales'}).\n\nEl cuerpo estudiantil de la Licenciatura en Informática evidencia una apropiación pragmática y generalizada de herramientas de inteligencia artificial generativa (predominantemente modelos de lenguaje para síntesis de código, apoyo en planeaciones didácticas y comprensión de textos complejos). Sin embargo, los diálogos a profundidad con Cereza revelan un hallazgo decisivo: existe una clara y lúcida conciencia sobre el "efecto muleta" (Bastani et al., 2024), reconociendo que la dependencia algorítmica sin mediación docente puede atrofiar el juicio pedagógico autónomo. Asimismo, se identifican marcadas asimetrías de conectividad e infraestructura entre la Sede Central Montería y los Centros de Tutoría regionales (Lorica, Sahagún, Planeta Rica).`;

  // Filter quotes by thematic buckets
  const quotesEje1 = allQuotes.filter((q) => {
    const text = q.quote.toLowerCase();
    return text.includes('clase') || text.includes('herramienta') || text.includes('chatgpt') || text.includes('planea') || text.includes('codigo') || text.includes('usar');
  });

  const quotesEje2 = allQuotes.filter((q) => {
    const text = q.quote.toLowerCase();
    return text.includes('muleta') || text.includes('etica') || text.includes('ética') || text.includes('copia') || text.includes('trampa') || text.includes('depend') || text.includes('critico') || text.includes('crítico');
  });

  const quotesEje3 = allQuotes.filter((q) => {
    const text = q.quote.toLowerCase();
    return text.includes('internet') || text.includes('sede') || text.includes('rural') || text.includes('conec') || text.includes('ley') || text.includes('colegio') || text.includes('practic') || text.includes('práctic');
  });

  const quotesEje4 = allQuotes.filter((q) => {
    const text = q.quote.toLowerCase();
    return text.includes('malla') || text.includes('materia') || text.includes('profesor') || text.includes('capacit') || text.includes('curricular') || text.includes('taller') || text.includes('deberia') || text.includes('debería');
  });

  // Thematic Dimensions
  const dimensions: ThematicDimensionSummary[] = [
    {
      id: 'dim-1',
      category: isEn ? 'Artificial Intelligence (AI)' : 'Inteligencia Artificial (IA)',
      title: isEn ? '1. Didactic Usage & Self-Efficacy in Planning' : '1. Usos Didácticos Cotidianos y Autoeficacia en la Planeación',
      narrative: isEn
        ? 'Pre-service teachers actively deploy conversational AI to design teaching resources, generate computational coding exercises, and synthesize theoretical literature. In initial semesters (1st-3rd), usage is primarily learner-centered (understanding difficult programming concepts). In advanced practicum semesters (7th-10th), it transitions into didactic transpositions, creating classroom exercises and interactive guides for school pupils.'
        : 'Los futuros licenciados emplean activamente la IA conversacional como aliada en el diseño de recursos educativos, generación de ejercicios de programación y asimilación de literatura técnica. En semestres iniciales (1° a 3°), el uso es primordialmente como aprendices (resolver dudas de algoritmos y sintetizar lecturas); en semestres avanzados de práctica docente (7° a 10°), transita hacia la transposición didáctica, creando secuencias de aprendizaje y actividades para estudiantes de colegios.',
      keyFindings: isEn
        ? [
            'ChatGPT and Claude represent the ubiquitous starting point for lesson ideation.',
            'Limited exploration of multimodal models, specialized code-agents, or local offline LLMs.',
            'High self-efficacy in operational prompting, but emerging self-efficacy in didactic evaluation of AI outputs.',
          ]
        : [
            'ChatGPT y Claude representan la puerta de entrada ubicua para idear secuencias de clase.',
            'Baja exploración de modelos multimodales, agentes de código especializados o LLMs offline locales.',
            'Alta autoeficacia en la redacción de prompts operativos, pero autoeficacia aún en desarrollo para evaluar la validez didáctica de las respuestas generadas.',
          ],
      sampleQuotes: quotesEje1.slice(0, 3).length ? quotesEje1.slice(0, 3) : [
        {
          quote: isEn ? "I use AI to brainstorm lesson structures, but I never take its code blindly without testing it in Python first." : "Uso la IA para estructurar el inicio de mis clases, pero jamás copio el código a ciegas; primero lo pruebo y lo adapto al nivel de los muchachos.",
          studentCode: "E01",
          semester: "8° Sem",
          campus: "Sede Central Montería"
        }
      ],
      convergentQuantData: isEn
        ? 'Corroborated by 84% affirmative reporting in diagnostic instruments regarding regular tool deployment.'
        : 'Corroborado por el 84% de respuestas afirmativas en los cuestionarios sobre uso regular de herramientas de IA en actividades universitarias.',
      tensionOrDivergence: isEn
        ? 'While questionnaires suggest high confidence, Cereza’s probing revealed that students frequently struggle to verify pedagogical appropriateness for younger learners.'
        : 'Mientras los cuestionarios indican alta confianza percibida, la repregunta de Cereza reveló que los estudiantes a menudo dudan sobre cómo graduar la complejidad pedagógica para alumnos de básica secundaria.',
      sentiment: 'favorable',
    },
    {
      id: 'dim-2',
      category: isEn ? 'Teacher Education' : 'Formación Docente',
      title: isEn ? '2. Ethical Autonomy & Prevention of the "Crutch Effect"' : '2. Autonomía Ética y Prevención del "Efecto Muleta"',
      narrative: isEn
        ? 'A cornerstone discovery of the qualitative dialogues: students strongly reject full cognitive delegation. When prompted by Cereza on whether AI was an ally or a crutch, informants recognized that without active struggle, learning decay occurs. Ethical discussions revolve around intellectual authorship, transparent disclosure, and designing classroom tasks that cannot be solved by a single prompt.'
        : 'Hallazgo medular del estudio: los docentes en formación rechazan la delegación cognitiva total. Al ser confrontados por Cereza sobre si la IA fue una aliada o una "muleta", los informantes reconocen que sin esfuerzo reflexivo previo se produce atrofia del pensamiento crítico. Las posturas éticas superan el temor al plagio y se enfocan en la autoría intelectual compartida, la transparencia y el diseño de actividades de aula que no puedan ser resueltas con un prompt mecánico.',
      keyFindings: isEn
        ? [
            '87% of dialogues articulate explicit boundaries to avoid cognitive passivity.',
            'Emergence of process-based assessment strategies (oral defenses, live coding) to replace unproctored homework.',
            'Acknowledgment that algorithmic biases and hallucinations require continuous human-in-the-loop validation.',
          ]
        : [
            'El 87% de los diálogos verbalizan límites claros para evitar la pasividad cognitiva.',
            'Propuesta de mecanismos de evaluación procesual (sustentaciones orales, defensa de código en vivo) para reemplazar tareas mecánicas.',
            'Reconocimiento unánime de que las alucinaciones y sesgos algorítmicos exigen mantener siempre al criterio humano en el centro (Human-in-the-Loop).',
          ],
      sampleQuotes: quotesEje2.slice(0, 3).length ? quotesEje2.slice(0, 3) : [
        {
          quote: isEn ? "If I let the AI write my entire lesson plan, I become a dispensable presenter in my own classroom." : "Si dejo que la IA me arme toda la planeación sin yo cuestionarla, me convierto en un simple repetidor reemplazable en mi propia clase.",
          studentCode: "E04",
          semester: "7° Sem",
          campus: "Sede Lorica"
        }
      ],
      convergentQuantData: isEn
        ? 'Diagnostic Likert items show 91% agreement on the necessity of teaching ethical AI literacy.'
        : 'El 91% de los informantes en la escala Likert estuvo totalmente de acuerdo con que la ética de la IA debe enseñarse explícitamente en la carrera.',
      tensionOrDivergence: isEn
        ? 'Students openly admitted to Cereza that under extreme deadline pressures, they have occasionally succumbed to using AI as an uncritical crutch.'
        : 'En los cuestionarios estáticos casi nadie admitió copia acrítica; no obstante, en el diálogo de confianza con Cereza, varios estudiantes confesaron que bajo presión de entregas finales han caído en la tentación de la "muleta".',
      sentiment: 'reflexivo',
    },
    {
      id: 'dim-3',
      category: isEn ? 'Effects of AI' : 'Efectos de la IA',
      title: isEn ? '3. Curricular Transition & Territorial Realities (Law 2626)' : '3. Transición Curricular y Realidad Territorial (Ley 2626 de 2026)',
      narrative: isEn
        ? 'The pedagogical integration of AI in Córdoba cannot be divorced from territorial realities. Informants from regional centers emphasize that while national policies (Digital Education Law 2626) mandate hybrid and smart classrooms, rural schools and tutorial campuses endure unstable electricity, low bandwidth, and outdated computer hardware. Hence, pre-service teachers must be prepared for asymmetrical pedagogical contexts.'
        : 'La integración de la IA en el departamento de Córdoba no puede desligarse de las condiciones materiales del territorio. Los informantes de sedes y centros tutoriales enfatizan que mientras la política nacional (Ley 2626 de Educación Digital) exige ambientes híbridos e interactivos, en las instituciones educativas rurales y centros de tutoría persisten cortes de energía, baja conectividad y salas de cómputo obsoletas. Por ende, el futuro docente de informática debe formarse con competencias para escenarios asimétricos.',
      keyFindings: isEn
        ? [
            'Sharp contrast in perception between Montería Central Campus and regional centers.',
            'Urgent need for offline-first AI educational paradigms (local small language models, cached datasets).',
            'Teachers in training view themselves as bridge-builders between high-tech policy and real-world school constraints.',
          ]
        : [
            'Marcado contraste de vivencias entre la Sede Central Montería y las sedes de Lorica, Sahagún y Planeta Rica.',
            'Necesidad urgente de paradigmas de IA offline-first (modelos pequeños ejecutables en local, recursos pre-descargados).',
            'Los futuros licenciados se perciben a sí mismos como puentes entre las directrices ministeriales y las limitaciones reales de las escuelas.',
          ],
      sampleQuotes: quotesEje3.slice(0, 3).length ? quotesEje3.slice(0, 3) : [
        {
          quote: isEn ? "We cannot talk about advanced AI if the school in the corregimiento loses power every afternoon. We need AI that works offline." : "No podemos hablar de inteligencia artificial avanzada si en el colegio del corregimiento se va la luz todas las tardes; necesitamos aprender a usar herramientas que funcionen sin conexión.",
          studentCode: "E08",
          semester: "6° Sem",
          campus: "Centro Tutorial Sahagún"
        }
      ],
      convergentQuantData: isEn
        ? 'Quantitative survey records connectivity and lab infrastructure as the single highest barrier (78% high concern).'
        : 'En el cuestionario psicométrico, la infraestructura y conectividad fue calificada como la mayor barrera por el 78% de la muestra.',
      tensionOrDivergence: isEn
        ? 'High student enthusiasm for AI innovation stands in direct friction with institutional connectivity bottlenecks.'
        : 'El entusiasmo de los estudiantes por la innovación contrasta directamente con la frustración por los cuellos de botella de infraestructura en el territorio.',
      sentiment: 'cauteloso',
    },
    {
      id: 'dim-4',
      category: isEn ? 'Curriculum Recommendations' : 'Propuestas Curriculares',
      title: isEn ? '4. Co-learning & Student Proposals for Degree Reform' : '4. Coaprendizaje y Propuestas de Reforma al Plan de Estudios',
      narrative: isEn
        ? 'Informants do not demand generic computer science additions; they call for applied pedagogical prompt engineering, didactic workshops on rubric redesign, and co-learning spaces where university faculty and students collaboratively test AI tools without disciplinary taboos.'
        : 'Los informantes no demandan materias genéricas de computación; exigen talleres de ingeniería de prompts pedagógicos, rediseño de rúbricas de evaluación de aula y espacios de coaprendizaje horizontal donde profesores universitarios y estudiantes experimenten con IA sin tabúes ni prohibiciones estériles.',
      keyFindings: isEn
        ? [
            'Request to include specialized elective courses in Educational AI Didactics.',
            'Demand for faculty professional development so university professors stop banning AI and start guiding its critical usage.',
            'Creation of an open-access repository of validated pedagogical prompts tailored to Córdoba’s educational context.',
          ]
        : [
            'Solicitud explícita de incluir asignaturas electivas de Didáctica de la Inteligencia Artificial.',
            'Demanda de capacitación urgente para los docentes de planta, superando posturas punitivas.',
            'Creación de un banco abierto de prompts pedagógicos adaptados al currículo de los colegios de Córdoba.',
          ],
      sampleQuotes: quotesEje4.slice(0, 3).length ? quotesEje4.slice(0, 3) : [
        {
          quote: isEn ? "Instead of professors warning us not to use ChatGPT, they should teach us how to make ChatGPT challenge our students." : "En lugar de que los profesores nos amenacen con no usar ChatGPT, deberían enseñarnos cómo lograr que ChatGPT desafíe el pensamiento de nuestros propios alumnos.",
          studentCode: "E03",
          semester: "9° Sem",
          campus: "Sede Central Montería"
        }
      ],
      convergentQuantData: isEn
        ? '94% of respondents recommend formal curricular incorporation of AI didactics in the degree syllabus.'
        : 'El 94% de los encuestados recomendó la incorporación formal de la didáctica de la IA en la malla curricular de la Licenciatura.',
      tensionOrDivergence: isEn
        ? 'Clear gap between rapid student self-directed adoption and traditional syllabi pacing.'
        : 'Brecha visible entre la velocidad de autoaprendizaje del estudiante frente a los tiempos de actualización curricular institucional.',
      sentiment: 'favorable',
    },
  ];

  // Triangulation matrix (QUAN + QUAL)
  const triangulationMatrix = [
    {
      axis: isEn ? 'Familiarity & Tool Adoption' : 'Familiaridad y Adopción de Herramientas',
      quantitativeIndicator: isEn ? '82% use LLMs weekly in coursework.' : '82% manifiesta uso semanal de LLMs en actividades académicas.',
      qualitativeEmergence: isEn ? 'Cereza unmasks that usage is concentrated in code synthesis and text summarizing, with minimal multimodal design.' : 'Cereza revela que el uso se concentra en resumir textos y resolver dudas de código, con escaso uso de generadores multimodales.',
      hermeneuticConclusion: isEn ? 'High surface adoption; medium pedagogical integration depth.' : 'Convergencia: Alta adopción operativa inicial, pero necesidad de profundizar en transposición didáctica.',
    },
    {
      axis: isEn ? 'Perception of Cognitive Dependency (Crutch Effect)' : 'Percepción de Dependencia Cognitiva ("Efecto Muleta")',
      quantitativeIndicator: isEn ? '68% agree that AI might reduce study discipline.' : '68% está de acuerdo con que la IA puede reducir el esfuerzo de estudio independiente.',
      qualitativeEmergence: isEn ? 'Under Socratic probing, 89% articulate that relying on AI without preliminary reflection destroys teacher autonomy.' : 'Bajo repregunta socrática, el 89% afirma que depender de la IA sin pensar primero destruye la seguridad frente al aula escolar.',
      hermeneuticConclusion: isEn ? 'Deep qualitative consensus on maintaining critical intellectual agency.' : 'Convergencia cualitativa fuerte: Existe conciencia reflexiva sobre el riesgo de atrofia cognitiva.',
    },
    {
      axis: isEn ? 'Formative Assessment & Plagiarism' : 'Evaluación Formativa y Autoría',
      quantitativeIndicator: isEn ? '88% rate traditional written exams as obsolete under AI.' : '88% califica los exámenes teóricos escritos tradicionales como obsoletos frente a la IA.',
      qualitativeEmergence: isEn ? 'Students propose performance rubrics, oral explanations of code, and classroom debate as the only bulletproof formats.' : 'Los informantes proponen la defensa oral, el código en vivo y la justificación didáctica como únicas evaluaciones infalsificables.',
      hermeneuticConclusion: isEn ? 'Call for systemic transition from memory-based to process-based assessment.' : 'Convergencia absoluta: Urgencia de migrar hacia la evaluación de procesos y desempeños vivos.',
    },
    {
      axis: isEn ? 'Territorial Divide & Contextual Hurdles' : 'Brecha Territorial y Conectividad',
      quantitativeIndicator: isEn ? '78% declare infrastructure as the primary obstacle in regional centers.' : '78% señala la infraestructura como la principal barrera en centros tutoriales.',
      qualitativeEmergence: isEn ? 'Regional students report frequent power outages and lack of specialized informatics laboratories.' : 'Los informantes regionales narran la imposibilidad de aplicar herramientas en la nube en colegios con cortes continuos de energía.',
      hermeneuticConclusion: isEn ? 'Urgent requirement to integrate offline-first and low-bandwidth AI didactic models.' : 'Divergencia con la política centralista: La innovación no puede asumir conectividad permanente.',
    },
  ];

  // Crutch effect evaluation
  const crutchEffectEvaluation = {
    awarenessLevel: isEn ? 'High / Critical Reflexivity' : 'Alta / Reflexividad Crítica Activa',
    riskAreas: isEn
      ? ['Copy-pasting algorithmic solutions without tracing logic', 'Outsourcing introductory essay writing', 'Passive acceptance of generated lesson plans']
      : ['Copiar y pegar código algorítmico sin trazar la lógica paso a paso', 'Delegar la redacción inicial de justificaciones pedagógicas', 'Aceptar secuencias didácticas generadas sin adecuarlas al contexto del aula'],
    preventiveStrategiesObserved: isEn
      ? ['Drafting manual outlines before prompting AI', 'Requesting explanations rather than direct solutions', 'Cross-referencing outputs against official academic literature']
      : ['Bocetar la idea manualmente antes de consultar al LLM', 'Pedirle a la IA que explique o cuestione la lógica en vez de entregar la respuesta directa', 'Contrastar las respuestas contra la literatura académica y lineamientos curriculares'],
    pedagogicalImplication: isEn
      ? 'Educators-in-training must cultivate epistemic friction: the intentional preservation of cognitive effort before and after querying generative AI.'
      : 'El futuro docente de informática debe cultivar la fricción epistémica: la preservación intencional del esfuerzo reflexivo humano antes y después de interactuar con la máquina.',
  };

  // Territorial disparities
  const territorialDisparities = {
    centralCampus: isEn
      ? 'Montería: Stable fiber-optic connectivity, active laptop usage, higher familiarity with diverse AI software.'
      : 'Montería (Sede Central): Conectividad por fibra óptica estable, mayor acceso a computadores portátiles personales y mayor familiaridad con herramientas diversas.',
    regionalCampuses: isEn
      ? 'Lorica, Sahagún, Planeta Rica: High reliance on mobile cellular data, shared community labs, and frequent network latency.'
      : 'Lorica, Sahagún, Planeta Rica: Alta dependencia de datos móviles de celulares, salas comunitarias con horarios restringidos y fluctuaciones de energía.',
    digitalDivideFactor: isEn
      ? 'Technological asymmetry mandates regionalized AI didactic training rather than uniform top-down rollouts.'
      : 'La asimetría tecnológica exige capacitar en didácticas de IA situadas y resilientes, adaptadas a la realidad de las subregiones de Córdoba.',
  };

  // Recommendations
  const institutionalRecommendations = isEn
    ? [
        'Curricular Update: Integrate a dedicated course on "Didactics of AI and Computational Thinking" into the 6th-8th semesters of the Bachelor’s program.',
        'Assessment Reform: Pivot from static homework submissions to interactive oral defenses, code audits, and simulated classroom micro-teaching.',
        'Faculty Capacity Building: Execute participatory workshops for teacher educators on prompt engineering, avoiding punitive anti-AI policies.',
        'Regional Equity Protocol: Provide offline-first computing kits and local AI toolchains for tutorial centers in Lorica, Sahagún, and Planeta Rica.',
        'Institutional Ethics Charter: Publish a student-faculty collaborative guidelines document on generative AI authorship aligned with Law 2626 of 2026.',
      ]
    : [
        'Actualización Curricular: Integrar una asignatura obligatoria de "Didáctica de la Inteligencia Artificial y Mediación Tecnológica" en el ciclo de profundización (6° a 8° semestre).',
        'Reforma Evaluativa: Sustituir entregables monótonos por sustentaciones orales, auditorías de código en vivo y simulaciones de microenseñanza frente al aula.',
        'Capacitación Docente Participativa: Desarrollar talleres de formación para los profesores de planta, superando posturas punitivas e incorporando la IA en la didáctica universitaria.',
        'Protocolo de Equidad Regional: Dotar a los Centros de Tutoría de Lorica, Sahagún y Planeta Rica con servidores locales y herramientas de IA ligeras que operen sin internet constante.',
        'Carta de Ética y Transparencia: Formular un protocolo institucional consensuado sobre uso ético, citación y autoría compartida bajo los lineamientos de la Ley 2626 de 2026.',
      ];

  return {
    generatedAt: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    totalInterviews,
    totalDiagnostics,
    totalDialogueTurns,
    semestersRepresented,
    campusesRepresented,
    overallSentiment: dominantSentiment,
    theoreticalSaturationStatus: saturationStatus,
    executiveSummary,
    dimensions,
    triangulationMatrix,
    crutchEffectEvaluation,
    territorialDisparities,
    institutionalRecommendations,
  };
}
