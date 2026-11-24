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

# Color Palette: Frutiger Aero Academic Dark Palette
C_BG_DARK = RGBColor(7, 13, 24)        # #070D18
C_BG_CARD = RGBColor(16, 28, 48)       # #101C30
C_BG_CARD_ALT = RGBColor(12, 22, 38)   # #0C1626
C_CYAN_ACCENT = RGBColor(6, 182, 212)  # #06B6D4
C_CYAN_LIGHT = RGBColor(56, 189, 248)  # #38BDF8
C_EMERALD = RGBColor(16, 185, 129)     # #10B981
C_EMERALD_LIGHT = RGBColor(52, 211, 153) # #34D399
C_AMBER = RGBColor(245, 158, 11)       # #F59E0B
C_WHITE = RGBColor(255, 255, 255)
C_TEXT_LIGHT = RGBColor(226, 232, 240) # #E2E8F0
C_TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
C_BORDER = RGBColor(30, 58, 95)        # #1E3A5F
C_BORDER_ACCENT = RGBColor(14, 116, 144)

# Paths to visual assets
ASSET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
IMG_AVATAR = os.path.join(ASSET_DIR, "cereza-avatar.png")
IMG_ICON = os.path.join(ASSET_DIR, "umbran-watch-icon.png")

def create_base_slide(badge_text="EDUPULSE · UNIVERSIDAD DE CÓRDOBA", title_text=""):
    slide = prs.slides.add_slide(blank_slide_layout)
    
    # 1. Background rectangle
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_BG_DARK
    bg.line.color.rgb = C_BG_DARK
    
    # 2. Header Category Badge
    if badge_text:
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(4.5), Inches(0.35))
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
        run.font.size = Pt(10)
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
        run.font.size = Pt(22)
        run.font.bold = True
        run.font.color.rgb = C_WHITE

    # 4. Footer line & branding
    footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.7), Inches(0.35))
    tf_f = footer_box.text_frame
    tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
    p_f = tf_f.paragraphs[0]
    p_f.alignment = PP_ALIGN.RIGHT
    run_f = p_f.add_run()
    run_f.text = "EduPulse v2.3 · Licenciatura en Informática · Universidad de Córdoba · Sustentación Final"
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
    r_t.font.size = Pt(14)
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
        p_sub.space_after = Pt(6)

    # Bullet items or description
    for item in items:
        p_item = tf.add_paragraph()
        p_item.space_before = Pt(4)
        if isinstance(item, tuple):
            r_bold = p_item.add_run()
            r_bold.text = item[0] + " "
            r_bold.font.name = "Segoe UI"
            r_bold.font.size = Pt(11)
            r_bold.font.bold = True
            r_bold.font.color.rgb = C_WHITE
            
            r_text = p_item.add_run()
            r_text.text = item[1]
            r_text.font.name = "Segoe UI"
            r_text.font.size = Pt(10.5)
            r_text.font.color.rgb = C_TEXT_LIGHT
        else:
            r_text = p_item.add_run()
            r_text.text = item
            r_text.font.name = "Segoe UI"
            r_text.font.size = Pt(10.5)
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
    r_num.font.size = Pt(24)
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
# SLIDE 1: PORTADA (TITLE SLIDE)
# ==========================================
slide1 = prs.slides.add_slide(blank_slide_layout)
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
bg1.fill.solid()
bg1.fill.fore_color.rgb = C_BG_DARK
bg1.line.color.rgb = C_BG_DARK

# Header Badge
badge1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.8), Inches(5.8), Inches(0.4))
badge1.fill.solid()
badge1.fill.fore_color.rgb = RGBColor(12, 36, 60)
badge1.line.color.rgb = C_CYAN_ACCENT
tf_b1 = badge1.text_frame
tf_b1.margin_left = tf_b1.margin_top = tf_b1.margin_right = tf_b1.margin_bottom = 0
p_b1 = tf_b1.paragraphs[0]
p_b1.alignment = PP_ALIGN.CENTER
r_b1 = p_b1.add_run()
r_b1.text = "UNIVERSIDAD DE CÓRDOBA · SUSTENTACIÓN FINAL DE TRABAJO DE GRADO"
r_b1.font.name = "Segoe UI"
r_b1.font.size = Pt(10)
r_b1.font.bold = True
r_b1.font.color.rgb = C_CYAN_LIGHT

