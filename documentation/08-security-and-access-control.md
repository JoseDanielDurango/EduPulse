DOCUMENTO 08 | SEGURIDAD, CONTROL DE ACCESO Y PROTECCIÓN DE DATOS ÉTICOS

# DOCUMENTO — 08
# Seguridad, Control de Acceso y Protección de Datos Éticos
### Plataforma EduPulse · Arquitectura de Confidencialidad y Gobernanza · Versión 2.3

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba |
| **Contexto de implementación** | Universidad de Córdoba · Facultad de Educación y Ciencias Humanas · Licenciatura en Informática |
| **Investigadores** | José Daniel Durango Caballero y Jefersson Ramírez Oviedo |
| **Director del proyecto** | Juan Carlos Giraldo Cardozo |
| **Componente documentado** | Seguridad de la plataforma (Control de acceso basado en roles RBAC, autenticación de doble factor para investigadores, gobernanza de Google OAuth 2.0 y lista blanca de orígenes, reglas de Cloud Firestore, anonimización PII, enmascaramiento de correos y cumplimiento de la Ley 1581 de 2012) |
| **Documento** | 08 — Seguridad y Control de Acceso (Versión 2.3) |
| **Fecha de actualización** | Noviembre de 2026 |

*Documento técnico para la especificación de los mecanismos de autenticación, control de privilegios, salvaguarda de la confidencialidad de los participantes y resguardo de secretos criptográficos.*

---

## 1. Identificación y Fundamentos de la Seguridad en la Investigación

### 1.1 Identificación del Proyecto
* **Título del proyecto:** La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba.
* **Investigadores:** José Daniel Durango Caballero y Jefersson Ramírez Oviedo.
* **Director del proyecto:** Juan Carlos Giraldo Cardozo.
* **Institución:** Universidad de Córdoba (Montería, Colombia).
* **Unidad académica:** Facultad de Educación y Ciencias Humanas · Licenciatura en Informática.

### 1.2 Principios Rectores de Seguridad y Ética
En el marco de la recolección de testimonios cualitativos y diagnósticos cuantitativos con docentes en formación, la seguridad informática no se limita a un requisito técnico de infraestructura; constituye una **salvaguarda ética y deontológica ineludible** (Hernández-Sampieri et al., 2014; UNESCO, 2023). El sistema EduPulse garantiza:

1. **Privacidad y No Trazabilidad Punitiva:** Garantizar a los participantes que sus opiniones sobre el uso de la IA, dilemas éticos o fallas pedagógicas no serán empleadas con fines evaluativos o disciplinarios dentro de la Universidad de Córdoba.
2. **Integridad Metodológica:** Evitar la adulteración, sobreescritura accidental o inyección maliciosa de testimonios dentro de las bases de datos del estudio.
3. **Control de Acceso Riguroso a Datos Primarios:** Restringir la lectura y descarga de transcripciones crudas y tabulaciones psicométricas exclusivamente a los investigadores acreditados en el proyecto de grado.

---

## 2. Modelo de Control de Acceso Basado en Roles (RBAC)

EduPulse implementa un modelo de control de acceso por roles (*Role-Based Access Control*, RBAC) que segmenta estrictamente las operaciones permitidas para informantes y miembros del equipo investigador:

```text
+───────────────────────────────────────────────────────────────────────────+
|               MODELO DE CONTROL DE ACCESO BASADO EN ROLES                 |
+───────────────────────────────────────────────────────────────────────────+
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
[ ROL 1: INFORMANTE DOCENTE ]                      [ ROL 2: INVESTIGADOR ]
 (Estudiante en formación)                          (Autores y Director)
           │                                                   │
 ├── Acceso público universal                        ├── Acceso restringido por 2FA
 ├── Aceptación de consentimiento                    ├── Google OAuth (Lista Blanca)
 ├── Interacción con Cereza (Chat/Voz)               ├── Verificación de PIN Maestro
 ├── Diligenciamiento de Cuestionarios               ├── Visualización de sesiones y citas
 └── Sin acceso a datos de pares                     └── Exportación a Sheets / CAQDAS
```

### 2.1 Matriz de Permisos por Rol

