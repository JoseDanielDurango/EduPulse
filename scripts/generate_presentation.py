import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# Initialize presentation with 16:9 widescreen dimensions
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_slide_layout = prs.slide_layouts[6]

# Color Palette: Frutiger Aero Modern Software Design Palette
C_BG_DARK = RGBColor(7, 13, 24)          # #070D18
C_BG_CARD = RGBColor(16, 28, 48)         # #101C30
C_BG_CARD_ALT = RGBColor(12, 22, 38)     # #0C1626
C_CYAN_ACCENT = RGBColor(6, 182, 212)    # #06B6D4
C_CYAN_LIGHT = RGBColor(56, 189, 248)    # #38BDF8
C_EMERALD = RGBColor(16, 185, 129)       # #10B981
C_EMERALD_LIGHT = RGBColor(52, 211, 153) # #34D399
C_AMBER = RGBColor(245, 158, 11)         # #F59E0B
C_PURPLE = RGBColor(168, 85, 247)        # #A855F7
C_WHITE = RGBColor(255, 255, 255)
C_TEXT_LIGHT = RGBColor(226, 232, 240)   # #E2E8F0
C_TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
C_BORDER = RGBColor(30, 58, 95)          # #1E3A5F

# Paths to visual assets
ASSET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
IMG_AVATAR = os.path.join(ASSET_DIR, "cereza-avatar.png")
IMG_ICON = os.path.join(ASSET_DIR, "umbran-watch-icon.png")

def create_base_slide(badge_text="EDUPULSE · INGENIERÍA DE SOFTWARE Y DISEÑO", title_text=""):
    slide = prs.slides.add_slide(blank_slide_layout)
    
    # 1. Background rectangle
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_BG_DARK
    bg.line.color.rgb = C_BG_DARK
    
    # 2. Header Category Badge
    if badge_text:
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(5.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = RGBColor(12, 36, 60)
        badge.line.color.rgb = C_CYAN_ACCENT
        badge.line.width = Pt(1)
        tf = badge.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = badge_text.upper()
        run.font.name = "Segoe UI"
        run.font.size = Pt(9.5)
        run.font.bold = True
        run.font.color.rgb = C_CYAN_LIGHT

    # 3. Slide Title
    if title_text:
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.8))
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = title_text
        run.font.name = "Segoe UI"
        run.font.size = Pt(21)
        run.font.bold = True
        run.font.color.rgb = C_WHITE

    # 4. Footer line & branding
    footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.7), Inches(0.35))
    tf_f = footer_box.text_frame
    tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
    p_f = tf_f.paragraphs[0]
    p_f.alignment = PP_ALIGN.RIGHT
    run_f = p_f.add_run()
    run_f.text = "EduPulse v2.3 · Arquitectura de Software, UX/UI y Agente Cereza · Presentación Técnica Final"
    run_f.font.name = "Segoe UI"
    run_f.font.size = Pt(9)
    run_f.font.color.rgb = C_TEXT_MUTED
    
    return slide

def add_card(slide, left, top, width, height, title, items, subtitle=None, border_color=C_BORDER, header_color=C_CYAN_LIGHT):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = C_BG_CARD
    card.line.color.rgb = border_color
    card.line.width = Pt(1.2)
    
    txBox = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(height - 0.4))
    tf = txBox.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    # Title
    p_t = tf.paragraphs[0]
    r_t = p_t.add_run()
    r_t.text = title
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(13)
    r_t.font.bold = True
    r_t.font.color.rgb = header_color
    
    # Subtitle if present
    if subtitle:
        p_sub = tf.add_paragraph()
        r_sub = p_sub.add_run()
        r_sub.text = subtitle
        r_sub.font.name = "Segoe UI"
        r_sub.font.size = Pt(10)
        r_sub.font.italic = True
        r_sub.font.color.rgb = C_TEXT_MUTED
        p_sub.space_after = Pt(4)

    # Bullet items or description
    for item in items:
        p_item = tf.add_paragraph()
        p_item.space_before = Pt(3.5)
        if isinstance(item, tuple):
            r_bold = p_item.add_run()
            r_bold.text = item[0] + " "
            r_bold.font.name = "Segoe UI"
            r_bold.font.size = Pt(10.5)
            r_bold.font.bold = True
            r_bold.font.color.rgb = C_WHITE
            
            r_text = p_item.add_run()
            r_text.text = item[1]
            r_text.font.name = "Segoe UI"
            r_text.font.size = Pt(10)
            r_text.font.color.rgb = C_TEXT_LIGHT
        else:
            r_text = p_item.add_run()
            r_text.text = item
            r_text.font.name = "Segoe UI"
            r_text.font.size = Pt(10)
            r_text.font.color.rgb = C_TEXT_LIGHT