# Title
t_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.4), Inches(8.5), Inches(2.2))
tf1 = t_box1.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0
p1 = tf1.paragraphs[0]
r1 = p1.add_run()
r1.text = "La Formación Docente en la Era de la Inteligencia Artificial"
r1.font.name = "Segoe UI"
r1.font.size = Pt(30)
r1.font.bold = True
r1.font.color.rgb = C_WHITE

p1_sub = tf1.add_paragraph()
p1_sub.space_before = Pt(8)
r1_sub = p1_sub.add_run()
r1_sub.text = "Desafíos, Perspectivas y Mediación Tecnopedagógica en la Licenciatura en Informática"
r1_sub.font.name = "Segoe UI"
r1_sub.font.size = Pt(18)
r1_sub.font.color.rgb = C_CYAN_LIGHT

# Platform Pill
plat_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(3.9), Inches(8.5), Inches(0.85))
plat_box.fill.solid()
plat_box.fill.fore_color.rgb = C_BG_CARD
plat_box.line.color.rgb = C_EMERALD
plat_box.line.width = Pt(1.5)
tf_plat = plat_box.text_frame
tf_plat.margin_left = Inches(0.25)
tf_plat.margin_top = Inches(0.12)
p_plat = tf_plat.paragraphs[0]
r_p1 = p_plat.add_run()
r_p1.text = "EduPulse v2.3  |  "
r_p1.font.name = "Segoe UI"
r_p1.font.size = Pt(15)
r_p1.font.bold = True
r_p1.font.color.rgb = C_EMERALD_LIGHT

r_p2 = p_plat.add_run()
r_p2.text = "Plataforma Inteligente y Agente Socrático (Cereza) para la Investigación Mixta"
r_p2.font.name = "Segoe UI"
r_p2.font.size = Pt(13)
r_p2.font.color.rgb = C_TEXT_LIGHT

# Metadata Box (Authors, Director, University)
meta_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.0), Inches(8.5), Inches(1.8))
meta_card.fill.solid()
meta_card.fill.fore_color.rgb = C_BG_CARD_ALT
meta_card.line.color.rgb = C_BORDER
tf_meta = meta_card.text_frame
tf_meta.margin_left = Inches(0.25)
tf_meta.margin_top = Inches(0.2)

p_m1 = tf_meta.paragraphs[0]
r_m1_b = p_m1.add_run()
r_m1_b.text = "Investigadores (Autores): "
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
r_m3_b.text = "Institución y Programa: "
r_m3_b.font.bold = True
r_m3_b.font.color.rgb = C_CYAN_LIGHT
r_m3_t = p_m3.add_run()
r_m3_t.text = "Universidad de Córdoba · Facultad de Educación · Licenciatura en Informática (2026)"
r_m3_t.font.color.rgb = C_WHITE

# Add Cereza Avatar on right
if os.path.exists(IMG_AVATAR):
    slide1.shapes.add_picture(IMG_AVATAR, Inches(10.1), Inches(1.5), Inches(2.4), Inches(2.4))

if os.path.exists(IMG_ICON):
    slide1.shapes.add_picture(IMG_ICON, Inches(10.3), Inches(4.5), Inches(2.0), Inches(2.0))


# ==========================================
# SLIDE 2: EL PROBLEMA DE INVESTIGACIÓN
# ==========================================
s2 = create_base_slide("CAPÍTULO 1 · PLANTEAMIENTO DEL PROBLEMA", "El Problema de Investigación y Justificación Epistémica")