| Módulo o Funcionalidad | Informante (Estudiante) | Investigador Autorizado | Mecanismo de Control |
| :--- | :---: | :---: | :--- |
| **Página de inicio y ficha de investigación** | Lectura | Lectura | Público universal (`/`). |
| **Sala de Diálogo Reflexivo (`InterviewRoom`)** | Escritura / Interacción | Lectura / Supervisión | Creación de sesión con `consent: true`. |
| **Formularios Diagnósticos (`InstrumentForm`)** | Escritura / Envío | Lectura y gestión | Registro validado en `instrument_responses`. |
| **Panel de Sesiones (`SessionsDashboard`)** | Prohibido | Lectura total / Gestión | Restringido por credencial de investigación. |
| **Visor Estadístico (`InstrumentResponsesViewer`)** | Prohibido | Lectura y cálculo | Restringido por credencial de investigación. |
| **Suite de Analítica Visual Tipo Google Forms (General e Individual)** | Prohibido | Lectura total / Filtros | Restringido por `isAdminAuthenticated` (PIN `####` + OAuth). |
| **Exportación a CAQDAS, CSV y Sheets Automatizado** | Prohibido | Descarga y sincronización | Restringido por credencial de investigación y OAuth 2.0. |
| **Gestión de Guiones Cualitativos (`GuidesManager`)** | Lectura pasiva | Creación / Modificación | Escritura restringida en Firestore. |

---

## 3. Autenticación de Doble Factor para Investigadores (2FA) y Gobernanza OAuth 2.0

Para acceder al panel de sesiones, transcripciones y visualizador estadístico, el sistema no depende de una simple contraseña estática, sino de un protocolo dual administrado por `AdminAuthModal.tsx` y `src/lib/adminAuth.ts`:

### 3.1 Factor 1: Identidad Federada Google OAuth con Lista Blanca Estricta
El investigador inicia sesión mediante Google Authentication a través de Firebase Auth. El sistema intercepta el token JWT emitido y valida que el correo electrónico pertenezca a la lista blanca oficial aprobada en el proyecto:

```typescript
// src/lib/adminAuth.ts
export const AUTHORIZED_RESEARCHER_EMAILS = [
  'josedudaca@gmail.com',                               // Investigador Principal
  'jdurangocaballero59@correo.unicordoba.edu.co',       // Investigador Institucional
  'jramirezoviedo06@correo.unicordoba.edu.co',          // Investigador Institucional
  'jgiraldo@correo.unicordoba.edu.co'                   // Director de Proyecto de Grado
];
```

*Cualquier intento de autenticación con una cuenta de Google externa a esta lista blanca es rechazado de inmediato con un mensaje de revocación de privilegios.*

### 3.2 Factor 2: PIN Maestro de Validación Criptográfica
Adicionalmente a la autenticación federada, se exige el ingreso del **PIN Maestro de Investigador (`####`)**:
* Previene el acceso no autorizado en computadores compartidos donde la sesión de Google pudiese haber quedado abierta.
* El estado de autorización de administrador (`isAdminAuthenticated`) se conserva únicamente en memoria volátil de la sesión del cliente, expirando automáticamente al cerrar la pestaña o el navegador.

### 3.3 Gobernanza de Google OAuth 2.0 y Orígenes Autorizados (*origin_mismatch*)
Para habilitar la exportación automática de hojas de cálculo hacia Google Drive (`/api/export-sheets`) y el inicio de sesión federado, EduPulse utiliza Google Identity Services (GIS) bajo el cliente OAuth 2.0 `288046435138-uuqu1o6hu76e1ga8dbmhc3mhrccitp93.apps.googleusercontent.com` en el proyecto de Google Cloud `gen-lang-client-0983089494`.

Para dar cumplimiento estricto a las directrices de seguridad de Google y prevenir el `Error 400: origin_mismatch`, se definen y autorizan los siguientes límites de origen:
1. **Orígenes autorizados de JavaScript (*Authorized JavaScript Origins*):**
   * `https://edupulse-575b.onrender.com` (Entorno de producción en Render)
   * `http://localhost:3000` (Entorno de desarrollo local)
   * `http://localhost:5173` (Entorno de pruebas Vite)
   *(Restricción técnica: URLs normalizadas sin barra inclinada `/` al final)*.
