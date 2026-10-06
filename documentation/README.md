# Documentacion Tecnica y Pedagogica de EduPulse

Este directorio reune la especificacion formal de la plataforma y del agente inteligente **EduPulse**, estructurada bajo la clasica arquitectura de **Sistemas Inteligentes en Educacion** ampliada a modelos de lenguaje (LLM) y adaptada a la **recoleccion de datos cualitativos hermeneuticos** para el trabajo de grado en la Universidad de Cordoba.

---

## Estructura de los Seis Componentes

La arquitectura del sistema se organiza en seis documentos tecnicos modulares:

```text
documentation/
├── README.md                          # Indice y vision general de la arquitectura
├── 01-modelo-del-tutor.md              # Como interactuar: Mediacion cualitativa, socrata y probing
├── 02-modelo-del-conocimiento.md       # Que investigar: Categorias, saberes curriculares y marcos teoricos
├── 03-modelo-del-alumno.md             # A quien se entrevista: Traza cognitiva y adaptacion segun semestre
├── 04-modelo-del-mundo.md              # Donde y como: Entorno conversacional, UX/UI, voz e integraciones
├── 05-prompt-maestro-rocas.md          # Orquestador de inferencia: Marco ROCAS (Rol, Objetivo, Contexto, Acciones, Salida)
└── 06-arquitectura-del-sistema.md      # Infraestructura, datos, seguridad, PII y despliegue
```

---

## Mapa Conceptual de la Arquitectura

```text
+------------------------------------------------------------------------+
|                      05. PROMPT MAESTRO (ROCAS)                        |
|        Motor de Inferencia y Orquestacion en Tiempo de Ejecucion       |
+------------------------------------------------------------------------+
         |                        |                        |
         v                        v                        v
+------------------+    +------------------+    +------------------+
| 01. MODELO       |    | 02. MODELO       |    | 03. MODELO       |
| DEL TUTOR        |    | DEL CONOCIMIENTO |    | DEL ALUMNO       |
| (Como mediar)    |    | (Que investigar) |    | (A quien guiar)  |
+------------------+    +------------------+    +------------------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                                  v
+------------------------------------------------------------------------+
| 04. MODELO DEL MUNDO (Interfaz, metafora de salon/cafe, voz y APIs)    |
+------------------------------------------------------------------------+
                                  |
                                  v
+------------------------------------------------------------------------+
| 06. ARQUITECTURA DEL SISTEMA (Datos, PII, Firestore, Express, Despliegue)
+------------------------------------------------------------------------+
```

---

## Proposito Academico e Investigativo

Estos documentos constituyen la base tecnica que respalda:
1. El **Capitulo 3 (Diseno Metodologico):** Operacionalizacion del guion y tecnicas de repregunta no sesgada.
2. El **Capitulo 4 (Desarrollo de la Investigacion):** Descripcion de la intervencion aplicada, recursos de software y procedimientos de recoleccion.
3. El **Capitulo 5 (Resultados):** Criterios de pre-codificacion, categorizacion automatizada y extraccion de citas textuales directas.