def add_stat_box(slide, left, top, width, height, stat_num, stat_title, stat_desc, color=C_CYAN_LIGHT):
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    box.fill.solid()
    box.fill.fore_color.rgb = C_BG_CARD_ALT
    box.line.color.rgb = color
    box.line.width = Pt(1.5)
    
    txBox = slide.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.15), Inches(width - 0.3), Inches(height - 0.3))
    tf = txBox.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p_num = tf.paragraphs[0]
    r_num = p_num.add_run()
    r_num.text = stat_num
    r_num.font.name = "Segoe UI"
    r_num.font.size = Pt(22)
    r_num.font.bold = True
    r_num.font.color.rgb = color
    
    p_title = tf.add_paragraph()
    r_t = p_title.add_run()
    r_t.text = stat_title
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(11)
    r_t.font.bold = True
    r_t.font.color.rgb = C_WHITE
    
    p_desc = tf.add_paragraph()
    r_d = p_desc.add_run()
    r_d.text = stat_desc
    r_d.font.name = "Segoe UI"
    r_d.font.size = Pt(9.5)
    r_d.font.color.rgb = C_TEXT_MUTED


# ==========================================
# SLIDE 1: PORTADA TÉCNICA (TITLE SLIDE)
# ==========================================
s1 = prs.slides.add_slide(blank_slide_layout)
bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
bg1.fill.solid()
bg1.fill.fore_color.rgb = C_BG_DARK
bg1.line.color.rgb = C_BG_DARK

# Header Badge
badge1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.8), Inches(6.0), Inches(0.4))
badge1.fill.solid()
badge1.fill.fore_color.rgb = RGBColor(12, 36, 60)
badge1.line.color.rgb = C_CYAN_ACCENT
tf_b1 = badge1.text_frame
p_b1 = tf_b1.paragraphs[0]
p_b1.alignment = PP_ALIGN.CENTER
r_b1 = p_b1.add_run()
r_b1.text = "DESARROLLO DE SOFTWARE · ARQUITECTURA WEB Y AGENTE IA"
r_b1.font.name = "Segoe UI"
r_b1.font.size = Pt(10)
r_b1.font.bold = True
r_b1.font.color.rgb = C_CYAN_LIGHT

# Title
t_box1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.4), Inches(8.8), Inches(2.3))
tf1 = t_box1.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0

p1 = tf1.paragraphs[0]
r1 = p1.add_run()
r1.text = "EduPulse v2.3: Desarrollo de la Plataforma Web y Agente Inteligente"
r1.font.name = "Segoe UI"
r1.font.size = Pt(28)
r1.font.bold = True
r1.font.color.rgb = C_WHITE

p1_sub = tf1.add_paragraph()
p1_sub.space_before = Pt(8)
r1_sub = p1_sub.add_run()
r1_sub.text = "Ingeniería de Software, Diseño Frutiger Aero Glassmorphism, Motor de Voz Dual y Cereza"
r1_sub.font.name = "Segoe UI"
r1_sub.font.size = Pt(16)
r1_sub.font.color.rgb = C_CYAN_LIGHT

# Version Tag Pill
plat_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.0), Inches(8.8), Inches(0.8))
plat_box.fill.solid()
plat_box.fill.fore_color.rgb = C_BG_CARD
plat_box.line.color.rgb = C_EMERALD
plat_box.line.width = Pt(1.5)
tf_plat = plat_box.text_frame
tf_plat.margin_left = Inches(0.25)
tf_plat.margin_top = Inches(0.12)
p_plat = tf_plat.paragraphs[0]
r_p1 = p_plat.add_run()
r_p1.text = "RELEASE FINAL v2.3  |  "
r_p1.font.name = "Segoe UI"
r_p1.font.size = Pt(14)
r_p1.font.bold = True
r_p1.font.color.rgb = C_EMERALD_LIGHT

r_p2 = p_plat.add_run()
r_p2.text = "React 19 · Node Express · Gemini 2.5 Flash · Firestore · OAuth 2.0"
r_p2.font.name = "Segoe UI"
r_p2.font.size = Pt(13)
r_p2.font.color.rgb = C_TEXT_LIGHT

# Metadata Box
meta_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.05), Inches(8.8), Inches(1.75))
meta_card.fill.solid()
meta_card.fill.fore_color.rgb = C_BG_CARD_ALT
meta_card.line.color.rgb = C_BORDER
tf_meta = meta_card.text_frame
tf_meta.margin_left = Inches(0.25)
tf_meta.margin_top = Inches(0.15)