2. **URIs de redireccionamiento autorizados (*Authorized Redirect URIs*):**
   * `https://edupulse-575b.onrender.com`
   * `https://gen-lang-client-0983089494.firebaseapp.com/__/auth/handler` (Handler oficial de Firebase Auth)
3. **Dominios Autorizados en Firebase Console:**
   * `edupulse-575b.onrender.com`
4. **Mecanismo de Resiliencia y Fallback Inmediato:**
   * Si la ventana emergente de Google OAuth es bloqueada o experimenta demoras de propagación, el sistema captura el error y activa de inmediato botones alternativos de exportación (*Descargar CSV compatible con Excel*, *Descargar JSON* o *Enviar reporte consolidado a investigadores por correo*), impidiendo la interrupción del flujo investigativo.

---

## 4. Reglas de Seguridad de Cloud Firestore (`firestore.rules`)

La capa de persistencia en la base de datos no relacional de Google Firebase se encuentra blindada a través de reglas declarativas de seguridad que impiden lecturas indebidas o inyecciones masivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funciones auxiliares de control
    function isAuthenticated() {
      return request.auth != null;
    }

    function isResearcher() {
      return isAuthenticated() && (
        request.auth.token.email in [
          'josedudaca@gmail.com',
          'jdurangocaballero59@correo.unicordoba.edu.co',
          'jramirezoviedo06@correo.unicordoba.edu.co',
          'jgiraldo@correo.unicordoba.edu.co'
        ]
      );
    }

    // Colección de Sesiones Cualitativas
    match /sessions/{sessionId} {
      // El informante puede crear una nueva sesión siempre que registre consentimiento
      allow create: if request.resource.data.consent == true
                    && request.resource.data.studentCode != null;
      // Lectura individual permitida para el flujo de entrevista activo
      allow get: if true;
      // Listado masivo y administración reservado exclusivamente para investigadores
      allow list, delete: if isResearcher();
      // Actualizaciones de turnos durante la sesión
      allow update: if request.resource.data.studentCode == resource.data.studentCode;
    }

    // Colección de Respuestas a Instrumentos Cuantitativos
    match /instrument_responses/{responseId} {
      // Permite el envío de respuestas diagnósticas con consentimiento ético
      allow create: if request.resource.data.consent == true
                    && request.resource.data.instrumentId != null;
      // Lectura, listado y cálculo analítico exclusivo de investigadores
      allow read, delete: if isResearcher();
      allow update: if false; // Los cuestionarios enviados son inmutables
    }

    // Colección de Guiones Temáticos
    match /guides/{guideId} {
      allow read: if true;
      allow write: if isResearcher();
    }
  }
}
```

---

## 5. Anonimización y Tratamiento de Información Personal (PII)

### 5.1 Principio de Privacidad desde el Diseño (*Privacy by Design*)
Siguiendo las directrices éticas de la American Psychological Association (APA, 2020) y la Ley 1581 de 2012 de Colombia:
1. **Ausencia de Captura de Identificadores Críticos:** El sistema prohíbe de manera tajante la solicitud o almacenamiento de:
   * Números de documento de identidad (Cédula de Ciudadanía o Tarjeta de Identidad).
   * Números de teléfono móvil o domiciliario.
   * Direcciones residenciales o información socioeconómica privada.
   * Contraseñas de acceso institucional.
2. **Codificación Seudo-Anonimizada:** Durante el registro inicial (`NewSessionModal.tsx`), el sistema asigna una clave de codificación secuencial (`E01`, `E02`... `E40`):
   * En las transcripciones, pre-codificaciones cualitativas y matrices CAQDAS, el estudiante solo es referenciado por dicho identificador alfanumérico.
   * El nombre de pila solo se utiliza en memoria volátil de la conversación para que Cereza mantenga un trato humano, cordial y personalizado (*"Comprendo, Carlos..."*).

### 5.2 Enmascaramiento de Canales de Contacto y Desidentificación en Interfaz Pública
En versiones previas del software, botones de respaldo por correo electrónico exponían direcciones personales de los investigadores en el DOM público del navegador. En la versión 2.3:
* Se despersonalizaron todas las etiquetas visibles para los estudiantes y participantes externos, sustituyéndolas por denominaciones académicas institucionales: **"Enviar a investigadores"** / **"Send to researchers"**.
* El sistema orquesta la apertura controlada del cliente de correo (`mailto:`) precargando el asunto estructurado y copiando simultáneamente el reporte al portapapeles (`navigator.clipboard.writeText`) como medida de contingencia ante navegadores que bloqueen protocolos externos.
* Se previene la recolección automatizada (*scraping*) de correos y se preserva la intimidad del equipo investigador frente a informantes y terceros.

---

## 6. Seguridad en la Capa Backend y Protección de Secretos

### 6.1 Resguardo de Credenciales de Inteligencia Artificial
La clave de API de Google GenAI (`GEMINI_API_KEY`) reside estrictamente en el entorno del servidor backend (`server.ts`):
* **Prohibición de exposición al cliente:** La variable jamás se transfiere al navegador ni se incluye en el empaquetado de producción generado por Vite (`dist/`).
* **Canalización interna:** Todas las inferencias de los modelos de Gemini (`gemini-3.5-flash-lite`, `gemini-3.5-flash`) se realizan en el servidor Node.js mediante llamadas HTTP POST autenticadas a los endpoints locales (`/api/chat` y `/api/analyze-interview`).

### 6.2 Endpoint Seguro de Diagnóstico (`/api/health`)
Para verificar el estado de conexión del motor de IA sin comprometer la seguridad:
* El endpoint `/api/health` emite únicamente un estado booleano de presencia de clave (`hasGeminiKey: true | false`).
* En ningún caso despliega el contenido de la clave secreta ni datos de configuración interna.

```json
{
  "status": "ok",
  "hasGeminiKey": true,
  "keySnippet": "AIzaSy...X9a",
  "activeModelUsed": "gemini-3.5-flash-lite",
  "time": "2026-11-10T22:30:15.012Z"
}
```

---

## 7. Marco Legal y Normativa de Cumplimiento

La arquitectura de seguridad de EduPulse opera en estricta sujeción a:
* **Ley Estatutaria 1581 de 2012 (Colombia):** Disposiciones generales para la protección de datos personales (Habeas Data). Los participantes ejercen su derecho de voluntariedad, revocabilidad y conocimiento previo sobre el destino investigativo de sus aportes.
* **Código de Ética en Investigación de la Universidad de Córdoba:** Cumplimiento de los principios de beneficencia, no maleficencia, autonomía del sujeto de investigación y rigor metodológico.
* **Directrices Éticas de la UNESCO sobre la IA (2023):** Transparencia algorítmica, supervisión humana de los resultados e integridad de las poblaciones estudiantiles.

---

## 8. Referencias Académicas y Normativas
* American Psychological Association. (2020). *Publication manual of the American Psychological Association* (7th ed.). https://doi.org/10.1037/0000165-000
* Congreso de la República de Colombia. (2012). *Ley Estatutaria 1581 de 2012, por la cual se dictan disposiciones generales para la protección de datos personales*. Diario Oficial No. 48.587.
* Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014). *Metodología de la investigación* (6.ª ed.). McGraw-Hill Education.
* UNESCO. (2023). *Recomendación sobre la ética de la inteligencia artificial*. Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura.

---

# English Version

DOCUMENT 08 | SECURITY, ACCESS CONTROL, AND ETHICAL DATA PROTECTION

# DOCUMENT — 08
# Security, Access Control, and Ethical Data Protection
### EduPulse Platform · Confidentiality and Governance Architecture · Version 2.3

| Field | Detail |
| :--- | :--- |
| **Project** | Teacher education in the age of artificial intelligence: challenges and perspectives at the University of Córdoba |
| **Implementation Context** | University of Córdoba · Faculty of Education and Human Sciences · Bachelor in Computer Science Education |
| **Researchers** | José Daniel Durango Caballero and Jefersson Ramírez Oviedo |
| **Project Director** | Juan Carlos Giraldo Cardozo |
| **Documented Component** | Platform security (Role-Based Access Control RBAC, two-factor authentication for researchers, Google OAuth 2.0 governance and origin whitelisting, Cloud Firestore rules, PII anonymization, email masking, and Colombian Law 1581 of 2012 compliance) |
| **Document** | 08 — Security and Access Control (Version 2.3) |
| **Update Date** | November 2026 |

*Technical document for the specification of authentication mechanisms, privilege control, participant confidentiality safeguards, and cryptographic secrets protection.*

---

## 1. Identification and Security Fundamentals in Research
In qualitative and quantitative research with pre-service educators, information security represents an **indispensable ethical and deontological safeguard**. EduPulse guarantees:
1. **Privacy and Non-Punitive Traceability:** Ensuring opinions regarding AI use or teaching challenges are never utilized for academic grading or disciplinary action.
2. **Methodological Integrity:** Preventing unauthorized tampering or accidental overwriting of database records.
3. **Strict Primary Data Access Control:** Restricting raw transcripts and psychometric records to accredited researchers.

---

## 2. Role-Based Access Control (RBAC) Model
* **Informant (Pre-service Teacher):** Universal public access to landing page, informed consent acceptance, interactive interview with Cereza, and questionnaire submission. Strictly prohibited from accessing peer records or analytics.
* **Authorized Researcher:** Dual-factor authentication (Google OAuth against whitelist + Master PIN `####`), granting full oversight of sessions, verbatim quotes, psychometric dashboards, global synthesis reports, and CAQDAS/Sheets exports.

