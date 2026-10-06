# 06. Arquitectura del Sistema: Roles, Datos, Seguridad y Despliegue

## 1. Definicion y Proposito

La **Arquitectura del Sistema** establece el puente solido entre el diseno pedagogico-metodologico y la implementacion de software en produccion. Define los perfiles de usuario, el ciclo de vida del dato cualitativo, las garantias de privacidad y la infraestructura tecnica de ejecucion.

---

## 2. Definicion de Roles de Usuario

El sistema opera bajo dos roles claramente diferenciados:

1. **Investigador / Administrador (Autores del Trabajo de Grado):**
   * Configura y gestiona guiones cualitativos (`GuidesManager`).
   * Monitorea sesiones en tiempo real desde el panel general (`SessionsDashboard`).
   * Ejecuta el motor de sintesis analitica (`SummaryView`).
   * Exporta bases de datos estructuradas a Google Sheets, CSV o Excel para su posterior codificacion cualitativa.
2. **Docente en Formacion (Participante Informante):**
   * Accede a la sala de entrevista mediante un enlace directo o identificador de sesion.
   * Lee y valida digitalmente el **Consentimiento Informado**.
   * Participa en la conversacion semiestructurada mediante texto o voz en un entorno seguro y confidencial.

---

## 3. Pipeline de Datos en Tres Capas (Data Architecture)

```text
+------------------------------------------------------------------------+
| CAPA 1: INGESTA CRUDA (Raw Layer)                                      |
| - Registro integro de cada turno de habla con marca de tiempo.         |
| - Metadatos de sesion: duracion, modalidad (texto/audio) y sede.       |
| - Almacenamiento en coleccion 'sessions' de Cloud Firestore.           |
+------------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
| CAPA 2: TRANSFORMACION Y PRIVACIDAD (Enriched & PII Shield Layer)      |
| - Seudo-anonimizacion mediante codificacion de informante (E01...E12). |
| - Asignacion automatica de turno a la categoria y subcategoria.        |
| - Metricas de profundidad: conteo de repreguntas y longitud de texto.  |
+------------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
| CAPA 3: ANALISIS Y CAQDAS (Analytical Layer)                           |
| - Endpoint '/api/analyze-interview' para generacion de sintesis.       |
| - Extraccion estructurada de citas textuales directas vinculadas a     |
|   la Tabla 1 de categorias del informe de grado.                       |
| - Exportacion a formato compatible con ATLAS.ti, NVivo y hojas de datos.|
+------------------------------------------------------------------------+
```

---

## 4. Seguridad, Gobernanza y Privacidad (PII)

1. **Desidentificacion de Datos:**
   * Las transcripciones oficiales para el informe de grado sustituyen los nombres reales por codigos alfa-numericos sistematicos (`E01`, `E02`, etc.).
   * Se sanitizan menciones accidentales a datos de contacto personal o identificaciones institucionales privadas.

2. **Reglas de Seguridad de Firestore (`firestore.rules`):**
   * Proteccion de lectura y escritura en la base de datos documental.
   * Aislamiento de documentos de sesion para evitar accesos no autorizados.

3. **Gobernanza de Claves de API:**
   * La llave `GEMINI_API_KEY` se custodia exclusivamente en el servidor backend en la variable de entorno local `.env`.
   * El archivo `.env` esta formalmente excluido del repositorio Git mediante `.gitignore` para prevenir filtraciones involuntarias.

---

## 5. Infraestructura y Despliegue

* **Servidor de Aplicacion:** Servidor unificado en `server.ts` con Express y Vite en modo middleware, lo que permite servir tanto los endpoints de IA como la aplicacion web React en un unico puerto de escucha (`PORT=3000`).
* **Resiliencia de Red:** Capa de reintento exponencial en peticiones a la API de Google GenAI con retroceso gradual (*exponential backoff*) y respuestas de respaldo suave ante contingencias de red.
* **Compatibilidad de Despliegue:**
  * Modo local de investigacion: `npm run dev`.
  * Modo produccion empaquetado: `npm run build && npm start`.
  * Modo nube: Compatible para despliegue en Google Cloud Run mediante contenedor Docker o plataformas PaaS.