add_card(s2, 0.8, 1.8, 3.7, 4.9, "1. La Irrupción de la IA Generativa", [
    ("Revolución Tecnológica:", "Adopción acelerada de LLMs (ChatGPT, Claude, Gemini) en la educación superior sin formación docente previa."),
    ("Transformación Didáctica:", "La planificación de clases, elaboración de talleres y generación de código ahora se ejecutan en segundos."),
    ("Transición Normativa:", "Exigencia de cumplimiento de la Ley 2626 de 2026 (Educación Digital en Colombia) y directrices de la UNESCO.")
], border_color=C_CYAN_ACCENT)

add_card(s2, 4.8, 1.8, 3.7, 4.9, "2. El 'Efecto Muleta' vs. Autonomía", [
    ("Efecto Muleta (Crutch Effect):", "Bastani et al. (2024) demuestran que el uso desregulado de IA reduce el esfuerzo cognitivo y la autoría crítica."),
    ("Dilema Pedagógico:", "¿Estamos formando educadores autónomos con criterio didáctico propio o meros operadores pasivos de algoritmos?"),
    ("Integridad Académica:", "Tensión entre la agilidad operativa y la pérdida de comprensión profunda en programación y pedagogía.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s2, 8.8, 1.8, 3.7, 4.9, "3. El Contexto Regional de Córdoba", [
    ("Brecha de Conectividad:", "Realidades de infraestructura en Montería y sedes regionales (Lorica, Sahagún, Montelíbano, Planeta Rica)."),
    ("Vacío Metodológico:", "Carencia de instrumentos dialógicos que capturen la vivencia íntima del estudiante sin coerción evaluativa."),
    ("La Necesidad:", "Construir una plataforma inteligente para diagnosticar, mediar socráticamente y triangular hallazgos reales.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 3: PREGUNTA Y OBJETIVOS
# ==========================================
s3 = create_base_slide("MARCO METODOLÓGICO · HORIZONTE DE LA INVESTIGACIÓN", "Pregunta Central y Objetivos de la Investigación")

# Central Question Card (Top Full Width)
add_card(s3, 0.8, 1.8, 11.7, 1.6, "Pregunta Central de Investigación", [
    ("Interrogante Epistemológico:", "¿De qué manera los docentes en formación de la Licenciatura en Informática de la Universidad de Córdoba perciben, apropian e integran la inteligencia artificial generativa en sus prácticas pedagógicas, y cómo la mediación dialógica inteligente facilita la comprensión de sus dilemas éticos y formativos?")
], border_color=C_CYAN_ACCENT)

# General Objective
add_card(s3, 0.8, 3.6, 5.7, 3.1, "Objetivo General", [
    ("Propósito Central:", "Desarrollar e implementar la plataforma y agente inteligente EduPulse como instrumento de recolección y análisis mixto para caracterizar las prácticas, percepciones y mediaciones tecnopedagógicas en los estudiantes de la Licenciatura en Informática de la Universidad de Córdoba frente a la IA generativa.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

# Specific Objectives
add_card(s3, 6.8, 3.6, 5.7, 3.1, "Objetivos Específicos", [
    ("1. Diagnosticar:", "Caracterizar los niveles de familiaridad, autoeficacia y uso de IA mediante instrumentos cuantitativos tipo Likert."),
    ("2. Mediar y Recolectar:", "Diseñar e implementar al agente socrático Cereza bajo el framework ROCAS para guiar entrevistas cualitativas en profundidad."),
    ("3. Triangular y Proponer:", "Triangular concurrentemente las métricas estadísticas y los códigos hermenéuticos para generar lineamientos curriculares.")
], border_color=C_CYAN_ACCENT)


# ==========================================
# SLIDE 4: DISEÑO METODOLÓGICO MIXTO (QUAN + QUAL)
# ==========================================
s4 = create_base_slide("DISEÑO METODOLÓGICO · TRIANGULACIÓN CONCURRENTE", "Enfoque Metodológico Multimétodo (QUAN + QUAL)")

add_card(s4, 0.8, 1.8, 3.7, 4.9, "1. Paradigma y Enfoque", [
    ("Paradigma:", "Hermenéutico-Interpretativo complementado con Enfoque Cuantitativo Descriptivo."),
    ("Diseño de Investigación:", "Diseño Mixto Concurrente de Triangulación (Creswell & Creswell, 2018; Hernández-Sampieri, 2014)."),
    ("Población Total:", "~430 estudiantes activos matriculados en la Licenciatura en Informática."),
    ("Muestra Intencional:", "20 a 40 informantes clave distribuidos en las tres etapas curriculares del programa.")
], border_color=C_CYAN_ACCENT)

add_card(s4, 4.8, 1.8, 3.7, 4.9, "2. Fase Cuantitativa (QUAN)", [
    ("Instrumento 1 (Diagnóstico):", "Percepciones, frecuencia de uso y conocimiento previo de herramientas de IA."),
    ("Instrumento 2 (Prácticas):", "Experiencias de aula, visión institucional docente y brecha digital territorial."),
    ("Escalas y Matrices:", "Escala Likert de 5 puntos y tablas matriciales de frecuencia de uso (textos, imágenes, código)."),
    ("Persistencia Reactiva:", "Cloud Firestore con autosave offline para evitar pérdidas de datos.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s4, 8.8, 1.8, 3.7, 4.9, "3. Fase Cualitativa (QUAL)", [
    ("Técnica Dialógica:", "Entrevista semiestructurada socrática mediada por el agente conversacional Cereza."),
    ("Protocolo de Probing:", "Preguntas de contrastación reflexiva para desarmar la deseabilidad social y clichés."),
    ("Saturación Teórica:", "Decisión algorítmica de cierre autónomo tras 6 a 8 turnos de habla maduros."),
    ("Pre-codificación:", "Extracción en tiempo real de citas textuales sobre IA, Formación y Efectos.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 5: EVOLUCIÓN HISTÓRICA DE EDUPULSE
# ==========================================
s5 = create_base_slide("DESARROLLO DE SOFTWARE · LÍNEA TEMPORAL", "Génesis y Evolución de EduPulse: De la Idea a la Versión Final")

add_stat_box(s5, 0.8, 1.8, 2.1, 4.9, "FASE 1", "Concepción", "• Delimitación ontológica (IA, Docencia, Efectos)\n• Guion curricular de preguntas abiertas\n• Marcos UNESCO y TPACK", color=C_CYAN_LIGHT)
add_stat_box(s5, 3.2, 1.8, 2.1, 4.9, "FASE 2", "Agente Cereza", "• Nacimiento del agente socrático\n• Personalidad audaz y magnética\n• Framework ROCAS con Google Gemini", color=C_EMERALD_LIGHT)
add_stat_box(s5, 5.6, 1.8, 2.1, 4.9, "FASE 3", "Cuantitativo", "• Cuestionarios psicométricos Likert\n• Autosave offline (localStorage)\n• Persistencia en Cloud Firestore", color=C_AMBER)
add_stat_box(s5, 8.0, 1.8, 2.1, 4.9, "FASE 4", "UX Móvil Glass", "• Estética Frutiger Aero moderna\n• MobileBottomNav para smartphones\n• Protección popstate contra cierres", color=C_CYAN_LIGHT)
add_stat_box(s5, 10.4, 1.8, 2.1, 4.9, "FASE 5", "Versión 2.3", "• Voz dual con Gemini multimodal\n• Google Forms Analytics visual\n• Google OAuth 2.0 y Sheets en 3 tabs", color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 6: EL MODELO DEL TUTOR: CEREZA
# ==========================================
s6 = create_base_slide("MODELO PEDAGÓGICO · DOCUMENTO 01", "El Modelo del Tutor: Cereza y la Mediación Socrática")

add_card(s6, 0.8, 1.8, 4.0, 4.9, "Personalidad Magnética e Ingenio", [
    ("Inspiración Estética:", "Aplomo, distinción e ingenio maduro inspirados en la icónica bruja Bayonetta."),
    ("Rechazo a la Sumisión:", "No suena como un chatbot burocrático ni servil. Habla como una mentora y colega formativa."),
    ("Combate al Cliché:", "Si el informante responde con evasivas de manual, Cereza interviene con una sonrisa cómplice e irónica."),
    ("Cita Típica:", "\"Vaya, qué respuesta tan correcta... pero entre tú y yo, colega: ¿fue una aliada didáctica o una muleta para salir del paso?\"")
], border_color=C_CYAN_ACCENT)

add_card(s6, 5.1, 1.8, 4.0, 4.9, "Protocolo de Probing Hermenéutico", [
    ("Escucha Activa y Eco Reflexivo:", "Retoma términos clave del informante (Mirroring dialéctico, Schön, 1983)."),
    ("Probing de Ejemplificación:", "Pide situaciones concretas en microclases o talleres de programación en Córdoba."),
    ("Probing de Tensión Ética:", "Explora la transparencia con el docente titular al usar código o textos generados."),
    ("Preguntas Atómicas:", "Estricta restricción de UNA sola pregunta por turno de habla para asegurar respuestas ricas.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s6, 9.4, 1.8, 3.1, 4.9, "Criterio de Saturación", [
    ("Autonomía Algorítmica:", "Cereza decide el cierre sin número rígido de preguntas preestablecido."),
    ("participantTurns < 5:", "Saturación insuficiente; profundiza en dimensiones pendientes."),
    ("participantTurns >= 6:", "Evalúa madurez de reflexión; agradece y declara isInterviewFinished: true."),
    ("participantTurns >= 9:", "Cierre imperativo para prevenir fatiga cognitiva.")
], border_color=C_AMBER, header_color=C_AMBER)


# ==========================================
# SLIDE 7: ARQUITECTURA PEDAGÓGICA (4 MODELOS)
# ==========================================
s7 = create_base_slide("ARQUITECTURA CONCEPTUAL · SUITE DOCUMENTAL", "La Arquitectura de los Cuatro Modelos Inteligentes")

add_card(s7, 0.8, 1.8, 5.7, 2.3, "1. Modelo del Tutor (Doc 01)", [
    ("Rol Pedagógico:", "Cómo guiar el diálogo. Rige la personalidad de Cereza, el probing socrático, la no directividad y la neutralidad axiológica sin calificar.")
], border_color=C_CYAN_ACCENT)

add_card(s7, 6.8, 1.8, 5.7, 2.3, "2. Modelo del Conocimiento (Doc 02)", [
    ("Ontología y Saberes:", "Qué investigar. Estructura las tres categorías deductivas (IA, Formación Docente, Efectos), TPACK, DigCompEdu y la Ley 2626.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s7, 0.8, 4.4, 5.7, 2.3, "3. Modelo del Alumno (Doc 03)", [
    ("Perfil del Informante:", "A quién guiar. Rastrea el semestre (1°-10°), adapta el diálogo a las 3 etapas curriculares y audita el consentimiento informado digital.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s7, 6.8, 4.4, 5.7, 2.3, "4. Modelo del Mundo (Doc 04)", [
    ("Ecosistema UX/UI:", "Dónde interactuar. Interfaz Frutiger Aero glassmorphism, MobileBottomNav, visualizador de audio en vivo y resiliencia territorial.")
], border_color=C_CYAN_LIGHT, header_color=C_CYAN_LIGHT)


# ==========================================
# SLIDE 8: EL PROMPT MAESTRO Y FRAMEWORK ROCAS
# ==========================================
s8 = create_base_slide("INGENIERÍA DE INSTRUCCIONES · DOCUMENTO 05", "El Prompt Maestro y la Metodología ROCAS")

add_card(s8, 0.8, 1.8, 7.8, 4.9, "Componentes del Framework ROCAS", [
    ("R — Rol:", "Cereza: entrevistadora cualitativa refinada, ingeniosa, empática y de alto rigor académico."),
    ("O — Objetivo:", "Recolectar vivencias auténticas y desarmar la deseabilidad social sobre el uso de IA."),
    ("C — Contexto:", "Licenciatura en Informática, Universidad de Córdoba (Montería y sedes regionales)."),
    ("A — Acciones:", "Probing socrático, espejo reflexivo, prevención del efecto muleta y preguntas atómicas."),
    ("S — Salida:", "Esquema JSON estricto con campos: reply, isInterviewFinished, category, extractedInsight.")
], border_color=C_CYAN_ACCENT)

add_card(s8, 8.9, 1.8, 3.6, 4.9, "Inferencia y Resiliencia", [
    ("Motor Primario:", "Google Gemini 2.5 Flash optimizado para baja latencia."),
    ("Cascada Inteligente:", "Conmutación automática ante errores 503 o límites de cuota."),
    ("Paridad Bilingüe:", "Razonamiento y diálogo nativo en Español e Inglés sin traducción mecánica."),
    ("Temperatura 0.4:", "Equilibrio ideal entre creatividad discursiva y fidelidad al guion.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 9: INNOVACIONES TÉCNICAS VERSIÓN 2.3
# ==========================================
s9 = create_base_slide("INNOVACIONES TÉCNICAS · VERSIÓN FINAL 2.3", "Innovaciones Técnicas de la Versión Final")

add_card(s9, 0.8, 1.8, 5.7, 2.3, "1. Motor de Voz Dual con IA Multimodal", [
    ("MediaRecorder + Gemini:", "Grabación nativa de audio con Web Audio API y transcripción en /api/transcribe-audio con Gemini, superando fallos de Web Speech API en móviles.")
], border_color=C_CYAN_ACCENT)

add_card(s9, 6.8, 1.8, 5.7, 2.3, "2. Síntesis Cualitativa Resiliente", [
    ("qualitativeSynthesis.ts:", "Eliminación de condiciones de carrera en cierre y fallback determinista que garantiza citas y matriz de hallazgos ante fallas de red.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s9, 0.8, 4.4, 5.7, 2.3, "3. Validación Interactiva Guiada", [
    ("InstrumentForm.tsx:", "Banner con píldoras de salto, animación luminiscente en campos vacíos, detección fila por fila en matrices y aceptación de ética en 1 clic.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s9, 6.8, 4.4, 5.7, 2.3, "4. Protección de Navegación Móvil", [
    ("popstate & Back Buttons:", "Prevención de cierres accidentales al deslizar la pantalla del smartphone y botones universales de retorno en pantalla.")
], border_color=C_CYAN_LIGHT, header_color=C_CYAN_LIGHT)


# ==========================================
# SLIDE 10: SUITE ANALÍTICA TIPO GOOGLE FORMS
# ==========================================
s10 = create_base_slide("ANALÍTICA DE DATOS · DOCUMENTO 07", "Suite de Analítica Visual Tipo Google Forms (General e Individual)")

add_card(s10, 0.8, 1.8, 5.7, 4.9, "Panel General Cuantitativo", [
    ("GoogleFormsCharts.tsx:", "Visualización agregada inspirada en la familiaridad y claridad de Google Forms."),
    ("Diagramas de Dona Demográficos:", "Distribución porcentual de participantes por semestre (1° a 10°) y sedes universitarias."),
    ("Barras Horizontales con Frecuencia:", "Mapeo porcentual en tiempo real para preguntas de opción múltiple y matrices Likert."),
    ("Medidas Descriptivas:", "Cálculo instantáneo de medias (x̄) y desviaciones estándar (σ) por ítem.")
], border_color=C_CYAN_ACCENT)

add_card(s10, 6.8, 1.8, 5.7, 4.9, "Analítica Cualitativa Individual", [
    ("InterviewsAnalyticsView.tsx:", "Panel hermenéutico de diagnóstico individualizado por informante (E01...E40)."),
    ("Radar de Competencias:", "Mapeo multieje de autonomía cognitiva, transposición didáctica y solvencia técnica."),
    ("Desglose Emocional:", "Proporción de reflexiones entusiastas, críticas o de cautela metodológica frente a la IA."),
    ("Fichas de Citas Categorizadas:", "Testimonios directos listos para su citación en los capítulos 4 y 5 de la tesis.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 11: SEGURIDAD, RBAC Y GOOGLE OAUTH 2.0
# ==========================================
s11 = create_base_slide("SEGURIDAD Y GOBERNANZA · DOCUMENTO 08", "Gobernanza Ética, Seguridad y Google Cloud OAuth 2.0")

add_card(s11, 0.8, 1.8, 3.7, 4.9, "1. Anonimización y Habeas Data", [
    ("Ley 1581 de 2012:", "Estricto cumplimiento de la normativa colombiana de protección de datos personales."),
    ("Códigos E01...E40:", "Desidentificación inmediata en transcripciones y bases de datos."),
    ("Sin Datos Sensibles:", "Prohibición absoluta de capturar cédulas, teléfonos o notas institucionales."),
    ("Enmascaramiento:", "Supresión de correos personales en la interfaz pública.")
], border_color=C_CYAN_ACCENT)

add_card(s11, 4.8, 1.8, 3.7, 4.9, "2. Autenticación de Doble Factor", [
    ("Factor 1 (Google OAuth):", "Verificación federada contra lista blanca estricta de investigadores autorizados."),
    ("Factor 2 (PIN Maestro):", "Ingreso del PIN '0412' en memoria volátil de sesión para prevenir accesos indebidos."),
    ("Acceso RBAC:", "Gráficas, transcripciones crudas y gestión de guiones reservadas exclusivamente al equipo investigador.")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s11, 8.8, 1.8, 3.7, 4.9, "3. Google Cloud OAuth 2.0", [
    ("Google Identity Services:", "Integración autorizada en Google Cloud Console para el dominio de Render."),
    ("Exportación en 1 Clic:", "Generación automatizada de libros de cálculo en Google Sheets con 3 pestañas: Ficha, Citas y Transcripción."),
    ("Resiliencia de Exportación:", "Botones directos de descarga en CSV y JSON como alternativa inmediata sin esperas.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 12: HALLAZGOS Y TRIANGULACIÓN PRELIMINAR
# ==========================================
s12 = create_base_slide("ANÁLISIS DE RESULTADOS · CAPÍTULOS 4 Y 5", "Principales Hallazgos y Triangulación Metodológica")

add_card(s12, 0.8, 1.8, 3.7, 4.9, "Hallazgo 1: Adopción Pragmática", [
    ("Uso Textual Predominante:", "El 82% de los informantes utiliza ChatGPT para resúmenes y consultas teóricas."),
    ("Baja Apropiación Multimodal:", "Solo el 24% ha explorado generación de imágenes o automatización para clases."),
    ("Voz del Informante (E03):", "\"Es excelente para salir del paso con la teoría, pero en la práctica pedagógica real pocos sabemos cómo llevarla al colegio.\"")
], border_color=C_CYAN_ACCENT)

add_card(s12, 4.8, 1.8, 3.7, 4.9, "Hallazgo 2: Conciencia del Efecto Muleta", [
    ("Alerta Cognitiva:", "El 85% reconoce el temor a perder habilidades de resolución autónoma de problemas."),
    ("Vigilancia Epistemológica:", "Los estudiantes más avanzados imponen límites deliberados al uso de la IA."),
    ("Voz del Informante (E11):", "\"Si dejas que la máquina programe todo por ti, cuando un alumno te pregunte la lógica del código quedas en ridículo.\"")
], border_color=C_AMBER, header_color=C_AMBER)

add_card(s12, 8.8, 1.8, 3.7, 4.9, "Hallazgo 3: Maduración Curricular", [
    ("Semestres 1°-3°:", "Uso enfocado en resolver tareas y dudas de algoritmos universitarios."),
    ("Semestres 4°-6°:", "Incursión en diseño de material didáctico y debates sobre plagio."),
    ("Semestres 7°-10°:", "Apropiación reflexiva para transposición didáctica contextualizada en colegios de Córdoba.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 13: CONCLUSIONES E IMPACTO INSTITUCIONAL
# ==========================================
s13 = create_base_slide("IMPACTO Y TRABAJO A FUTURO · CAPÍTULO 5", "Conclusiones, Impacto Institucional y Aportes a UniCórdoba")

add_card(s13, 0.8, 1.8, 5.7, 4.9, "Conclusiones Académicas y Tecnológicas", [
    ("1. Validación del Agente Socrático:", "Cereza demostró que la IA puede operar como co-investigadora hermenéutica empática, superando la frialdad de encuestas tradicionales."),
    ("2. Triangulación Rigurosa:", "La integración QUAN + QUAL permitió contrastar cuantitativamente las tendencias de autoeficacia con relatos biográficos situados."),
    ("3. Resiliencia Comprobada:", "La plataforma operó con total solvencia bajo condiciones de conectividad fluctuante gracias al motor dual y autosave.")
], border_color=C_CYAN_ACCENT)

add_card(s13, 6.8, 1.8, 5.7, 4.9, "Aportes para la Universidad de Córdoba", [
    ("Insumos para el Rediseño Curricular:", "Evidencias empíricas para la articulación de la Ley 2626 de 2026 en el plan de estudios de la Licenciatura en Informática."),
    ("Plataforma Libre y Reutilizable:", "EduPulse queda como software institucional transferible para futuras investigaciones de grado en la Facultad de Educación."),
    ("Interoperabilidad Científica:", "Exportación estandarizada hacia software CAQDAS (ATLAS.ti y NVivo) y ecosistema Google Cloud.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)


# ==========================================
# SLIDE 14: DEMOSTRACIÓN EN VIVO Y AGRADECIMIENTOS
# ==========================================
s14 = create_base_slide("SUSTENTACIÓN FINAL · CIERRE Y PREGUNTAS", "Demostración en Vivo, Agradecimientos y Cierre")

add_card(s14, 0.8, 1.8, 6.5, 4.9, "EduPulse Desplegado en Producción", [
    ("URL Pública de Producción:", "https://edupulse-575b.onrender.com"),
    ("Repositorio de Código Abierto:", "GitHub: JoseDanielDurango / EduPulse"),
    ("Módulos Disponibles para la Demostración:", ""),
    ("  • Sala de Diálogo Reflexivo:", "Interacción en vivo por voz y texto con Cereza."),
    ("  • Cuestionarios Diagnósticos:", "Validación guiada y persistencia en Cloud Firestore."),
    ("  • Portal de Investigación (2FA):", "PIN Maestro y Google OAuth 2.0."),
    ("  • Suite Analítica Visual:", "Gráficos de dona, barras y radar hermenéutico individual."),
    ("  • Exportación Automatizada:", "Generación instantánea de Google Sheets en 3 pestañas.")
], border_color=C_EMERALD, header_color=C_EMERALD_LIGHT)

add_card(s14, 7.6, 1.8, 4.9, 4.9, "Agradecimientos y Apertura al Jurado", [
    ("Director de Proyecto:", "Mag. Juan Carlos Giraldo Cardozo, por su invaluable guía epistemológica, metodológica y rigor investigativo."),
    ("Cuerpo Docente:", "Profesores y directivas de la Licenciatura en Informática y la Facultad de Educación y Ciencias Humanas."),
    ("Compañeros Informantes:", "A los estudiantes que compartieron generosamente sus vivencias y dilemas éticos con Cereza."),
    ("Apertura al Jurado:", "Agradecemos la atención prestada y quedamos a total disposición del honorable jurado calificador para la sesión de preguntas.")
], border_color=C_CYAN_ACCENT)

# Output path
output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "EduPulse_Sustentacion_Final.pptx"))
prs.save(output_path)
print(f"Presentation successfully created at: {output_path}")