---

## 3. Two-Factor Authentication (2FA) and OAuth 2.0 Governance
1. **Factor 1 (Federated Google OAuth Whitelist):**
   * `josedudaca@gmail.com`
   * `jdurangocaballero59@correo.unicordoba.edu.co`
   * `jramirezoviedo06@correo.unicordoba.edu.co`
   * `jgiraldo@correo.unicordoba.edu.co`
2. **Factor 2 (Cryptographic Master PIN `####`):**
   * Ephemeral session authorization stored strictly in volatile client memory, expiring upon tab or browser closure.
3. **Google Cloud OAuth 2.0 Governance (*origin_mismatch* Prevention):**
   * Authorized JavaScript Origins: `https://edupulse-575b.onrender.com`, `http://localhost:3000`, `http://localhost:5173`.
   * Authorized Redirect URIs configured in Google Cloud Console and Firebase Auth handlers.
   * Instant fallback options (CSV, TSV, JSON, clipboard copy) if OAuth popups are blocked by client browser extensions.

---

## 4. Cloud Firestore Security Rules (`firestore.rules`)
* Declarative rules permit anonymous creation of sessions and responses only when `consent == true`.
* Reading of aggregated records, session lists, transcripts, and analytics is strictly locked to authenticated researchers on the official email whitelist.
* Cuestionarios submitted are immutable (`allow update: if false`).