p_m1 = tf_meta.paragraphs[0]
r_m1_b = p_m1.add_run()
r_m1_b.text = "Desarrolladores de la Plataforma: "
r_m1_b.font.bold = True
r_m1_b.font.color.rgb = C_CYAN_LIGHT
r_m1_t = p_m1.add_run()
r_m1_t.text = "José Daniel Durango Caballero & Jefersson Ramírez Oviedo\n"
r_m1_t.font.color.rgb = C_WHITE

p_m2 = tf_meta.add_paragraph()
r_m2_b = p_m2.add_run()
r_m2_b.text = "Director del Proyecto: "
r_m2_b.font.bold = True
r_m2_b.font.color.rgb = C_CYAN_LIGHT
r_m2_t = p_m2.add_run()
r_m2_t.text = "Mag. Juan Carlos Giraldo Cardozo\n"
r_m2_t.font.color.rgb = C_WHITE

p_m3 = tf_meta.add_paragraph()
r_m3_b = p_m3.add_run()
r_m3_b.text = "Programa Académico: "
r_m3_b.font.bold = True
r_m3_b.font.color.rgb = C_CYAN_LIGHT
r_m3_t = p_m3.add_run()
r_m3_t.text = "Licenciatura en Informática · Universidad de Córdoba · Noviembre 2026"
r_m3_t.font.color.rgb = C_WHITE

# Add Cereza Avatar & Watch Icon on right
if os.path.exists(IMG_AVATAR):
    s1.shapes.add_picture(IMG_AVATAR, Inches(10.2), Inches(1.5), Inches(2.4), Inches(2.4))

if os.path.exists(IMG_ICON):
    s1.shapes.add_picture(IMG_ICON, Inches(10.4), Inches(4.5), Inches(2.0), Inches(2.0))


# ==========================================
# SLIDE 2: VISIÓN DEL PRODUCTO DE SOFTWARE
# ==========================================
s2 = create_base_slide("INGENIERÍA DE SOFTWARE · CONCEPTO DEL PRODUCTO", "Visión del Software: De Formularios Estáticos a Entorno Inteligente")

