# 03. Modelo del Alumno: Perfil del Informante y Traza del Progreso

## 1. Definicion y Proposito

El **Modelo del Alumno** (o Modelo del Informante) gestiona el estado cognoscitivo, curricular y contextual del docente en formacion que participa en la entrevista. 

A diferencia de un chatbot generico donde el contexto se confia unicamente a la ventana de memoria del LLM, en **EduPulse el modelo del alumno esta respaldado por un estado determinista estructurado en software**. Esto garantiza que el agente mantenga la coherencia pedagogica a lo largo de toda la sesion sin sufrir alucinaciones ni desorientacion de rol.

---

## 2. Variables Observables y Estado Programatico

El sistema registra y mantiene activas las siguientes variables de estado para cada participante:

```typescript
interface ParticipantState {
  studentCode: string;          // Identificador anonimizado (Ej: E-01, E-02)
  name: string;                 // Nombre de pila para trato calido
  semester: string;             // Semestre cursado (1° a 10°)
  stage: 'initial' |            // Semestres 1 a 3 (Fundamentacion)
         'intermediate' |       // Semestres 4 a 6 (Desarrollo Didactico)
         'advanced';            // Semestres 7 a 10 (Practica y Grado)
  centerLocation: string;       // Sede universitaria (Monteria, Lorica, Planeta Rica)
  consentGiven: boolean;        // Registro formal de consentimiento etico
  currentQuestionIndex: number; // Progreso en el guion (0 a N)
  currentClarificationCount: number; // Repreguntas en el topico activo (0 a 2)
  responseLengthHistory: number[];   // Longitud de caracteres por turno
  modalityUsed: 'text' | 'voice';    // Modalidad de interaccion preferida
}
```

---

## 3. Adaptacion Pedagogica por Etapas Formativas

La funcion `getPedagogicalOrientation` en el backend (`server.ts`) traduce el semestre del alumno en instrucciones operativas estrictas para el motor de inferencia:

### Etapa 1: Fundamentacion (Semestres 1° a 3°)
* **Perfil:** Estudiante novato asimilando materias iniciales de programacion, matematicas y medios. No tiene experiencia frente a grupos escolares.
* **Comportamiento del Agente:**
  * Tono calido, cercano, cero tecnicismos pedagogicos complejos.
  * Enfoca las preguntas en como la IA le ayuda a comprender conceptos dificiles, generar ideas o resolver dudas de clase.
  * **Regla negativa estricta:** Prohibido preguntar por evaluacion de alumnos escolares o planeaciones curriculares complejas.

### Etapa 2: Desarrollo Didactico (Semestres 4° a 6°)
* **Perfil:** Estudiante en materias pedagogicas intermedias, didactica de la informatica y produccion de medios audiovisuales. Realiza microclases y talleres formativos.
* **Comportamiento del Agente:**
  * Conecta el aprendizaje de la informatica con la creacion de materiales educativos y secuencias didacticas.
  * Indaga sobre como evalua la veracidad de los codigos y contenidos que entrega la IA.

### Etapa 3: Formacion Avanzada y Practica Docente (Semestres 7° a 10°)
* **Perfil:** Futuro docente con experiencia directa en aulas de colegios durante sus practicas pedagogicas.
* **Comportamiento del Agente:**
  * Trato horizontal entre colegas educadores.
  * Profundiza en dilemas reales: que ocurre cuando los estudiantes de colegio usan IA en sus clases de informatica, honestidad academica, transposicion didactica y adaptacion al curriculo escolar de Cordoba.

---

## 4. Trazabilidad del Progreso y Metricas Cualitativas

Durante la interaccion, el Modelo del Alumno alimenta automaticamente metricas que luego enriquecen el informe de investigacion:
1. **Indice de necesidad de repregunta:** Cuantas repreguntas fueron necesarias para alcanzar saturacion en cada categoria.
2. **Registro de latencia y modalidad:** Permite analizar si el estudiante se expresa con mayor riqueza mediante dictado por voz o por texto escrito.
3. **Persistencia de sesión:** El estado se sincroniza en Firestore en tiempo real, permitiendo reanudar entrevistas si ocurre una interrupcion de red.