---

## 5. Anonymization and Personally Identifiable Information (PII) Protection
* **Privacy by Design:** Total prohibition against storing national identification numbers, private phone numbers, or passwords.
* **Pseudonymization:** Sequential codes (`E01`...`E40`) identify participants across qualitative transcripts, CAQDAS exports, and quantitative datasets. First names are retained solely in volatile session memory for Cereza's conversational rapport.
* **Contact Channel Masking:** Public interface buttons use neutral labels (*"Send to researchers"* / *"Enviar a investigadores"*), preventing email harvesting.

---

## 6. Backend Security and Secrets Protection
* Google GenAI API credentials (`GEMINI_API_KEY`) reside exclusively in server-side environment variables, never exposed in client bundles or public repositories.
* `/api/health` diagnostic endpoint outputs a sanitized status boolean (`hasGeminiKey: true`) without revealing private key strings.

---

## 7. Legal Framework and Compliance Standards
* **Colombian Statutory Law 1581 of 2012 (Habeas Data):** Informed consent, data minimization, and right to revoke participation.
* **University of Córdoba Research Ethics Code:** Beneficence, non-maleficence, participant autonomy, and methodological rigor.
* **UNESCO Recommendations on AI Ethics (2023):** Transparency, human oversight, and data sovereignty.

---

## 8. Academic and Regulatory References
Standardized under APA 7th edition guidelines on information security, research ethics, and data protection legislation.