add_card(s2, 0.8, 1.8, 3.7, 4.9, "1. El Problema del Software Clásico", [
    ("Formularios Aburridos:", "Las herramientas tradicionales (Google Forms, Typeform) son rígidas y reciben respuestas telegráficas o evasivas."),
    ("Falta de Interactividad:", "No son capaces de repreguntar ni profundizar cuando una respuesta es incompleta o contradictoria."),
    ("Chatbots Genéricos:", "Los bots comerciales convencionales suenan planos, sumisos y no tienen contexto pedagógico.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s2, 4.8, 1.8, 3.7, 4.9, "2. La Solución: EduPulse Web App", [
    ("Plataforma Híbrida:", "Combina diálogo inteligente socrático en profundidad con formularios cuantitativos guiados."),
    ("Agente con Identidad:", "Cereza, dotada de personalidad magnética y sofisticada que desata la conversación real."),
    ("Sincronización Total:", "Base de datos reactiva en tiempo real (Cloud Firestore) y resiliencia offline ante caídas de red.")
], border_color=C_CYAN_ACCENT)

add_card(s2, 8.8, 1.8, 3.7, 4.9, "3. Desafíos de Ingeniería Superados", [
    ("Latencia de Inferencia:", "Respuestas rápidas de LLM (<1.5s) con feedback visual y microestados informativos."),
    ("Audio en Dispositivos Móviles:", "Reemplazo de la inestable Web Speech API por grabación nativa y Gemini multimodal."),
    ("Cero Pérdida de Datos:", "Guardado en caliente de turnos y borradores para reanudar sesiones interrumpidas.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 3: ARQUITECTURA TÉCNICA Y STACK
# ==========================================
s3 = create_base_slide("ARQUITECTURA DE SOFTWARE · STACK TECNOLÓGICO", "Arquitectura Full-Stack y Ecosistema de Tecnologías")

add_card(s3, 0.8, 1.8, 3.7, 4.9, "Frontend (Cliente)", [
    ("React 19 + TypeScript:", "Tipado estricto, componentes funcionales reactivos y modularidad limpia."),
    ("Vite 8.3:", "Empaquetador ultra-rápido con Hot Module Replacement y build optimizado."),
    ("Tailwind CSS v4:", "Estilizado atómico moderno, utilidades Frutiger Aero y diseño responsive."),
    ("Lucide React:", "Iconografía vectorizada limpia y accesible en toda la interfaz."),
    ("Web Audio API:", "Captura espectral con AnalyserNode para visualizador de micrófono en vivo.")
], border_color=C_CYAN_ACCENT)

add_card(s3, 4.8, 1.8, 3.7, 4.9, "Backend (Servidor Express)", [
    ("Node.js + Express (tsx):", "Servidor ligero en TypeScript para API REST segura y endpoints especializados."),
    ("Pipeline de Inferencia IA:", "Orquestación del SDK oficial Google GenAI con temperatura controlada (0.4)."),
    ("Endpoints Principales:", "• /api/chat (diálogo interactivo)\n• /api/transcribe-audio (voz a texto)\n• /api/analyze-interview (síntesis)\n• /api/export-sheets (Google Sheets)"),
    ("Seguridad de Secretos:", "La clave GEMINI_API_KEY nunca se expone al cliente.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s3, 8.8, 1.8, 3.7, 4.9, "Nube, Base de Datos y Auth", [
    ("Google Cloud Firestore:", "Base de datos NoSQL reactiva en tiempo real para sesiones y cuestionarios."),
    ("Firebase Authentication:", "Control de acceso con Google Identity Services y reglas de seguridad declarativas."),
    ("Google Cloud OAuth 2.0:", "Integración autorizada con Google Sheets API v4 para generar libros estructurados."),
    ("Render Hosting:", "Despliegue automatizado continuo en la nube (CI/CD conectado a GitHub).")
], border_color=C_PURPLE, header_color=C_PURPLE)


# ==========================================
# SLIDE 4: DISEÑO FRUTIGER AERO GLASSMORPHISM
# ==========================================
s4 = create_base_slide("DISEÑO DE INTERFAZ (UI) · IDENTIDAD VISUAL", "Diseño de Interfaz: Estética Frutiger Aero Modern Glassmorphism")

add_card(s4, 0.8, 1.8, 3.7, 4.9, "1. Filosofía Visual Frutiger Aero", [
    ("Retrofuturismo Limpio:", "Inspirado en la estética tecnológica optimista de los 2000s: luz, transparencias, dinamismo y frescura visual."),
    ("Contraste Elegante:", "Fondo oscuro azul medianoche (#070D18) que resalta elementos bioluminiscentes sin fatiga visual."),
    ("Microinteracciones:", "Botones con efectos glossy, brillos dinámicos y retroalimentación táctil suave.")
], border_color=C_CYAN_ACCENT)

add_card(s4, 4.8, 1.8, 3.7, 4.9, "2. Capas Glassmorphic Translúcidas", [
    ("Backdrop Blur (Desenfoque):", "Efectos CSS backdrop-blur-md que simulan cristal orgánico sobre fondos degradados."),
    ("Bordes Luminiscentes:", "Delimitaciones sutiles border-white/10 y border-cyan-500/20 que aportan profundidad 3D."),
    ("Cards Flotantes (aero-card):", "Tarjetas elevadas con sombras difusas multicapa (shadow-lg) para jerarquizar el contenido.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s4, 8.8, 1.8, 3.7, 4.9, "3. Identidad Simbólica de Marca", [
    ("El Reloj de Umbra:", "Sello místico refinado con resplandores aguamarina que acompaña la presencia de Cereza."),
    ("Avatar Interactivo:", "Representación visual de Cereza con animaciones de pulso y estados de escucha activa."),
    ("Bilingüismo Instantáneo:", "Conmutador fluido de idioma (ES/EN) en la barra superior sin recargar la página.")
], border_color=C_PURPLE, header_color=C_PURPLE)


# ==========================================
# SLIDE 5: EXPERIENCIA MÓVIL Y PREVENCIÓN DE ERRORES
# ==========================================
s5 = create_base_slide("EXPERIENCIA DE USUARIO (UX) · MOBILE-FIRST", "Diseño Mobile-First, Ergonomía Táctil y Prevención de Cierres")

add_card(s5, 0.8, 1.8, 3.7, 4.9, "1. Mobile Bottom Navigation", [
    ("Componente MobileBottomNav:", "Barra flotante inferior anclada ergonómicamente al alcance natural del pulgar."),
    ("Accesos Directos Táctiles:", "Botones táctiles grandes para Chat, Instrumentos, Nueva Sesión e Idioma."),
    ("Indicadores Activos Luminosos:", "Resplandor cian sobre la sección seleccionada para guiar al usuario.")
], border_color=C_CYAN_ACCENT)

add_card(s5, 4.8, 1.8, 3.7, 4.9, "2. Botones de Retorno en Pantalla", [
    ("Go-Back Arrows (ArrowLeft):", "Botones de retorno explícitos integrados dentro de la aplicación."),
    ("Protección Universal:", "Permite volver a la pantalla principal o cambiar de sección sin recurrir a controles externos del navegador."),
    ("Consistencia:", "Presente en la sala de chat, cuestionarios diagnósticos y matrices de resultados.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s5, 8.8, 1.8, 3.7, 4.9, "3. Blindaje Contra Gestos (popstate)", [
    ("El Problema del 'Swiping':", "En celulares Android/iOS, deslizar la pantalla hacia atrás cerraba la entrevista por error."),
    ("Intercepción de Historial:", "Uso de window.history.pushState y escucha del evento popstate para atrapar la salida."),
    ("Modal de Confirmación:", "Alerta preventiva para pausar y guardar la conversación de forma segura.")
], border_color=C_AMBER, header_color=C_AMBER)


# ==========================================
# SLIDE 6: DISEÑO DEL AGENTE CONVERSACIONAL (CEREZA)
# ==========================================
s6 = create_base_slide("DISEÑO DEL AGENTE IA · PERSONALIDAD Y COMPORTAMIENTO", "El Agente Conversacional: Cereza y su Lógica de Mediación")

add_card(s6, 0.8, 1.8, 4.0, 4.9, "Personalidad Magnética (Bayonetta)", [
    ("Cero Sumisión Burocrática:", "Cereza no dice '¿En qué puedo ayudarte hoy?'. Habla con aplomo aristocrático, madurez e ingenio."),
    ("Horizontalidad Colegial:", "Trata al estudiante como un futuro colega educador, generando confianza y apertura inmediata."),
    ("Ingenio y Toque Mordaz:", "Si el usuario responde con frases de manual o clichés, Cereza lo interpela con simpatía: 'Vaya jugada... pero cuéntame la verdad: ¿fue tu aliada o tu muleta?'."),
    ("Voz Impecable:", "Respeto universitario estricto sin perder su chispa lúdica.")
], border_color=C_CYAN_ACCENT)

add_card(s6, 5.1, 1.8, 4.0, 4.9, "Mecanismo de Escucha y Probing", [
    ("Mirroring Dialéctico (Eco Reflexivo):", "Retoma conceptos clave expresados por el usuario para construir puentes cognitivos."),
    ("Preguntas Atómicas:", "Estricta restricción de UNA sola pregunta por turno para evitar dispersión."),
    ("Probing de Ejemplificación:", "Obliga a relatar anécdotas situadas en microclases y talleres de programación."),
    ("Combate al Efecto Muleta:", "Estimula permanentemente el juicio pedagógico y la autoría crítica del futuro docente.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s6, 9.4, 1.8, 3.1, 4.9, "Cierre Autónomo", [
    ("Saturación Inteligente:", "Decide cuándo concluir sin número rígido de preguntas."),
    ("Turns < 5:", "Continúa explorando dimensiones."),
    ("Turns >= 6:", "Sintetiza aprendizajes y declara isInterviewFinished: true."),
    ("Turns >= 9:", "Cierre para evitar fatiga.")
], border_color=C_AMBER, header_color=C_AMBER)


# ==========================================
# SLIDE 7: EL PROMPT MAESTRO (FRAMEWORK ROCAS)
# ==========================================
s7 = create_base_slide("INGENIERÍA DE PROMPTS · FRAMEWORK ROCAS", "Ingeniería de Instrucciones: El Framework ROCAS en Tiempo Real")

add_card(s7, 0.8, 1.8, 7.8, 4.9, "Estructura del Prompt Maestro en server.ts", [
    ("R — Rol:", "Cereza: entrevistadora cualitativa refinada, ingeniosa, empática y de alto rigor técnico."),
    ("O — Objetivo:", "Sostener una conversación auténtica que revele prácticas reales y dilemas con la IA."),
    ("C — Contexto:", "Licenciatura en Informática, Universidad de Córdoba (Montería y sedes de la región)."),
    ("A — Acciones:", "Probing agudo, repreguntas atómicas, no directividad y prohibición de emitir calificaciones."),
    ("S — Salida:", "Contrato JSON estricto con campos validados: reply, isInterviewFinished, category, extractedInsight.")
], border_color=C_CYAN_ACCENT)

add_card(s7, 8.9, 1.8, 3.6, 4.9, "Parámetros y Calibración", [
    ("Modelo de Inferencia:", "Google Gemini 2.5 Flash en streaming y JSON mode."),
    ("Temperatura 0.4:", "Control fino: creatividad conversacional sin alucinaciones técnicas."),
    ("Bilingüismo Dual:", "Prompts en espejo (ES y EN) inyectados según la preferencia del usuario."),
    ("Esquema Zod/JSON:", "Validación de tipos para prevenir fallos de renderizado en React.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 8: LÍNEA TEMPORAL DEL DESARROLLO (SPRINTS 1 AL 5)
# ==========================================
s8 = create_base_slide("PROCESO DE DESARROLLO · LÍNEA TEMPORAL", "Evolución del Desarrollo de EduPulse: Del Prototipo a la Versión 2.3")

add_stat_box(s8, 0.8, 1.8, 2.1, 4.9, "SPRINT 1", "Fundación", "• Setup React 19 + Express\n• Conexión con Gemini API\n• Primera sala de chat básica\n• Definición de guiones", color=C_CYAN_LIGHT)
add_stat_box(s8, 3.2, 1.8, 2.1, 4.9, "SPRINT 2", "Agente Cereza", "• Nacimiento de Cereza\n• Framework ROCAS\n• Contrato JSON estructurado\n• Probing hermenéutico", color=C_EMERALD_LIGHT)
add_stat_box(s8, 5.6, 1.8, 2.1, 4.9, "SPRINT 3", "Cuantitativo", "• Cuestionarios psicométricos\n• Firestore persistencia reactiva\n• Borradores autosave offline\n• Admin login básico", color=C_AMBER)
add_stat_box(s8, 8.0, 1.8, 2.1, 4.9, "SPRINT 4", "UX Móvil Glass", "• Rediseño Frutiger Aero\n• MobileBottomNav táctil\n• Botones de retorno universales\n• Guarda popstate móvil", color=C_CYAN_LIGHT)
add_stat_box(s8, 10.4, 1.8, 2.1, 4.9, "SPRINT 5", "Versión 2.3", "• Motor de voz dual multimodal\n• Google Forms Analytics visual\n• Google Sheets OAuth 2.0\n• Síntesis resiliente fallback", color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 9: EVOLUCIÓN DEL SISTEMA DE AUDIO
# ==========================================
s9 = create_base_slide("EVOLUCIÓN TÉCNICA · SISTEMA DE VOZ", "Evolución de Audio: Del Web Speech API al Motor de Voz Dual con IA")

add_card(s9, 0.8, 1.8, 3.7, 4.9, "1. La Fragilidad del Web Speech API", [
    ("Incompatibilidad Móvil:", "webkitSpeechRecognition falla con frecuencia en iOS Safari, Android Brave y Firefox."),
    ("Corte por Silencios:", "El navegador cerraba el micrófono intempestivamente si el estudiante se detenía a pensar."),
    ("Falta de Retroalimentación:", "El usuario no sabía si el micrófono realmente estaba capturando su voz.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s9, 4.8, 1.8, 3.7, 4.9, "2. Grabación Nativa y Visualizador", [
    ("MediaRecorder Nativo:", "Captura directa del flujo de audio del hardware en formatos webm/mp4/wav."),
    ("LiveMicVisualizer (Canvas):", "Componente reactivo que procesa AudioContext y AnalyserNode en tiempo real."),
    ("Ondas Dinámicas:", "Animación de ondas sonoras color cian/esmeralda que reaccionan a la amplitud de la voz.")
], border_color=C_CYAN_ACCENT)

add_card(s9, 8.8, 1.8, 3.7, 4.9, "3. Transcripción Multimodal en Backend", [
    ("Endpoint /api/transcribe-audio:", "Envía los bytes grabados al servidor Express."),
    ("Gemini Multimodal Audio:", "Google Gemini 2.5 Flash procesa el archivo de audio directamente."),
    ("Transcripción Perfecta:", "Puntuación correcta, comprensión de modismos cordobeses y 100% compatible con cualquier celular.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 10: VALIDACIÓN INTERACTIVA DE CUESTIONARIOS
# ==========================================
s10 = create_base_slide("INGENIERÍA FRONTEND · ACCESIBILIDAD Y FORMULARIOS", "Módulo de Cuestionarios: Validación Guiada Fila por Fila")

add_card(s10, 0.8, 1.8, 3.7, 4.9, "1. El Problema del Bloqueo Silencioso", [
    ("Frustración del Usuario:", "Al enviar cuestionarios largos, un error genérico impedía el envío sin indicar el campo exacto."),
    ("Desorientación en Celular:", "El usuario pensaba que el botón estaba roto porque no veía qué pregunta le faltaba."),
    ("Casilla de Ética Omitida:", "Muchos participantes llenaban las preguntas pero olvidaban la casilla de consentimiento.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s10, 4.8, 1.8, 3.7, 4.9, "2. Banner Interactivo de Salto Dinámico", [
    ("Píldoras Dinámicas (missingFieldsList):", "Desglose visual con botones para cada ítem pendiente ([Consentimiento], [Pregunta 5], etc.)."),
    ("Scroll Fluido (scrollIntoView):", "Al tocar una píldora, la pantalla salta directo al campo omitido."),
    ("Anillo de Resplandor Animado:", "Aplica un resplandor luminiscente de 3 segundos para ubicar la pregunta al instante.")
], border_color=C_CYAN_ACCENT)

add_card(s10, 8.8, 1.8, 3.7, 4.9, "3. Resaltado Fila por Fila en Matrices", [
    ("Tablas matrix_grid Guiadas:", "Cada fila sin responder se resalta en rojo/ámbar con una etiqueta 'Falta responder'."),
    ("Aceptación en 1 Clic:", "La tarjeta de ética incluye el botón directo 'Aceptar Consentimiento Ahora'."),
    ("Resumen Inferior:", "Aviso previo al botón de envío para no tener que subir hasta el tope de la página.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 11: MOTOR DE SÍNTESIS CUALITATIVA RESILIENTE
# ==========================================
s11 = create_base_slide("RESILIENCIA DE DATOS · QUALITATIVE SYNTHESIS", "Resiliencia de Datos: Eliminación de Condiciones de Carrera y Fallback")

add_card(s11, 0.8, 1.8, 3.7, 4.9, "1. Condición de Carrera en el Cierre", [
    ("El Problema Detectado:", "Al presionar 'Finalizar Entrevista', React desmontaba la sala antes de que el backend devolviera el análisis."),
    ("Riesgo:", "La matriz cualitativa quedaba en blanco o la sesión se guardaba incompleta."),
    ("La Solución:", "Bloqueo asíncrono estricto con await en handleTriggerFullSynthesis y estado de carga informativo.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s11, 4.8, 1.8, 3.7, 4.9, "2. Fallback Heurístico Local", [
    ("Módulo qualitativeSynthesis.ts:", "Motor determinista que opera como red de seguridad si la API neuronal falla o satura."),
    ("Extracción de Citas:", "Escanea los mensajes del usuario, detecta oraciones clave y las clasifica en los tres ejes deductivos."),
    ("Cálculo de Sentimiento:", "Determina si el tono fue positivo, crítico o cauteloso analizando el léxico pedagógico empleado.")
], border_color=C_CYAN_ACCENT)

add_card(s11, 8.8, 1.8, 3.7, 4.9, "3. Reanudación Transparente en Home", [
    ("Detección de Sesión Abierta:", "Si la página se recarga o se pierde la conexión, el Home detecta la entrevista en curso."),
    ("Banner de Recuperación:", "Botones destacados: 'Continuar Entrevista con Cereza' o 'Ver Matriz de Resultados'."),
    ("Cero Pérdida:", "El trabajo del informante queda 100% a salvo en localStorage y Firestore.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 12: SUITE DE ANALÍTICA TIPO GOOGLE FORMS
# ==========================================
s12 = create_base_slide("VISUALIZACIÓN DE DATOS · COMPONENTES ANALÍTICOS", "Suite de Analítica Visual: Paneles Generales e Individuales")

add_card(s12, 0.8, 1.8, 5.7, 4.9, "Dashboard General (GoogleFormsCharts.tsx)", [
    ("Inspirado en Google Forms:", "Diseño gráfico limpio, intuitivo y de lectura instantánea de resultados agregados."),
    ("Diagramas Circulares de Dona:", "Proporciones porcentuales de informantes por semestre (1° a 10°) y por sede universitaria."),
    ("Barras Horizontales con Porcentajes:", "Frecuencias relativas y conteo absoluto de opciones en preguntas múltiples y Likert."),
    ("Estadística Descriptiva en Vivo:", "Cálculo reactivo de medias aritméticas (x̄) y desviaciones estándar (σ).")
], border_color=C_CYAN_ACCENT)

add_card(s12, 6.8, 1.8, 5.7, 4.9, "Analítica Individual (InterviewsAnalyticsView.tsx)", [
    ("Selector de Informante (E01...E40):", "Inspección detallada y personalizada de cada participante del estudio."),
    ("Radar de Competencias Tecno-pedagógicas:", "Gráfico poligonal multieje: autonomía crítica, didáctica y competencia técnica."),
    ("Desglose Emocional:", "Proporción de reflexiones entusiastas, cautelosas o de rechazo frente a la IA."),
    ("Tarjetas de Citas Categorizadas:", "Evidencias textuales clasificadas con botón de copia rápida al portapapeles.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 13: GOBERNANZA, SEGURIDAD Y OAUTH 2.0
# ==========================================
s13 = create_base_slide("SEGURIDAD Y CLOUD INTEGRATION · DOCUMENTO 08", "Gobernanza de Datos, Seguridad RBAC y Google Cloud OAuth 2.0")

add_card(s13, 0.8, 1.8, 3.7, 4.9, "1. Control de Acceso RBAC y 2FA", [
    ("Doble Factor para Investigadores:", "Inicio con Google OAuth verificado contra lista blanca + PIN Maestro '0412'."),
    ("Ocultamiento de Datos Crudos:", "Los estudiantes jamás acceden a las transcripciones ni gráficas de sus pares."),
    ("Enmascaramiento PII:", "Los botones públicos dicen 'Enviar a investigadores', protegiendo los correos del equipo.")
], border_color=C_CYAN_ACCENT)

add_card(s13, 4.8, 1.8, 3.7, 4.9, "2. Integración Google Cloud OAuth 2.0", [
    ("Resolución de origin_mismatch:", "Registro de orígenes autorizados de JavaScript en Google Cloud Console para producción Render."),
    ("Google Identity Services (GIS):", "Ventana oficial de consentimiento seguro sin exponer credenciales."),
    ("Permisos Estrictos:", "Alcances específicos para crear archivos sin invadir el Drive personal del usuario.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s13, 8.8, 1.8, 3.7, 4.9, "3. Exportación en 3 Pestañas (/api/export-sheets)", [
    ("Generación Automatizada:", "Crea un libro de cálculo en Google Drive con 1 solo clic."),
    ("Pestaña 1 (Ficha):", "Metadatos, caracterización y consentimiento ético."),
    ("Pestaña 2 (Citas):", "Matriz cualitativa clasificada por categorías de la tesis."),
    ("Pestaña 3 (Transcripción):", "Diálogo íntegro turno a turno entre Cereza y el docente.")
], border_color=C_PURPLE, header_color=C_PURPLE)


# ==========================================
# SLIDE 14: DEMOSTRACIÓN EN VIVO Y CIERRE TÉCNICO
# ==========================================
s14 = create_base_slide("LANZAMIENTO FINAL · DEMOSTRACIÓN EN VIVO", "Demostración en Vivo de EduPulse y Cierre Técnico")

add_card(s14, 0.8, 1.8, 6.5, 4.9, "EduPulse Desplegado en Producción", [
    ("URL Pública Oficial:", "https://edupulse-575b.onrender.com"),
    ("Repositorio GitHub:", "JoseDanielDurango / EduPulse (Licencia de Código Abierto)"),
    ("Flujo de Demostración en Vivo:", ""),
    ("  1. Navegación Móvil y Estética Glass:", "Demostración de fluidez, temas y ergonomía táctil."),
    ("  2. Entrada de Voz Dual:", "Prueba de grabación en vivo con el canvas animado LiveMicVisualizer."),
    ("  3. Conversación Socrática con Cereza:", "Observación de probing agudo, eco reflexivo y cierre autónomo."),
    ("  4. Cuestionarios Diagnósticos:", "Demostración de validación interactiva guiada y autosave."),
    ("  5. Portal de Investigación 2FA:", "Visualización de gráficos tipo Google Forms, radar y exportación a Sheets.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s14, 7.6, 1.8, 4.9, 4.9, "Logros de Ingeniería y Agradecimientos", [
    ("Arquitectura Completa:", "100% reactiva, resiliente, segura y probada en producción."),
    ("Agradecimiento Especial:", "A nuestro director Mag. Juan Carlos Giraldo Cardozo por su liderazgo y apoyo continuo."),
    ("A los Profesores y Compañeros:", "De la Licenciatura en Informática por su valiosa retroalimentación durante el desarrollo."),
    ("Sesión de Preguntas:", "Quedamos a disposición del honorable jurado calificador para la demostración y deliberación.")
], border_color=C_CYAN_ACCENT)

# Output path
output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "EduPulse_Desarrollo_y_Diseno_Final.pptx"))
prs.save(output_path)
print(f"Presentation successfully created at: {output_path}")
