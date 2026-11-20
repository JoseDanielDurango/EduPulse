import firebaseConfig from '../../firebase-applet-config.json';
import { InterviewSession } from '../types';
import { THESIS_PROJECT_INFO } from './thesisContext';

declare global {
  interface Window {
    google?: any;
  }
}

export async function requestGoogleAccessToken(): Promise<string> {
  const cached = localStorage.getItem('google_oauth_token');
  if (cached) {
    return cached;
  }

  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('El script de Google Identity Services se está cargando. Intenta de nuevo en unos segundos.'));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: firebaseConfig.oAuthClientId,
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }
          if (tokenResponse.access_token) {
            localStorage.setItem('google_oauth_token', tokenResponse.access_token);
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error('Google no devolvió ningún token de acceso.'));
          }
        },
      });
      client.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
}

export async function exportSessionToGoogleSheets(
  session: InterviewSession,
  tokenOverride?: string,
  language: 'es' | 'en' = 'es'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  let token = tokenOverride || localStorage.getItem('google_oauth_token');

  if (!token) {
    token = await requestGoogleAccessToken();
  }

  const response = await fetch('/api/export-sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: token,
      sessionTitle: session.title,
      guideTitle: session.guideTitle,
      participantName: session.participantName,
      studentCode: session.studentCode || '',
      participantRole: session.participantRole,
      semester: session.semester,
      centerLocation: session.centerLocation,
      language,
      summary: session.summary,
      structuredResponses: session.structuredResponses,
      messages: session.messages,
    }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('google_oauth_token');
      const freshToken = await requestGoogleAccessToken();
      return exportSessionToGoogleSheets(session, freshToken);
    }
    const errData = await response.json();
    throw new Error(errData.error || 'Error al exportar a Google Sheets');
  }

  return await response.json();
}

