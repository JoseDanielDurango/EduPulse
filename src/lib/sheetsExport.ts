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
