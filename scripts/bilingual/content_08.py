en_08 = """DOCUMENT 08 | SECURITY, ACCESS CONTROL, AND ETHICAL DATA PROTECTION

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
"""