export function downloadSessionAsJSON(session: InterviewSession) {
  const exportData = {
    proyectoDeGrado: {
      titulo: THESIS_PROJECT_INFO.title,
      autores: THESIS_PROJECT_INFO.authors,
      institucion: THESIS_PROJECT_INFO.institution,
      facultad: THESIS_PROJECT_INFO.faculty,
      programa: THESIS_PROJECT_INFO.program,
      sedePrincipal: THESIS_PROJECT_INFO.location,
      lineaDeInvestigacion: THESIS_PROJECT_INFO.researchLine,
      sublinea: THESIS_PROJECT_INFO.subLine,
    },
    informanteClave: {
      codigo: session.studentCode || 'E01',
      nombre: session.participantName,
      rol: session.participantRole,
      semestre: session.semester,
      centroTutoríaOSede: session.centerLocation,
      fechaAplicacion: session.createdAt,
    },
    analisisCualitativoHermeneutico: session.summary,
    matrizCategorialResultados: session.structuredResponses,
    transcripcionHermeneutica: session.messages.map((m, idx) => ({
      linea: idx + 1,
      interlocutor: m.sender === 'agent' ? 'Investigadora (UniCórdoba)' : `[${session.studentCode || 'E01'}] ${session.participantName}`,
      mensaje: m.text,
      tipo: m.isClarifying ? 'Repregunta Aclaratoria (Probing)' : 'Pregunta/Respuesta Principal',
      hora: m.timestamp,
    })),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `entrevista-unicordoba-${session.studentCode || 'E01'}-${session.participantName.toLowerCase().replace(/\s+/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSessionAsCSV(session: InterviewSession) {
  if (!session.structuredResponses || session.structuredResponses.length === 0) return;

  const headers = [
    'Índice',
    'Código Informante',
    'Categoría de Análisis',
    'Subcategoría',
    'Tema',
    'Pregunta Base',
    'Síntesis del Testimonio',
    'Detalles de Repreguntas (Probing)',
    'Retos y Limitaciones',
    'Citas Textuales Verbatim (Capítulo 5)',
    'Valoración',
  ];
  const rows = session.structuredResponses.map((r) => [
    `"${r.topicIndex}"`,
    `"${session.studentCode || 'E01'}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.subCategory || '').replace(/"/g, '""')}"`,
    `"${(r.topic || '').replace(/"/g, '""')}"`,
    `"${(r.coreQuestion || '').replace(/"/g, '""')}"`,
    `"${(r.participantAnswerSummary || '').replace(/"/g, '""')}"`,
    `"${(r.clarifyingNotes || []).join('; ').replace(/"/g, '""')}"`,
    `"${(r.painPointsOrNeeds || []).join('; ').replace(/"/g, '""')}"`,
    `"${(r.directQuotes || []).join(' | ').replace(/"/g, '""')}"`,
    `"${r.sentiment || 'neutral'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `matriz-categorial-${session.studentCode || 'E01'}-${session.participantName.toLowerCase().replace(/\s+/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateSessionEmailReport(session: InterviewSession): { subject: string; body: string } {
  const code = session.studentCode || 'E01';
  const subject = `[EduPulse UniCórdoba] Entrevista ${code} - ${session.participantName} (${session.semester || 'Licenciatura'})`;

  const lines: string[] = [];
  lines.push(`=======================================================`);
  lines.push(`EDUPULSE · REPORTE CUALITATIVO DE ENTREVISTA`);
  lines.push(`Proyecto: La formación docente en la era de la inteligencia artificial`);
  lines.push(`Institución: Universidad de Córdoba · Licenciatura en Informática`);
  lines.push(`Investigadores: José Daniel Durango Caballero & Jefersson Ramírez Oviedo`);
  lines.push(`Director: Juan Carlos Giraldo Cardozo`);
  lines.push(`=======================================================`);
  lines.push(``);
  lines.push(`DATOS DEL INFORMANTE:`);
  lines.push(`• Código: ${code}`);
  lines.push(`• Participante: ${session.participantName}`);
  lines.push(`• Rol: ${session.participantRole || 'Docente en Formación'}`);
  lines.push(`• Semestre: ${session.semester || 'N/A'}`);
  lines.push(`• Sede / Centro de Tutoría: ${session.centerLocation || 'Montería'}`);
  lines.push(`• Fecha de Aplicación: ${new Date(session.createdAt || Date.now()).toLocaleString()}`);
  lines.push(`• Turnos de Diálogo: ${session.messages?.length || 0}`);
  lines.push(``);

  if (session.summary?.overview) {
    lines.push(`=== SÍNTESIS HERMENÉUTICA ===`);
    lines.push(session.summary.overview);
    lines.push(``);
  }

  const painPoints = session.summary?.keyPainPoints || [];
  if (painPoints.length > 0) {
    lines.push(`Puntos Críticos y Retos Identificados:`);
    painPoints.forEach((p: string) => lines.push(`  - ${p}`));
    lines.push(``);
  }

  if (session.structuredResponses && session.structuredResponses.length > 0) {
    lines.push(`=== MATRIZ CATEGORIAL Y CITAS DIRECTAS (CAPÍTULO 5) ===`);
    session.structuredResponses.forEach((r, idx) => {
      lines.push(`[${idx + 1}] Categoría: ${r.category} | Subcategoría: ${r.subCategory}`);
      if (r.topic) lines.push(`    Tema: ${r.topic}`);
      if (r.coreQuestion) lines.push(`    Pregunta: ${r.coreQuestion}`);
      if (r.participantAnswerSummary) lines.push(`    Síntesis: ${r.participantAnswerSummary}`);
      if (r.directQuotes && r.directQuotes.length > 0) {
        r.directQuotes.forEach((q) => lines.push(`    • Cita: "${q}"`));
      }
      const challenges = r.painPointsOrNeeds || r.challengesOrLimitations || [];
      if (challenges.length > 0) {
        lines.push(`    • Retos: ${challenges.join('; ')}`);
      }
      lines.push(``);
    });
  }

  lines.push(`=== TRANSCRIPCIÓN COMPLETA DEL DIÁLOGO CON CEREZA ===`);
  (session.messages || []).forEach((m, idx) => {
    const sender = m.sender === 'agent' ? 'Cereza (Entrevistadora IA)' : `[${code}] ${session.participantName}`;
    lines.push(`[${idx + 1}] ${sender}:`);
    lines.push(m.text);
    lines.push(``);
  });

  lines.push(`=======================================================`);
  lines.push(`EduPulse · Instrumento de Investigación Pedagógica · UniCórdoba`);
  return { subject, body: lines.join('\n') };
}

export function openEmailForSession(session: InterviewSession, targetEmail = 'josedudaca@gmail.com') {
  const { subject, body } = generateSessionEmailReport(session);
  // Copy full text to clipboard as safety backup
  navigator.clipboard.writeText(body).catch(() => {});
  const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl, '_blank');
}

export function copySessionToClipboard(session: InterviewSession): boolean {
  try {
    const { body } = generateSessionEmailReport(session);
    navigator.clipboard.writeText(body);
    return true;
  } catch {
    return false;
  }
}

export function downloadAllSessionsAsCSV(sessions: InterviewSession[]) {
  if (!sessions || sessions.length === 0) return;

  const headers = [
    'ID Sesión',
    'Fecha',
    'Código Informante',
    'Nombre',
    'Semestre',
    'Sede',
    'Estado',
    'Total Mensajes',
    'Resumen General',
    'Sentimiento',
  ];

  const rows = sessions.map((s) => [
    `"${s.id}"`,
    `"${new Date(s.createdAt).toLocaleString()}"`,
    `"${s.studentCode || 'E01'}"`,
    `"${(s.participantName || '').replace(/"/g, '""')}"`,
    `"${s.semester || ''}"`,
    `"${(s.centerLocation || '').replace(/"/g, '""')}"`,
    `"${s.status || 'active'}"`,
    `"${s.messages?.length || 0}"`,
    `"${(s.summary?.overview || '').replace(/"/g, '""')}"`,
    `"${(s.summary?.sentiment || s.summary?.overallSentiment || 'neutral').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `edupulse-todas-las-entrevistas-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadAllSessionsAsJSON(sessions: InterviewSession[]) {
  if (!sessions || sessions.length === 0) return;

  const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `edupulse-todas-las-entrevistas-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
