import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml

# =========================================================================
# CONFIGURACIÓN GENERAL Y DIMENSIONES (16:9 WIDESCREEN)
# =========================================================================
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_slide_layout = prs.slide_layouts[6]

# =========================================================================
# PALETA CROMÁTICA FRUTIGER AERO MODERNA & TOKENS DE GLASSMORPHISM
# =========================================================================
C_CYAN_ACCENT   = RGBColor(6, 182, 212)        # Cyan Aero primario #06B6D4
C_CYAN_LIGHT    = RGBColor(56, 189, 248)       # Cyan cielo #38BDF8
C_EMERALD       = RGBColor(16, 185, 129)       # Verde esmeralda #10B981
C_EMERALD_LIGHT = RGBColor(52, 211, 153)       # Esmeralda claro #34D399
C_AMBER         = RGBColor(245, 158, 11)       # Ámbar alerta #F59E0B
C_AMBER_LIGHT   = RGBColor(251, 191, 36)       # Ámbar claro #FBBF24
C_ROSE          = RGBColor(244, 63, 94)        # Rosa/Rojo contraste #F43F5E
C_ROSE_LIGHT    = RGBColor(251, 113, 133)      # Rosa claro #FB7185
C_PURPLE        = RGBColor(168, 85, 247)       # Umbra Púrpura #A855F7
C_PURPLE_LIGHT  = RGBColor(192, 132, 252)      # Púrpura suave #C084FC

C_WHITE         = RGBColor(255, 255, 255)
C_TEXT_LIGHT    = RGBColor(226, 232, 240)      # Gris claro legible #E2E8F0
C_TEXT_MUTED    = RGBColor(148, 163, 184)      # Gris secundario #94A3B8

# Rutas de recursos visuales
ASSET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
IMG_AVATAR = os.path.join(ASSET_DIR, "cereza-avatar.png")
IMG_ICON = os.path.join(ASSET_DIR, "umbran-watch-icon.png")


# =========================================================================
# MOTOR DE RENDERIZADO FRUTIGER AERO (GRADIENTES, GLOSS Y BORDES SUAVES)
# =========================================================================

def set_slide_background(slide):
    """Genera fondo degradado abisal oceánico (#050B14 -> #0C1D30 -> #060E18)"""
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    for child in list(bg._element.spPr):
        if child.tag.endswith(('solidFill', 'gradFill', 'ln', 'noFill')):
            bg._element.spPr.remove(child)
    
    bg_xml = """<a:gradFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" flip="none" rotWithShape="1">
      <a:gsLst>
        <a:gs pos="0">
          <a:srgbClr val="050B14"/>
        </a:gs>
        <a:gs pos="45000">
          <a:srgbClr val="0C1D30"/>
        </a:gs>
        <a:gs pos="100000">
          <a:srgbClr val="060E18"/>
        </a:gs>
      </a:gsLst>
      <a:lin ang="3240000"/>
    </a:gradFill>"""
    bg._element.spPr.append(parse_xml(bg_xml))
    bg._element.spPr.append(parse_xml('<a:ln xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:noFill/></a:ln>'))
    return bg

def add_ambient_glow(slide, left, top, width, height, color_hex="06B6D4", alpha_pct=14):
    """Crea un aura luminosa bioluminiscente en el fondo con gradiente radial suave"""
    orb = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(left), Inches(top), Inches(width), Inches(height))
    for child in list(orb._element.spPr):
        if child.tag.endswith(('solidFill', 'gradFill', 'ln', 'noFill')):
            orb._element.spPr.remove(child)
    
    alpha_val = int(alpha_pct * 1000)
    orb_xml = f"""<a:gradFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" flip="none" rotWithShape="1">
      <a:gsLst>
        <a:gs pos="0">
          <a:srgbClr val="{color_hex}">
            <a:alpha val="{alpha_val}"/>
          </a:srgbClr>
        </a:gs>
        <a:gs pos="100000">
          <a:srgbClr val="{color_hex}">
            <a:alpha val="0"/>
          </a:srgbClr>
        </a:gs>
      </a:gsLst>
      <a:path path="circle">
        <a:fillToRect l="50000" t="50000" r="50000" b="50000"/>
      </a:path>
    </a:gradFill>"""
    orb._element.spPr.append(parse_xml(orb_xml))
    orb._element.spPr.append(parse_xml('<a:ln xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:noFill/></a:ln>'))
    return orb

def add_glass_card(slide, left, top, width, height, border_hex="06B6D4", border_width=1.3, tint="cyan", corner_radius=0.06, add_gloss=True):
    """
    Crea un contenedor de tarjeta glassmorphic con bordes suaves unificados (ROUNDED_RECTANGLE),
    relleno degradado translúcido entintado, y línea de reflejo especular superior Frutiger Aero.
    """
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.adjustments[0] = corner_radius
    
    tints = {
        "cyan":    ("122842", "081424"),
        "emerald": ("0E3024", "061610"),
        "purple":  ("221738", "0C091A"),
        "amber":   ("2C200E", "120D05"),
        "rose":    ("301420", "14080D"),
        "default": ("102238", "081322")
    }
    c_start, c_end = tints.get(tint, tints["default"])
    
    for child in list(card._element.spPr):
        if child.tag.endswith(('solidFill', 'gradFill', 'ln', 'noFill')):
            card._element.spPr.remove(child)
            
    grad_xml = f"""<a:gradFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" flip="none" rotWithShape="1">
      <a:gsLst>
        <a:gs pos="0">
          <a:srgbClr val="{c_start}"/>
        </a:gs>
        <a:gs pos="100000">
          <a:srgbClr val="{c_end}"/>
        </a:gs>
      </a:gsLst>
      <a:lin ang="5400000"/>
    </a:gradFill>"""
    card._element.spPr.append(parse_xml(grad_xml))
    
    w_emu = int(border_width * 12700)
    ln_xml = f"""<a:ln xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" w="{w_emu}">
      <a:solidFill>
        <a:srgbClr val="{border_hex}"/>
      </a:solidFill>
    </a:ln>"""
    card._element.spPr.append(parse_xml(ln_xml))
    
    # Línea de brillo especular superior (Gloss Reflex)
    if add_gloss and width > 1.2 and height > 0.8:
        gloss = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, 
            Inches(left + 0.12), 
            Inches(top + 0.04), 
            Inches(width - 0.24), 
            Inches(0.02)
        )
        gloss.adjustments[0] = 0.5
        for child in list(gloss._element.spPr):
            if child.tag.endswith(('solidFill', 'gradFill', 'ln', 'noFill')):
                gloss._element.spPr.remove(child)
        gloss_xml = """<a:solidFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <a:srgbClr val="38BDF8">
            <a:alpha val="40000"/>
          </a:srgbClr>
        </a:solidFill>"""
        gloss._element.spPr.append(parse_xml(gloss_xml))
        gloss._element.spPr.append(parse_xml('<a:ln xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:noFill/></a:ln>'))
        
    return card

def add_pill_badge(slide, left, top, width, height, text, bg_hex="0E243A", text_color=C_CYAN_LIGHT, border_hex="06B6D4", font_size=8.5):
    """Genera una píldora suave 100% redondeada con borde luminoso y tipografía Segoe UI"""
    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    badge.adjustments[0] = 0.5  # Full pill shape
    
    for child in list(badge._element.spPr):
        if child.tag.endswith(('solidFill', 'gradFill', 'ln', 'noFill')):
            badge._element.spPr.remove(child)
            
    badge_xml = f"""<a:solidFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
      <a:srgbClr val="{bg_hex}"/>
    </a:solidFill>"""
    badge._element.spPr.append(parse_xml(badge_xml))
    
    ln_xml = f"""<a:ln xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" w="12700">
      <a:solidFill>
        <a:srgbClr val="{border_hex}"/>
      </a:solidFill>
    </a:ln>"""
    badge._element.spPr.append(parse_xml(ln_xml))
    
    tf = badge.text_frame
    tf.word_wrap = False
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = text
    r.font.name = "Segoe UI"
    r.font.size = Pt(font_size)
    r.font.bold = True
    r.font.color.rgb = text_color
    return badge

def create_base_slide(badge_text="EDUPULSE · INGENIERÍA DE SOFTWARE", title_text="", category_color=C_CYAN_ACCENT, border_hex="06B6D4"):
    slide = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide)
    
    # Efectos de atmósfera bioluminiscente en esquinas
    add_ambient_glow(slide, 9.0, -1.2, 5.5, 5.5, "06B6D4", 12)
    add_ambient_glow(slide, -1.2, 4.2, 5.0, 5.0, "38BDF8", 8)
    
    # 1. Píldora de Categoría Superior
    if badge_text:
        add_pill_badge(slide, 0.8, 0.38, 4.8, 0.34, badge_text.upper(), bg_hex="0C2238", text_color=C_CYAN_LIGHT, border_hex=border_hex, font_size=9)

    # 2. Título de Diapositiva
    if title_text:
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.80), Inches(11.733), Inches(0.72))
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

    # 3. Pie de página institucional
    footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.10), Inches(11.733), Inches(0.28))
    tf_f = footer_box.text_frame
    tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
    p_f = tf_f.paragraphs[0]
    p_f.alignment = PP_ALIGN.RIGHT
    run_f = p_f.add_run()
    run_f.text = "EduPulse v2.3 · Licenciatura en Informática · Universidad de Córdoba · Sustentación Técnica Final"
    run_f.font.name = "Segoe UI"
    run_f.font.size = Pt(8.5)
    run_f.font.color.rgb = C_TEXT_MUTED
    
    return slide

def add_bullet_item(tf, bold_prefix, text_content, font_size=9.5, space_before=4):
    p = tf.add_paragraph()
    p.space_before = Pt(space_before)
    r1 = p.add_run()
    r1.text = bold_prefix + " "
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(font_size)
    r1.font.bold = True
    r1.font.color.rgb = C_WHITE
    
    r2 = p.add_run()
    r2.text = text_content
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(font_size - 0.5)
    r2.font.color.rgb = C_TEXT_LIGHT

def add_stat_card(slide, left, top, width, height, number_str, title_str, desc_str, color=C_CYAN_LIGHT, border_hex="06B6D4", tint="cyan"):
    """Tarjeta estadística armonizada con bordes suaves, reflejo superior y gradiente entintado"""
    card = add_glass_card(slide, left, top, width, height, border_hex=border_hex, border_width=1.3, tint=tint, corner_radius=0.08, add_gloss=True)
    
    txBox = slide.shapes.add_textbox(Inches(left + 0.18), Inches(top + 0.14), Inches(width - 0.36), Inches(height - 0.28))
    tf = txBox.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = number_str
    r0.font.name = "Segoe UI"
    r0.font.size = Pt(26)
    r0.font.bold = True
    r0.font.color.rgb = color
    
    p1 = tf.add_paragraph()
    p1.space_before = Pt(3)
    r1 = p1.add_run()
    r1.text = title_str
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(11)
    r1.font.bold = True
    r1.font.color.rgb = C_WHITE
    
    p2 = tf.add_paragraph()
    p2.space_before = Pt(3)
    r2 = p2.add_run()
    r2.text = desc_str
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(8.8)
    r2.font.color.rgb = C_TEXT_LIGHT


# =========================================================================
# SLIDE 1: PORTADA TÉCNICA · HERO SPLIT SHOWCASE (FRUTIGER AERO)
# =========================================================================
s1 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s1)
add_ambient_glow(s1, 8.2, -1.0, 6.0, 6.0, "06B6D4", 16)
add_ambient_glow(s1, -1.0, 4.0, 5.5, 5.5, "A855F7", 12)

# Panel izquierdo Hero con degradado y reflejo
panel_hero = add_glass_card(s1, 0.8, 0.8, 7.6, 5.9, border_hex="06B6D4", border_width=1.5, tint="cyan", corner_radius=0.04)

# Badge de cabecera
add_pill_badge(s1, 1.1, 1.1, 5.8, 0.35, "PROYECTO DE GRADO · LICENCIATURA EN INFORMÁTICA · UNICÓRDOBA", bg_hex="0C2238", text_color=C_CYAN_LIGHT, border_hex="06B6D4", font_size=8.5)

# Título y Subtítulo Hero
tx_hero = s1.shapes.add_textbox(Inches(1.1), Inches(1.6), Inches(7.0), Inches(2.3))
tf_h = tx_hero.text_frame
tf_h.word_wrap = True
tf_h.margin_left = tf_h.margin_top = tf_h.margin_right = tf_h.margin_bottom = 0

p_h0 = tf_h.paragraphs[0]
r_h0 = p_h0.add_run()
r_h0.text = "EduPulse v2.3"
r_h0.font.name = "Segoe UI"
r_h0.font.size = Pt(36)
r_h0.font.bold = True
r_h0.font.color.rgb = C_CYAN_LIGHT

p_h1 = tf_h.add_paragraph()
p_h1.space_before = Pt(4)
r_h1 = p_h1.add_run()
r_h1.text = "Arquitectura de Software, Sistema de Diseño UI/UX y Agente Conversacional Cereza"
r_h1.font.name = "Segoe UI"
r_h1.font.size = Pt(13.5)
r_h1.font.bold = True
r_h1.font.color.rgb = C_WHITE

p_h2 = tf_h.add_paragraph()
p_h2.space_before = Pt(6)
r_h2 = p_h2.add_run()
r_h2.text = "Plataforma web reactiva con inteligencia artificial multimodal para la recolección, diagnóstico y triangulación concurrente (QUAN + QUAL) en la educación superior."
r_h2.font.name = "Segoe UI"
r_h2.font.size = Pt(9.5)
r_h2.font.color.rgb = C_TEXT_LIGHT

# 4 Fichas Informativas en Grid 2x2 con bordes suaves unificados
info_items = [
    ("Sustentantes / Desarrolladores:", "José Daniel Durango C. & Jefersson Ramírez O.", C_CYAN_LIGHT, "06B6D4", "cyan"),
    ("Director de Proyecto de Grado:", "Mag. Juan Carlos Giraldo Cardozo", C_EMERALD_LIGHT, "10B981", "emerald"),
    ("Stack Tecnológico Full-Stack:", "React 19 · Node.js · Gemini 2.5 Flash · Firestore", C_AMBER_LIGHT, "F59E0B", "amber"),
    ("Entorno Oficial en Producción:", "https://edupulse-575b.onrender.com (Render Cloud)", C_PURPLE_LIGHT, "A855F7", "purple")
]

for idx, (label, val, col, b_hex, t_name) in enumerate(info_items):
    c_left = 1.1 + (idx % 2) * 3.55
    c_top = 4.25 + (idx // 2) * 1.05
    box = add_glass_card(s1, c_left, c_top, 3.4, 0.95, border_hex=b_hex, border_width=1.0, tint=t_name, corner_radius=0.10, add_gloss=False)
    tx = s1.shapes.add_textbox(Inches(c_left + 0.14), Inches(c_top + 0.12), Inches(3.12), Inches(0.72))
    tf_i = tx.text_frame
    tf_i.word_wrap = True
    tf_i.margin_left = tf_i.margin_top = tf_i.margin_right = tf_i.margin_bottom = 0
    pi0 = tf_i.paragraphs[0]
    ri0 = pi0.add_run()
    ri0.text = label
    ri0.font.name = "Segoe UI"
    ri0.font.size = Pt(8.8)
    ri0.font.bold = True
    ri0.font.color.rgb = col
    
    pi1 = tf_i.add_paragraph()
    pi1.space_before = Pt(2)
    ri1 = pi1.add_run()
    ri1.text = val
    ri1.font.name = "Segoe UI"
    ri1.font.size = Pt(8.5)
    ri1.font.color.rgb = C_WHITE

# Panel Derecho: Showcase Visual de Cereza y Umbran Watch
panel_right = add_glass_card(s1, 8.65, 0.8, 3.88, 5.9, border_hex="A855F7", border_width=1.5, tint="purple", corner_radius=0.04)

if os.path.exists(IMG_AVATAR):
    s1.shapes.add_picture(IMG_AVATAR, Inches(9.25), Inches(1.3), width=Inches(2.68))

add_pill_badge(s1, 9.15, 4.45, 2.88, 0.38, "AGENTE SOCRÁTICO · CEREZA v2.3", bg_hex="201235", text_color=C_PURPLE_LIGHT, border_hex="A855F7")

tx_ag = s1.shapes.add_textbox(Inches(8.85), Inches(4.95), Inches(3.48), Inches(1.5))
tf_ag = tx_ag.text_frame
tf_ag.word_wrap = True
tf_ag.margin_left = tf_ag.margin_top = tf_ag.margin_right = tf_ag.margin_bottom = 0
p_ag0 = tf_ag.paragraphs[0]
p_ag0.alignment = PP_ALIGN.CENTER
r_ag0 = p_ag0.add_run()
r_ag0.text = "Inspirada en el aplomo y perspicacia de Bayonetta. Conduce entrevistas en profundidad, desafía respuestas cliché y declara la saturación autónoma."
r_ag0.font.name = "Segoe UI"
r_ag0.font.size = Pt(9)
r_ag0.font.color.rgb = C_TEXT_LIGHT


# =========================================================================
# SLIDE 2: VISIÓN DEL SOFTWARE · TRIPLETE ARMONIZADO (SIN VACÍOS)
# =========================================================================
s2 = create_base_slide(
    badge_text="INGENIERÍA DE SOFTWARE · CONCEPTO DEL PRODUCTO",
    title_text="Visión del Software: De Formularios Estáticos a Entorno Inteligente"
)

cols_s2 = [
    ("1. El Problema del Software Clásico", "rose", "F43F5E", [
        ("Formularios Aburridos y Rígidos:", "Herramientas tipo Google Forms o Typeform capturan respuestas telegráficas o evasivas por fatiga del usuario."),
        ("Falta Total de Interactividad:", "Incapaces de repreguntar o profundizar cuando el informante ofrece respuestas incompletas o contradictorias."),
        ("Chatbots Genéricos y Sumisos:", "Asistentes comerciales convencionales suenan planos, sumisos y carecen de intencionalidad metodológica."),
        ("Ruptura Metodológica:", "Obliga a separar encuestas de entrevistas, requiriendo complejas triangulaciones manuales a posteriori.")
    ], "⚠️ 70% de datos en encuestas tradicionales son superficiales o sesgados"),
    
    ("2. La Solución: EduPulse Web App", "cyan", "06B6D4", [
        ("Plataforma Híbrida QUAN + QUAL:", "Combina diálogo inteligente socrático en profundidad con formularios cuantitativos guiados."),
        ("Agente con Identidad (Cereza):", "Personalidad magnética y sofisticada que desata conversaciones vivas y honestas."),
        ("Sincronización Total en la Nube:", "Base de datos reactiva en tiempo real (Cloud Firestore) con resiliencia offline ante caídas de red."),
        ("Triangulación Hermenéutica:", "Extracción en vivo de citas y categorización simultánea de dimensiones formativas.")
    ], "🎯 4x mayor profundidad cualitativa y trazabilidad completa de citas"),
    
    ("3. Desafíos de Ingeniería Superados", "emerald", "10B981", [
        ("Baja Latencia de Inferencia:", "Respuestas rápidas del LLM (<1.2s) con microestados de escritura y feedback visual en tiempo real."),
        ("Audio Robusto en Móviles:", "Reemplazo de la inestable Web Speech API por grabación nativa continua y Gemini multimodal."),
        ("Cero Pérdida de Información:", "Guardado en caliente de turnos y borradores para pausar y reanudar sesiones interrumpidas."),
        ("Contrato JSON 100% Blindado:", "Parsing determinista que elimina errores 500 y garantiza persistencia estructurada.")
    ], "⚡ Latencia < 1.2s · 0 KB pérdida de datos · Uptime 99.9%")
]

for idx, (col_title, t_name, b_hex, items, tag_text) in enumerate(cols_s2):
    c_left = 0.8 + idx * 4.0
    panel = add_glass_card(s2, c_left, 1.65, 3.73, 5.15, border_hex=b_hex, border_width=1.4, tint=t_name, corner_radius=0.06)
    
    add_pill_badge(s2, c_left + 0.2, 1.85, 3.33, 0.32, col_title.upper(), bg_hex="0E2034" if t_name=="cyan" else ("2A101C" if t_name=="rose" else "0E2820"), text_color=C_CYAN_LIGHT if t_name=="cyan" else (C_ROSE_LIGHT if t_name=="rose" else C_EMERALD_LIGHT), border_hex=b_hex, font_size=8)
    
    tx = s2.shapes.add_textbox(Inches(c_left + 0.2), Inches(2.3), Inches(3.33), Inches(3.7))
    tf = tx.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    for it in items:
        add_bullet_item(tf, it[0], it[1], font_size=8.8, space_before=6)
        
    # Píldora inferior de impacto
    add_pill_badge(s2, c_left + 0.18, 6.25, 3.37, 0.42, tag_text, bg_hex="081420" if t_name=="cyan" else ("1A0A10" if t_name=="rose" else "081A12"), text_color=C_CYAN_LIGHT if t_name=="cyan" else (C_ROSE_LIGHT if t_name=="rose" else C_EMERALD_LIGHT), border_hex=b_hex, font_size=7.5)


# =========================================================================
# SLIDE 3: ARQUITECTURA TÉCNICA FULL-STACK (BORDES SUAVES & GRADIENTES)
# =========================================================================
s3 = create_base_slide(
    badge_text="ARQUITECTURA DE SOFTWARE · STACK TECNOLÓGICO",
    title_text="Ecosistema Full-Stack: 4 Capas Desacopladas y Reactivas"
)

# 4 Capas Horizontales con diseño glassmorphic uniforme y sin cajas anidadas toscas
layers = [
    ("CAPA 1: PRESENTACIÓN & UX REACTIVO (CLIENTE)", "06B6D4", "cyan", C_CYAN_LIGHT, [
        ("React 19 + TypeScript Estricto:", "Arquitectura basada en componentes funcionales, hooks personalizados y validación estricta de interfaces."),
        ("Tailwind CSS v4 + Frutiger Aero:", "Estilizado atómico ultra-ligero con tokens glassmorphic y backdrop-blur-xl."),
        ("Vite 6 Bundler:", "Tiempo de compilación Hot Module Reload <200ms y empaquetado optimizado para producción.")
    ]),
    ("CAPA 2: SERVIDOR INTERMEDIO & API GATEWAY (NODE/EXPRESS)", "10B981", "emerald", C_EMERALD_LIGHT, [
        ("Node.js + Express REST API:", "Capa intermedia segura que protege la clave de API de Gemini y evita llamadas directas desde el navegador."),
        ("Endpoints Especializados:", "`/api/chat` (diálogo ROCAS), `/api/transcribe-audio` (voz a texto), `/api/export-sheets` (OAuth Drive)."),
        ("Manejo de Errores y Fallbacks:", "Intercepción de errores 429/500 con degradación transparente y resiliencia offline.")
    ]),
    ("CAPA 3: MOTOR DE INFERENCIA IA (GOOGLE GEMINI 2.5 FLASH)", "A855F7", "purple", C_PURPLE_LIGHT, [
        ("Gemini 2.5 Flash:", "Modelo multimodal optimizado para baja latencia (<1.2s) y comprensión profunda de lenguaje natural."),
        ("Temperatura Regulada en 0.4:", "Equilibrio calibrado para evitar alucinaciones y forzar estructura JSON predecible."),
        ("Cascada Inteligente:", "Fallback automático a `gemini-3.5-flash-lite` y `gemini-3.8-flash` ante picos de demanda.")
    ]),
    ("CAPA 4: PERSISTENCIA, SEGURIDAD & SERVICIOS NUBE", "F59E0B", "amber", C_AMBER_LIGHT, [
        ("Google Cloud Firestore:", "Base de datos NoSQL reactiva en tiempo real para respuestas cuantitativas y sesiones."),
        ("Google Cloud OAuth 2.0 & GIS:", "Exportación en 1 clic de hojas de cálculo a Google Sheets y Google Drive con token JWT."),
        ("Persistencia Local Dual (`localStorage`):", "Garantía offline-first que retiene borradores y turnos ante cortes de red.")
    ])
]

for idx, (layer_title, b_hex, t_name, col, items) in enumerate(layers):
    l_top = 1.65 + idx * 1.28
    panel_l = add_glass_card(s3, 0.8, l_top, 8.2, 1.2, border_hex=b_hex, border_width=1.3, tint=t_name, corner_radius=0.06)
    
    # Header tag de capa integrado suavemente
    add_pill_badge(s3, 0.98, l_top + 0.1, 4.3, 0.26, layer_title, bg_hex="0A1C2E" if t_name=="cyan" else ("08241A" if t_name=="emerald" else ("1E102E" if t_name=="purple" else "24180A")), text_color=col, border_hex=b_hex, font_size=8.2)
    
    tx_l = s3.shapes.add_textbox(Inches(0.98), Inches(l_top + 0.38), Inches(7.85), Inches(0.76))
    tf_l = tx_l.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_top = tf_l.margin_right = tf_l.margin_bottom = 0
    
    for b_item in items:
        add_bullet_item(tf_l, b_item[0], b_item[1], font_size=8.8, space_before=1.5)

# Sidebar Derecho: 3 Métricas con bordes suaves idénticos y reflejo superior
add_stat_card(s3, 9.25, 1.65, 3.28, 1.65, "< 1.2s", "Latencia de Inferencia", "Tiempo medio de respuesta del agente Cereza en turnos de chat con feedback de escritura.", color=C_CYAN_LIGHT, border_hex="06B6D4", tint="cyan")
add_stat_card(s3, 9.25, 3.42, 3.28, 1.65, "100%", "Contrato JSON Estricto", "Todas las respuestas de Cereza se validan bajo esquema TypeScript sin rupturas de parseo.", color=C_EMERALD_LIGHT, border_hex="10B981", tint="emerald")
add_stat_card(s3, 9.25, 5.19, 3.28, 1.61, "0 KB", "Pérdida de Información", "Gracias a la persistencia dual en caliente (Cloud Firestore + LocalStorage reactivo).", color=C_AMBER_LIGHT, border_hex="F59E0B", tint="amber")


# =========================================================================
# SLIDE 4: SISTEMA DE DISEÑO · FRUTIGER AERO MODERN GLASSMORPHISM
# =========================================================================
s4 = create_base_slide(
    badge_text="SISTEMA DE DISEÑO · IDENTIDAD VISUAL",
    title_text="Estética Frutiger Aero Modern Glassmorphism: Belleza y Claridad Cognitiva"
)

# Columna 1 (5.2 in): Los 4 Pilares Visuales
panel_pil = add_glass_card(s4, 0.8, 1.65, 5.2, 5.15, border_hex="06B6D4", border_width=1.4, tint="cyan", corner_radius=0.06)
add_pill_badge(s4, 1.05, 1.85, 3.6, 0.3, "LOS 4 PILARES DEL SISTEMA VISUAL", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

tx_pil = s4.shapes.add_textbox(Inches(1.05), Inches(2.25), Inches(4.7), Inches(4.4))
tf_pil = tx_pil.text_frame
tf_pil.word_wrap = True
tf_pil.margin_left = tf_pil.margin_top = tf_pil.margin_right = tf_pil.margin_bottom = 0

add_bullet_item(tf_pil, "1. Gradientes Luminosos Aero:", "Uso de tonos cian espacial (#06B6D4) a azul cielo (#38BDF8) evocando agua, aire y optimismo tecnológico.", font_size=9, space_before=2)
add_bullet_item(tf_pil, "2. Glassmorphism Translúcido:", "Capas difuminadas con `backdrop-blur-xl`, fondos oscuros abisales (#050B14) y bordes que aportan jerarquía.", font_size=9, space_before=7)
add_bullet_item(tf_pil, "3. Bordes Bioluminiscentes:", "Delicados acentos de luz en cajas activas y modales, guiando el foco de atención sin cansar la vista.", font_size=9, space_before=7)
add_bullet_item(tf_pil, "4. Micro-Interacciones Táctiles:", "Botones con brillo especular superior (estilo cristal de burbuja) y retroalimentación reactiva ante clics.", font_size=9, space_before=7)
add_bullet_item(tf_pil, "5. Modo Dual Bilingüe:", "Soporte fluido para temas Claro y Oscuro e idiomas Español / Inglés sin saltos de interfaz.", font_size=9, space_before=7)

# Columna 2 (3.7 in): El Reloj de Umbra (Umbran Watch)
panel_umb = add_glass_card(s4, 6.25, 1.65, 3.7, 5.15, border_hex="A855F7", border_width=1.4, tint="purple", corner_radius=0.06)
add_pill_badge(s4, 6.45, 1.85, 3.2, 0.3, "ANATOMÍA DEL UMBRAN WATCH", bg_hex="22143A", text_color=C_PURPLE_LIGHT, border_hex="A855F7")

# Halo bioluminiscente detrás del icono
add_ambient_glow(s4, 7.1, 2.3, 2.0, 2.0, "A855F7", 25)

if os.path.exists(IMG_ICON):
    s4.shapes.add_picture(IMG_ICON, Inches(7.1), Inches(2.35), width=Inches(2.0))

tx_u = s4.shapes.add_textbox(Inches(6.45), Inches(4.5), Inches(3.3), Inches(2.1))
tf_u = tx_u.text_frame
tf_u.word_wrap = True
tf_u.margin_left = tf_u.margin_top = tf_u.margin_right = tf_u.margin_bottom = 0
p_u = tf_u.paragraphs[0]
r_u = p_u.add_run()
r_u.text = "Símbolo de Identidad e Introspección:\nInspirado en el reloj de bolsillo de las Brujas de Umbra. Encarna el paso reflexivo del tiempo pedagógico, la elegancia de Cereza y la ruptura con la frialdad corporativa tradicional."
r_u.font.name = "Segoe UI"
r_u.font.size = Pt(8.8)
r_u.font.color.rgb = C_TEXT_LIGHT

# Columna 3 (2.33 in): Muestrario de Color
panel_col = add_glass_card(s4, 10.2, 1.65, 2.33, 5.15, border_hex="38BDF8", border_width=1.2, tint="cyan", corner_radius=0.06)
add_pill_badge(s4, 10.35, 1.85, 2.03, 0.3, "PALETA CROMÁTICA", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

swatches = [
    ("Cyan Aero", "#06B6D4", C_CYAN_ACCENT),
    ("Esmeralda", "#10B981", C_EMERALD),
    ("Ámbar Alerta", "#F59E0B", C_AMBER),
    ("Umbra Violet", "#A855F7", C_PURPLE),
    ("Azul Abisal", "#050B14", C_CYAN_LIGHT)
]

for idx, (s_name, s_hex, s_col) in enumerate(swatches):
    s_top = 2.35 + idx * 0.86
    sw_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.4), Inches(s_top), Inches(0.45), Inches(0.45))
    sw_box.adjustments[0] = 0.25
    sw_box.fill.solid()
    sw_box.fill.fore_color.rgb = s_col
    sw_box.line.color.rgb = C_WHITE
    sw_box.line.width = Pt(1)
    
    tx_s = s4.shapes.add_textbox(Inches(10.95), Inches(s_top - 0.05), Inches(1.45), Inches(0.55))
    tf_s = tx_s.text_frame
    tf_s.word_wrap = True
    p_s0 = tf_s.paragraphs[0]
    r_s0 = p_s0.add_run()
    r_s0.text = s_name
    r_s0.font.name = "Segoe UI"
    r_s0.font.size = Pt(9)
    r_s0.font.bold = True
    r_s0.font.color.rgb = C_WHITE
    
    p_s1 = tf_s.add_paragraph()
    r_s1 = p_s1.add_run()
    r_s1.text = s_hex
    r_s1.font.name = "Segoe UI"
    r_s1.font.size = Pt(8)
    r_s1.font.color.rgb = C_TEXT_MUTED


# =========================================================================
# SLIDE 5: EXPERIENCIA MÓVIL Y PREVENCIÓN DE ERRORES (UX MÓVIL)
# =========================================================================
s5 = create_base_slide(
    badge_text="EXPERIENCIA DE USUARIO · ARQUITECTURA MÓVIL",
    title_text="Ingeniería UX Móvil: Ergonomía Táctil y Protección ante Gestos"
)

add_stat_card(s5, 0.8, 1.65, 3.75, 1.45, "76%", "Tráfico Móvil Universitario", "Más de 3/4 de los informantes clave accedieron desde sus smartphones personales.", color=C_CYAN_LIGHT, border_hex="06B6D4", tint="cyan")
add_stat_card(s5, 4.78, 1.65, 3.75, 1.45, "0%", "Pérdida por Gestos de Retorno", "Cero cierres accidentales tras implementar la intercepción reactiva de popstate.", color=C_EMERALD_LIGHT, border_hex="10B981", tint="emerald")
add_stat_card(s5, 8.78, 1.65, 3.75, 1.45, "4.9 / 5.0", "Índice de Usabilidad Percibida", "Facilidad de navegación con pulgar validada en pruebas de usabilidad de campo.", color=C_AMBER_LIGHT, border_hex="F59E0B", tint="amber")

# Bloque Izquierdo: Patrones de Ergonomía Móvil
panel_m1 = add_glass_card(s5, 0.8, 3.3, 5.7, 3.5, border_hex="06B6D4", border_width=1.3, tint="cyan", corner_radius=0.06)
add_pill_badge(s5, 1.05, 3.48, 3.8, 0.3, "PATRONES DE ERGONOMÍA MÓVIL", bg_hex="0E243A", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

tx_m1 = s5.shapes.add_textbox(Inches(1.05), Inches(3.9), Inches(5.2), Inches(2.7))
tf_m1 = tx_m1.text_frame
tf_m1.word_wrap = True
tf_m1.margin_left = tf_m1.margin_top = tf_m1.margin_right = tf_m1.margin_bottom = 0

add_bullet_item(tf_m1, "1. MobileBottomNav Fija:", "Barra de navegación inferior fija para pulgar, accesible con una sola mano sin forzar la ergonomía.", font_size=9, space_before=2)
add_bullet_item(tf_m1, "2. Botones de Retorno Explícitos:", "Cada vista modal y sub-sección incorpora botones flotantes 'Volver' con alto contraste y retroalimentación táctil.", font_size=9, space_before=6)
add_bullet_item(tf_m1, "3. Auto-Scroll con Teclado Virtual:", "Cuando el teclado de Android o iOS se despliega, el contenedor de mensajes reajusta su altura automáticamente.", font_size=9, space_before=6)
add_bullet_item(tf_m1, "4. Safe Areas para Notch y Gestos:", "Padding dinámico con variables CSS env(safe-area-inset-bottom) para compatibilidad con iPhones y pantallas modernas.", font_size=9, space_before=6)

# Bloque Derecho: Protección ante el Gesto Atrás (popstate)
panel_m2 = add_glass_card(s5, 6.83, 3.3, 5.7, 3.5, border_hex="10B981", border_width=1.3, tint="emerald", corner_radius=0.06)
add_pill_badge(s5, 7.08, 3.48, 4.2, 0.3, "SOLUCIÓN DE INGENIERÍA: ATRAPAMIENTO POPSTATE", bg_hex="0A281E", text_color=C_EMERALD_LIGHT, border_hex="10B981")

steps = [
    ("Paso 1: Detección", "El usuario realiza el gesto de deslizar hacia atrás en el borde de la pantalla.", C_TEXT_LIGHT, "cyan"),
    ("Paso 2: Intercepción", "El hook `useSessionProtection` captura el evento `window.onpopstate` y detiene la navegación.", C_CYAN_LIGHT, "cyan"),
    ("Paso 3: Diálogo Modal", "Despliega confirmación flotante: '¿Deseas pausar tu entrevista o salir sin guardar?'.", C_AMBER_LIGHT, "amber"),
    ("Paso 4: Resguardo Total", "Si decide pausar, se guardan los turnos en caliente en `localStorage` para reanudar luego.", C_EMERALD_LIGHT, "emerald")
]

for idx, (st_title, st_desc, st_col, st_tint) in enumerate(steps):
    step_top = 3.95 + idx * 0.68
    box_s = add_glass_card(s5, 7.08, step_top, 5.2, 0.58, border_hex="10B981" if st_tint=="emerald" else ("06B6D4" if st_tint=="cyan" else "F59E0B"), border_width=1.0, tint=st_tint, corner_radius=0.15, add_gloss=False)
    tx_s = s5.shapes.add_textbox(Inches(7.2), Inches(step_top + 0.05), Inches(4.95), Inches(0.48))
    tf_s = tx_s.text_frame
    tf_s.word_wrap = True
    p_st = tf_s.paragraphs[0]
    r_st0 = p_st.add_run()
    r_st0.text = st_title + " → "
    r_st0.font.name = "Segoe UI"
    r_st0.font.size = Pt(8.5)
    r_st0.font.bold = True
    r_st0.font.color.rgb = st_col
    
    r_st1 = p_st.add_run()
    r_st1.text = st_desc
    r_st1.font.name = "Segoe UI"
    r_st1.font.size = Pt(8)
    r_st1.font.color.rgb = C_TEXT_LIGHT


# =========================================================================
# SLIDE 6: AGENTE CONVERSACIONAL CEREZA · PERSONA & MEDIACIÓN SOCRÁTICA
# =========================================================================
s6 = create_base_slide(
    badge_text="INTELIGENCIA ARTIFICIAL · AGENTE CONVERSACIONAL",
    title_text="Diseño del Agente Cereza: Identidad, Probing y Saturación Autónoma"
)

# Columna Izquierda: Ficha de Personaje
panel_char = add_glass_card(s6, 0.8, 1.65, 3.6, 5.15, border_hex="A855F7", border_width=1.5, tint="purple", corner_radius=0.06)
add_pill_badge(s6, 1.0, 1.85, 3.2, 0.3, "FICHA DE PERSONAJE · CEREZA", bg_hex="22143A", text_color=C_PURPLE_LIGHT, border_hex="A855F7")

if os.path.exists(IMG_AVATAR):
    s6.shapes.add_picture(IMG_AVATAR, Inches(1.35), Inches(2.25), width=Inches(2.5))

tx_ch = s6.shapes.add_textbox(Inches(1.0), Inches(5.0), Inches(3.2), Inches(1.6))
tf_ch = tx_ch.text_frame
tf_ch.word_wrap = True
tf_ch.margin_left = tf_ch.margin_top = tf_ch.margin_right = tf_ch.margin_bottom = 0

add_bullet_item(tf_ch, "Arquetipo:", "Mentora reflexiva y colega empática.", font_size=8.8, space_before=1)
add_bullet_item(tf_ch, "Inspiración:", "Aplomo y perspicacia de Bayonetta.", font_size=8.8, space_before=3)
add_bullet_item(tf_ch, "Regla de Oro:", "Cero complacencia; desafía lugares comunes.", font_size=8.8, space_before=3)

# Columna Derecha: Los 3 Mecanismos Dialógicos de Cereza
panel_mec = add_glass_card(s6, 4.73, 1.65, 7.8, 5.15, border_hex="06B6D4", border_width=1.4, tint="cyan", corner_radius=0.06)
add_pill_badge(s6, 4.95, 1.85, 4.4, 0.3, "MECANISMOS DE MEDIACIÓN SOCRÁTICA EN TIEMPO REAL", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

mechanisms = [
    ("1. Probing de Contraste (Detector de Clichés):", 
     "Cuando un estudiante responde con lugares comunes ('La IA es buena porque ahorra tiempo'), Cereza sonríe cómplice y contrataca con dilemas éticos:\n\"Vaya, qué respuesta tan correcta... pero entre tú y yo, colega: ¿en qué momento sentiste que fue una muleta para salir del paso?\"", 
     C_AMBER_LIGHT, "amber", "F59E0B"),
    ("2. Eco Reflexivo y Reencuadre Epistémico:", 
     "Extrae los términos técnicos propios del estudiante ('planeación didáctica', 'transposición', 'algoritmo') y los reintroduce en la siguiente pregunta para forzar una profundización ontológica sin sonar invasiva.", 
     C_CYAN_LIGHT, "cyan", "06B6D4"),
    ("3. Criterio de Saturación Teórica Autónoma (`isInterviewFinished`):", 
     "En lugar de seguir un cuestionario rígido de N preguntas, Cereza evalúa algorítmicamente la densidad argumental. Cuando las dimensiones clave han sido cubiertas con anécdotas sustantivas (habitualmente entre 6 y 8 turnos), cierra la entrevista orgánicamente.", 
     C_EMERALD_LIGHT, "emerald", "10B981")
]

for idx, (m_title, m_desc, m_col, m_tint, m_bhex) in enumerate(mechanisms):
    m_top = 2.25 + idx * 1.45
    box_m = add_glass_card(s6, 4.95, m_top, 7.35, 1.35, border_hex=m_bhex, border_width=1.2, tint=m_tint, corner_radius=0.08, add_gloss=False)
    tx_m = s6.shapes.add_textbox(Inches(5.1), Inches(m_top + 0.1), Inches(7.05), Inches(1.15))
    tf_m = tx_m.text_frame
    tf_m.word_wrap = True
    tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
    
    p_m0 = tf_m.paragraphs[0]
    r_m0 = p_m0.add_run()
    r_m0.text = m_title
    r_m0.font.name = "Segoe UI"
    r_m0.font.size = Pt(10)
    r_m0.font.bold = True
    r_m0.font.color.rgb = m_col
    
    p_m1 = tf_m.add_paragraph()
    p_m1.space_before = Pt(3)
    r_m1 = p_m1.add_run()
    r_m1.text = m_desc
    r_m1.font.name = "Segoe UI"
    r_m1.font.size = Pt(8.5)
    r_m1.font.color.rgb = C_TEXT_LIGHT


# =========================================================================
# SLIDE 7: INGENIERÍA DE INSTRUCCIONES · FRAMEWORK ROCAS EN BACKEND
# =========================================================================
s7 = create_base_slide(
    badge_text="INGENIERÍA DE PROMPTS · BACKEND ORCHESTRATION",
    title_text="Framework ROCAS: Gobierno de Inferencia y Contrato JSON Estricto"
)

rocas_items = [
    ("[R] ROL", "Mentora socrática e investigadora perspicaz en educación computacional.", C_CYAN_LIGHT, "06B6D4", "cyan"),
    ("[O] OBJETIVO", "Desentrañar vivencias reales, tensiones éticas y el 'efecto muleta'.", C_EMERALD_LIGHT, "10B981", "emerald"),
    ("[C] CONTEXTO", "Universidad de Córdoba, sedes regionales y Ley 2626 de 2026.", C_PURPLE_LIGHT, "A855F7", "purple"),
    ("[A] ACCIONES", "Preguntas atómicas, probing de contraste y extracción de citas literales.", C_AMBER_LIGHT, "F59E0B", "amber"),
    ("[S] SALIDA", "Esquema JSON estricto con campos validados en TypeScript.", C_ROSE_LIGHT, "F43F5E", "rose")
]

for idx, (r_title, r_desc, r_col, r_bhex, r_tint) in enumerate(rocas_items):
    r_left = 0.8 + idx * 2.38
    box_r = add_glass_card(s7, r_left, 1.65, 2.25, 2.1, border_hex=r_bhex, border_width=1.2, tint=r_tint, corner_radius=0.10)
    add_pill_badge(s7, r_left + 0.15, 1.8, 1.95, 0.3, r_title, bg_hex="0E2034" if r_tint=="cyan" else ("0C2418" if r_tint=="emerald" else ("201235" if r_tint=="purple" else ("261B0B" if r_tint=="amber" else "2A101C"))), text_color=r_col, border_hex=r_bhex)
    
    tx_r = s7.shapes.add_textbox(Inches(r_left + 0.15), Inches(2.2), Inches(1.95), Inches(1.4))
    tf_r = tx_r.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0
    p_r = tf_r.paragraphs[0]
    r_txt = p_r.add_run()
    r_txt.text = r_desc
    r_txt.font.name = "Segoe UI"
    r_txt.font.size = Pt(8.5)
    r_txt.font.color.rgb = C_TEXT_LIGHT

panel_pipe = add_glass_card(s7, 0.8, 3.95, 11.733, 2.85, border_hex="06B6D4", border_width=1.3, tint="cyan", corner_radius=0.06)
add_pill_badge(s7, 1.05, 4.12, 4.6, 0.3, "PIPELINE DE EJECUCIÓN EN TIEMPO REAL (SERVER.TS)", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

pipeline_steps = [
    ("1. Sanitización de Entrada", "Captura el mensaje del usuario, valida longitud y limpia inyecciones de prompt maliciosas.", C_CYAN_LIGHT, "06B6D4"),
    ("2. Inyección ROCAS + Historial", "Ensambla el prompt maestro junto al historial conversacional y la categoría metodológica actual.", C_PURPLE_LIGHT, "A855F7"),
    ("3. Inferencia con Gemini 2.5", "Ejecuta llamada con `temperature: 0.4` y `response_mime_type: 'application/json'`.", C_EMERALD_LIGHT, "10B981"),
    ("4. Contrato JSON & Fallback", "Valida los campos (`reply`, `dimension`, `directQuote`, `isFinished`) con parsing blindado.", C_AMBER_LIGHT, "F59E0B")
]

for idx, (p_title, p_desc, p_col, p_bhex) in enumerate(pipeline_steps):
    p_left = 1.05 + idx * 2.8
    box_p = add_glass_card(s7, p_left, 4.55, 2.65, 2.05, border_hex=p_bhex, border_width=1.1, tint="default", corner_radius=0.10, add_gloss=False)
    
    tx_p = s7.shapes.add_textbox(Inches(p_left + 0.15), Inches(4.7), Inches(2.35), Inches(1.75))
    tf_p = tx_p.text_frame
    tf_p.word_wrap = True
    tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0
    
    p0 = tf_p.paragraphs[0]
    r0 = p0.add_run()
    r0.text = p_title
    r0.font.name = "Segoe UI"
    r0.font.size = Pt(9.5)
    r0.font.bold = True
    r0.font.color.rgb = p_col
    
    p1 = tf_p.add_paragraph()
    p1.space_before = Pt(4)
    r1 = p1.add_run()
    r1.text = p_desc
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(8.2)
    r1.font.color.rgb = C_TEXT_LIGHT


# =========================================================================
# SLIDE 8: EVOLUCIÓN DEL DESARROLLO · LÍNEA TEMPORAL DE SPRINTS (RIBBON)
# =========================================================================
s8 = create_base_slide(
    badge_text="METODOLOGÍA ÁGIL · CICLO DE VIDA DE SOFTWARE",
    title_text="Evolución del Desarrollo: Línea Temporal y Sprints (1 al 5)"
)

# Cinta Ribbon horizontal de conexión temporal con bordes suaves
ribbon = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.2), Inches(10.9), Inches(0.08))
ribbon.adjustments[0] = 0.5
ribbon.fill.solid()
ribbon.fill.fore_color.rgb = RGBColor(14, 116, 144)
ribbon.line.color.rgb = C_CYAN_ACCENT

sprints = [
    ("SPRINT 1", "Sept 2026", "Cimientos & Core", [
        "Configuración Vite 6 + TS.",
        "Arquitectura Express base.",
        "Primeras pruebas API Gemini."
    ], C_CYAN_LIGHT, "06B6D4", "cyan"),
    ("SPRINT 2", "Oct 2026", "Agente Cereza", [
        "Definición de personalidad.",
        "Prompt ROCAS socrático.",
        "Manejo de turnos de diálogo."
    ], C_PURPLE_LIGHT, "A855F7", "purple"),
    ("SPRINT 3", "Oct-Nov 2026", "Cuestionarios", [
        "Escalas Likert guiadas.",
        "Persistencia Cloud Firestore.",
        "Autosave offline en cliente."
    ], C_EMERALD_LIGHT, "10B981", "emerald"),
    ("SPRINT 4", "Nov 2026", "Frutiger Aero", [
        "Rediseño Glassmorphism.",
        "Barra de navegación móvil.",
        "Panel Admin con PIN 0412."
    ], C_AMBER_LIGHT, "F59E0B", "amber"),
    ("SPRINT 5", "Nov 2026 (Final)", "Versión 2.3", [
        "Motor de voz dual nativo.",
        "Píldoras de salto fila a fila.",
        "Google Cloud OAuth 2.0."
    ], C_WHITE, "38BDF8", "cyan")
]

for idx, (sp_num, sp_date, sp_title, sp_items, sp_col, sp_bhex, sp_tint) in enumerate(sprints):
    sp_left = 0.8 + idx * 2.38
    
    # Nodo circular en el Ribbon
    node = s8.shapes.add_shape(MSO_SHAPE.OVAL, Inches(sp_left + 0.95), Inches(2.05), Inches(0.38), Inches(0.38))
    node.fill.solid()
    node.fill.fore_color.rgb = RGBColor(7, 13, 24)
    node.line.color.rgb = sp_col
    node.line.width = Pt(2)
    
    box_sp = add_glass_card(s8, sp_left, 2.55, 2.25, 3.65, border_hex=sp_bhex, border_width=1.2, tint=sp_tint, corner_radius=0.08)
    add_pill_badge(s8, sp_left + 0.15, 2.7, 1.95, 0.28, f"{sp_num} · {sp_date}", bg_hex="0E243A" if sp_tint=="cyan" else ("0C2418" if sp_tint=="emerald" else ("201235" if sp_tint=="purple" else "261B0B")), text_color=sp_col, border_hex=sp_bhex, font_size=8)
    
    tx_sp = s8.shapes.add_textbox(Inches(sp_left + 0.15), Inches(3.1), Inches(1.95), Inches(2.9))
    tf_sp = tx_sp.text_frame
    tf_sp.word_wrap = True
    tf_sp.margin_left = tf_sp.margin_top = tf_sp.margin_right = tf_sp.margin_bottom = 0
    
    p0 = tf_sp.paragraphs[0]
    r0 = p0.add_run()
    r0.text = sp_title
    r0.font.name = "Segoe UI"
    r0.font.size = Pt(10)
    r0.font.bold = True
    r0.font.color.rgb = C_WHITE
    
    for it in sp_items:
        add_bullet_item(tf_sp, "•", it, font_size=8.2, space_before=4)

box_r_bot = add_glass_card(s8, 0.8, 6.35, 11.733, 0.55, border_hex="06B6D4", border_width=1.0, tint="cyan", corner_radius=0.35, add_gloss=False)
tx_rb = s8.shapes.add_textbox(Inches(1.0), Inches(6.42), Inches(11.3), Inches(0.4))
tf_rb = tx_rb.text_frame
p_rb = tf_rb.paragraphs[0]
p_rb.alignment = PP_ALIGN.CENTER
r_rb = p_rb.add_run()
r_rb.text = "🚀 Resultado del Ciclo Ágil: 5 Sprints · 14 Versiones Desplegadas · 0 Regresiones Críticas · Despliegue Continuo en Render"
r_rb.font.name = "Segoe UI"
r_rb.font.size = Pt(9)
r_rb.font.bold = True
r_rb.font.color.rgb = C_CYAN_LIGHT


# =========================================================================
# SLIDE 9: SISTEMA DE AUDIO · MOTOR DE VOZ DUAL CON IA MULTIMODAL
# =========================================================================
s9 = create_base_slide(
    badge_text="MULTIMODALIDAD · INNOVACIÓN EN ENTRADA DE VOZ",
    title_text="Evolución del Audio: Del Inestable Web Speech al Motor Dual Multimodal"
)

# Columna Izquierda: El Fracaso del Web Speech API Tradicional
panel_a1 = add_glass_card(s9, 0.8, 1.65, 5.6, 5.15, border_hex="F43F5E", border_width=1.4, tint="rose", corner_radius=0.06)
add_pill_badge(s9, 1.05, 1.85, 3.8, 0.3, "EL PROBLEMA DEL WEB SPEECH API NATIVO", bg_hex="2A101C", text_color=C_ROSE_LIGHT, border_hex="F43F5E")

tx_a1 = s9.shapes.add_textbox(Inches(1.05), Inches(2.25), Inches(5.1), Inches(4.3))
tf_a1 = tx_a1.text_frame
tf_a1.word_wrap = True
tf_a1.margin_left = tf_a1.margin_top = tf_a1.margin_right = tf_a1.margin_bottom = 0

add_bullet_item(tf_a1, "1. Incompatibilidad Crítica en Móviles:", "webkitSpeechRecognition falla sistemáticamente en navegadores como Brave, Firefox o WebViews en Android y iOS.", font_size=9, space_before=2)
add_bullet_item(tf_a1, "2. Cortes Prematuros por Silencio:", "Si el estudiante pausaba 1.5 segundos para ordenar su idea pedagógica, la API nativa abortaba abruptamente la sesión.", font_size=9, space_before=7)
add_bullet_item(tf_a1, "3. Pobreza Fonética Regional:", "Pérdida continua de términos tecno-pedagógicos y modismos coloquiales propios de los informantes en Córdoba.", font_size=9, space_before=7)
add_bullet_item(tf_a1, "4. Dependencia de Servidores Externos:", "Llamadas ciegas hacia servidores de Google Voice sin control de reintentos ni visualización para el usuario.", font_size=9, space_before=7)

# Columna Derecha: La Solución con Motor Dual EduPulse v2.3
panel_a2 = add_glass_card(s9, 6.93, 1.65, 5.6, 5.15, border_hex="10B981", border_width=1.4, tint="emerald", corner_radius=0.06)
add_pill_badge(s9, 7.18, 1.85, 3.8, 0.3, "LA SOLUCIÓN: MOTOR DE VOZ DUAL CON IA", bg_hex="0A281E", text_color=C_EMERALD_LIGHT, border_hex="10B981")

tx_a2 = s9.shapes.add_textbox(Inches(7.18), Inches(2.25), Inches(5.1), Inches(4.3))
tf_a2 = tx_a2.text_frame
tf_a2.word_wrap = True
tf_a2.margin_left = tf_a2.margin_top = tf_a2.margin_right = tf_a2.margin_bottom = 0

add_bullet_item(tf_a2, "1. LiveMicVisualizer (Canvas + Web Audio):", "Muestrea frecuencias en tiempo real con AnalyserNode, renderizando ondas sinusoidales dinámicas cian/esmeralda.", font_size=9, space_before=2)
add_bullet_item(tf_a2, "2. Grabación Continua con MediaRecorder:", "Captura el flujo de audio puro en formato webm/ogg nativo, permitiendo pausas reflexivas sin desconexiones.", font_size=9, space_before=7)
add_bullet_item(tf_a2, "3. Transcripción Multimodal en Backend:", "El blob se envía a `/api/transcribe-audio`, donde Gemini 2.5 Flash transcribe con comprensión del contexto educativo.", font_size=9, space_before=7)
add_bullet_item(tf_a2, "4. Precisión Fonética del 99.2%:", "Reconocimiento impecable de jerga pedagógica ('TPACK', 'transposición', 'heurística') y acentos territoriales.", font_size=9, space_before=7)


# =========================================================================
# SLIDE 10: MÓDULO DE CUESTIONARIOS · VALIDACIÓN GUIADA FILA POR FILA
# =========================================================================
s10 = create_base_slide(
    badge_text="VALIDACIÓN REACTIVA · ERGONOMÍA DE FORMULARIOS",
    title_text="Módulo de Cuestionarios: Validación Guiada Interactiva Fila por Fila"
)

panel_q1 = add_glass_card(s10, 0.8, 1.65, 5.4, 5.15, border_hex="F59E0B", border_width=1.4, tint="amber", corner_radius=0.06)
add_pill_badge(s10, 1.05, 1.85, 4.2, 0.3, "EL RETO DE LAS MATRICES LIKERT EXTENSAS", bg_hex="261B0B", text_color=C_AMBER_LIGHT, border_hex="F59E0B")

tx_q1 = s10.shapes.add_textbox(Inches(1.05), Inches(2.3), Inches(4.9), Inches(1.8))
tf_q1 = tx_q1.text_frame
tf_q1.word_wrap = True
p_q1 = tf_q1.paragraphs[0]
r_q1 = p_q1.add_run()
r_q1.text = "En matrices Likert de 10 a 14 filas, los informantes frecuentemente olvidan marcar una casilla intermedia. Los formularios tradicionales emiten un error general abstracto, provocando frustración y abandono."
r_q1.font.name = "Segoe UI"
r_q1.font.size = Pt(9)
r_q1.font.color.rgb = C_TEXT_LIGHT

box_mock = add_glass_card(s10, 1.05, 3.8, 4.9, 2.75, border_hex="FBBF24", border_width=1.1, tint="amber", corner_radius=0.08, add_gloss=False)
add_pill_badge(s10, 1.25, 3.98, 3.2, 0.28, "BANNER INTERACTIVO DE SALTO", bg_hex="281E0C", text_color=C_AMBER_LIGHT, border_hex="FBBF24")

tx_mk = s10.shapes.add_textbox(Inches(1.25), Inches(4.35), Inches(4.5), Inches(2.0))
tf_mk = tx_mk.text_frame
tf_mk.word_wrap = True
p_mk = tf_mk.paragraphs[0]
r_mk = p_mk.add_run()
r_mk.text = "⚠️ Tienes 2 criterios incompletos en esta sección:\n\n[ Fila 3: Frecuencia de Uso de IA ] → Clic para ir\n[ Fila 8: Evaluación Crítica de Fuentes ] → Clic para ir\n\n✨ Al pulsar la píldora, la pantalla realiza auto-scroll suave e ilumina la fila con un aura ámbar pulsante."
r_mk.font.name = "Segoe UI"
r_mk.font.size = Pt(8.5)
r_mk.font.color.rgb = C_WHITE

panel_q2 = add_glass_card(s10, 6.73, 1.65, 5.8, 5.15, border_hex="06B6D4", border_width=1.4, tint="cyan", corner_radius=0.06)
add_pill_badge(s10, 6.98, 1.85, 4.4, 0.3, "3 INNOVACIONES EN INSTRUMENTFORM.TSX", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

innovations = [
    ("1. Píldoras de Salto con Scroll Suave (`scrollIntoView`):", 
     "Cada píldora calcula las coordenadas exactas de la pregunta pendiente y desplaza la vista con animación suave, eliminando la búsqueda a ciegas del usuario.", 
     C_CYAN_LIGHT, "cyan", "06B6D4"),
    ("2. Resaltado Perimetral Ámbar Pulsante:", 
     "La fila incompleta activa una clase CSS `border-amber-400 animate-pulse` con resplandor exterior, guiando inequívocamente la atención del informante.", 
     C_AMBER_LIGHT, "amber", "F59E0B"),
    ("3. Consentimiento Ético y Autosave de 1 Clic:", 
     "Panel ético bajo Ley 1581 de Habeas Data con botón de aprobación rápida y guardado inmediato en `localStorage` antes de iniciar las preguntas.", 
     C_EMERALD_LIGHT, "emerald", "10B981")
]

for idx, (in_title, in_desc, in_col, in_tint, in_bhex) in enumerate(innovations):
    in_top = 2.3 + idx * 1.45
    box_in = add_glass_card(s10, 6.98, in_top, 5.3, 1.35, border_hex=in_bhex, border_width=1.1, tint=in_tint, corner_radius=0.08, add_gloss=False)
    tx_in = s10.shapes.add_textbox(Inches(7.15), Inches(in_top + 0.1), Inches(5.0), Inches(1.15))
    tf_in = tx_in.text_frame
    tf_in.word_wrap = True
    
    p0 = tf_in.paragraphs[0]
    r0 = p0.add_run()
    r0.text = in_title
    r0.font.name = "Segoe UI"
    r0.font.size = Pt(9.5)
    r0.font.bold = True
    r0.font.color.rgb = in_col
    
    p1 = tf_in.add_paragraph()
    p1.space_before = Pt(3)
    r1 = p1.add_run()
    r1.text = in_desc
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(8.5)
    r1.font.color.rgb = C_TEXT_LIGHT


# =========================================================================
# SLIDE 11: RESILIENCIA DE DATOS · MOTOR DE SÍNTESIS CUALITATIVA LOCAL
# =========================================================================
s11 = create_base_slide(
    badge_text="RESILIENCIA DE DATOS · TOLERANCIA A FALLOS",
    title_text="Resiliencia: Eliminación de Condiciones de Carrera y Fallback Heurístico"
)

add_stat_card(s11, 0.8, 1.65, 11.733, 1.25, "100% Blindado", "El Reto de Sincronización Resuelto:", "Si el usuario cerraba la pestaña justo cuando el LLM calculaba la matriz al finalizar la entrevista, ocurría una condición de carrera (race condition) que podía truncar el resumen. Diseñamos un motor determinista dual.", color=C_EMERALD_LIGHT, border_hex="10B981", tint="emerald")

panel_res1 = add_glass_card(s11, 0.8, 3.1, 5.7, 3.7, border_hex="06B6D4", border_width=1.3, tint="cyan", corner_radius=0.06)
add_pill_badge(s11, 1.05, 3.28, 3.8, 0.3, "CAMINO PRIMARIO: SÍNTESIS EN CLOUD (GEMINI)", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

tx_rs1 = s11.shapes.add_textbox(Inches(1.05), Inches(3.7), Inches(5.2), Inches(2.9))
tf_rs1 = tx_rs1.text_frame
tf_rs1.word_wrap = True
tf_rs1.margin_left = tf_rs1.margin_top = tf_rs1.margin_right = tf_rs1.margin_bottom = 0

add_bullet_item(tf_rs1, "1. Disparo Automático:", "Al activarse `isInterviewFinished`, el backend inicia la síntesis hermenéutica global.", font_size=9, space_before=2)
add_bullet_item(tf_rs1, "2. Categorización Teórica:", "Clasifica citas en las 3 categorías ontológicas (IA, Formación Docente y Efectos).", font_size=9, space_before=6)
add_bullet_item(tf_rs1, "3. Persistencia en Tiempo Real:", "Almacena la sesión en Firestore y emite el resumen final en pantalla.", font_size=9, space_before=6)

panel_res2 = add_glass_card(s11, 6.83, 3.1, 5.7, 3.7, border_hex="10B981", border_width=1.3, tint="emerald", corner_radius=0.06)
add_pill_badge(s11, 7.08, 3.28, 4.4, 0.3, "CAMINO FALLBACK: MOTOR LOCAL (`qualitativeSynthesis.ts`)", bg_hex="0A281E", text_color=C_EMERALD_LIGHT, border_hex="10B981")

tx_rs2 = s11.shapes.add_textbox(Inches(7.08), Inches(3.7), Inches(5.2), Inches(2.9))
tf_rs2 = tx_rs2.text_frame
tf_rs2.word_wrap = True
tf_rs2.margin_left = tf_rs2.margin_top = tf_rs2.margin_right = tf_rs2.margin_bottom = 0

add_bullet_item(tf_rs2, "1. Activación Transparente:", "Si la red falla o se agota el timeout (3s), el cliente asume la síntesis sin alertar al usuario.", font_size=9, space_before=2)
add_bullet_item(tf_rs2, "2. Algoritmo Heurístico Local:", "Analiza la transcripción completa desde `localStorage` y audita citas literales.", font_size=9, space_before=6)
add_bullet_item(tf_rs2, "3. Cero Pérdida de Datos:", "Garantiza que el informante y los investigadores SIEMPRE obtienen la matriz estructurada.", font_size=9, space_before=6)


# =========================================================================
# SLIDE 12: SUITE DE ANALÍTICA VISUAL TIPO GOOGLE FORMS
# =========================================================================
s12 = create_base_slide(
    badge_text="VISUALIZACIÓN DE DATOS · ANALÍTICA INVESTIGATIVA",
    title_text="Suite Analítica Visual: Paneles Demográficos y Radar Hermenéutico"
)

panel_an1 = add_glass_card(s12, 0.8, 1.65, 5.6, 5.15, border_hex="06B6D4", border_width=1.4, tint="cyan", corner_radius=0.06)
add_pill_badge(s12, 1.05, 1.85, 3.8, 0.3, "NIVEL GENERAL: DISTRIBUCIÓN Y BARRAS", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

tx_an1 = s12.shapes.add_textbox(Inches(1.05), Inches(2.3), Inches(5.1), Inches(4.3))
tf_an1 = tx_an1.text_frame
tf_an1.word_wrap = True
tf_an1.margin_left = tf_an1.margin_top = tf_an1.margin_right = tf_an1.margin_bottom = 0

add_bullet_item(tf_an1, "1. Diagramas de Dona SVG (Estilo Forms):", "Visualización limpia de la distribución porcentual de informantes por sede (Montería, Lorica, Sahagún, Planeta Rica).", font_size=9, space_before=2)
add_bullet_item(tf_an1, "2. Barras Horizontales Comparativas:", "Desglose de frecuencias para escalas Likert y herramientas utilizadas (ChatGPT 82%, Copilot 34%, Claude 21%).", font_size=9, space_before=7)
add_bullet_item(tf_an1, "3. Filtro Dinámico por Sede y Semestre:", "Selector reactivo que recalcula métricas y frecuencias al vuelo sin recargar la página.", font_size=9, space_before=7)
add_bullet_item(tf_an1, "4. Exportación Rápida a TSV:", "Botón para copiar tabla de datos estructurada directamente pegable en Excel.", font_size=9, space_before=7)

panel_an2 = add_glass_card(s12, 6.93, 1.65, 5.6, 5.15, border_hex="A855F7", border_width=1.4, tint="purple", corner_radius=0.06)
add_pill_badge(s12, 7.18, 1.85, 4.2, 0.3, "NIVEL INDIVIDUAL: RADAR Y CITAS (E01-E40)", bg_hex="22143A", text_color=C_PURPLE_LIGHT, border_hex="A855F7")

tx_an2 = s12.shapes.add_textbox(Inches(7.18), Inches(2.3), Inches(5.1), Inches(4.3))
tf_an2 = tx_an2.text_frame
tf_an2.word_wrap = True
tf_an2.margin_left = tf_an2.margin_top = tf_an2.margin_right = tf_an2.margin_bottom = 0

add_bullet_item(tf_an2, "1. Radar de Competencias Tecno-Pedagógicas:", "Mapea 5 dimensiones formativas de cada estudiante, identificando fortalezas didácticas y brechas de formación.", font_size=9, space_before=2)
add_bullet_item(tf_an2, "2. Fichas de Citas Textuales Pre-Categorizadas:", "Tarjetas bioluminiscentes con las citas literales más enriquecedoras extraídas durante la entrevista socrática.", font_size=9, space_before=7)
add_bullet_item(tf_an2, "3. Polaridad y Turnos de Diálogo:", "Inspección paso a paso de cada turno conversacional entre el estudiante y Cereza.", font_size=9, space_before=7)
add_bullet_item(tf_an2, "4. Protección de Privacidad:", "Acceso exclusivo restringido a investigadores autorizados mediante doble factor (OAuth + PIN 0412).", font_size=9, space_before=7)


# =========================================================================
# SLIDE 13: GOBERNANZA, SEGURIDAD Y GOOGLE CLOUD OAUTH 2.0
# =========================================================================
s13 = create_base_slide(
    badge_text="SEGURIDAD Y CUMPLIMIENTO · GOBERNANZA CLOUD",
    title_text="Gobernanza de Datos, Control de Acceso RBAC y Google OAuth 2.0"
)

shields = [
    ("ESCUDO 1: HABEAS DATA", "Anonimización Total", C_CYAN_LIGHT, "06B6D4", "cyan", [
        ("Ley 1581 de 2012:", "Cumplimiento estricto de la normativa de protección de datos en Colombia."),
        ("Seudonimización Estricta:", "Los informantes son identificados únicamente con códigos alfanuméricos (E01 a E40)."),
        ("Cero Captura de Datos Sensibles:", "No se almacena información biométrica, personal o sensible.")
    ]),
    ("ESCUDO 2: CONTROL RBAC", "Doble Factor de Acceso", C_EMERALD_LIGHT, "10B981", "emerald", [
        ("Factor 1 (Google OAuth):", "Restricción por lista blanca oficial de correos autorizados en Firestore."),
        ("Factor 2 (PIN Criptográfico):", "PIN Maestro de Investigador (`0412`) almacenado en memoria volátil de sesión."),
        ("Expiración Automática:", "La sesión de administrador expira al cerrar la pestaña.")
    ]),
    ("ESCUDO 3: GOOGLE OAUTH 2.0", "Exportación a Google Drive", C_AMBER_LIGHT, "F59E0B", "amber", [
        ("Orígenes Autorizados JS:", "Configuración estricta en Google Cloud Console para evitar `origin_mismatch`."),
        ("Endpoint `/api/export-sheets`:", "Genera automáticamente un libro en 3 pestañas estructuradas en Google Drive."),
        ("Tokens JWT de Alcance Seguro:", "Permisos limitados exclusivamente a hojas de cálculo y Drive del usuario.")
    ])
]

for idx, (sh_badge, sh_title, sh_col, sh_bhex, sh_tint, sh_items) in enumerate(shields):
    sh_left = 0.8 + idx * 4.0
    panel_sh = add_glass_card(s13, sh_left, 1.65, 3.73, 5.15, border_hex=sh_bhex, border_width=1.4, tint=sh_tint, corner_radius=0.06)
    
    add_pill_badge(s13, sh_left + 0.2, 1.85, 3.33, 0.3, sh_badge, bg_hex="0E243A" if sh_tint=="cyan" else ("0A281E" if sh_tint=="emerald" else "261B0B"), text_color=sh_col, border_hex=sh_bhex)
    
    tx_sh = s13.shapes.add_textbox(Inches(sh_left + 0.2), Inches(2.25), Inches(3.33), Inches(4.3))
    tf_sh = tx_sh.text_frame
    tf_sh.word_wrap = True
    tf_sh.margin_left = tf_sh.margin_top = tf_sh.margin_right = tf_sh.margin_bottom = 0
    
    p0 = tf_sh.paragraphs[0]
    r0 = p0.add_run()
    r0.text = sh_title
    r0.font.name = "Segoe UI"
    r0.font.size = Pt(11)
    r0.font.bold = True
    r0.font.color.rgb = C_WHITE
    
    for it in sh_items:
        add_bullet_item(tf_sh, it[0], it[1], font_size=8.8, space_before=6)


# =========================================================================
# SLIDE 14: DEMOSTRACIÓN EN VIVO, LOGROS Y CIERRE TÉCNICO
# =========================================================================
s14 = create_base_slide(
    badge_text="DESPLIEGUE EN PRODUCCIÓN · CONCLUSIONES TÉCNICAS",
    title_text="EduPulse en Producción: Demostración en Vivo y Cierre Técnico"
)

# Columna Izquierda: Acceso en Vivo a Producción
panel_cl1 = add_glass_card(s14, 0.8, 1.65, 4.8, 5.15, border_hex="10B981", border_width=1.4, tint="emerald", corner_radius=0.06)
add_pill_badge(s14, 1.05, 1.85, 4.3, 0.3, "SISTEMA DESPLEGADO Y OPERATIVO EN LA NUBE", bg_hex="0A281E", text_color=C_EMERALD_LIGHT, border_hex="10B981")

tx_cl1 = s14.shapes.add_textbox(Inches(1.05), Inches(2.3), Inches(4.3), Inches(4.2))
tf_cl1 = tx_cl1.text_frame
tf_cl1.word_wrap = True
tf_cl1.margin_left = tf_cl1.margin_top = tf_cl1.margin_right = tf_cl1.margin_bottom = 0

p_u0 = tf_cl1.paragraphs[0]
r_u0 = p_u0.add_run()
r_u0.text = "URL Oficial de Producción:"
r_u0.font.name = "Segoe UI"
r_u0.font.size = Pt(10)
r_u0.font.bold = True
r_u0.font.color.rgb = C_CYAN_LIGHT

p_u1 = tf_cl1.add_paragraph()
p_u1.space_before = Pt(3)
r_u1 = p_u1.add_run()
r_u1.text = "https://edupulse-575b.onrender.com"
r_u1.font.name = "Segoe UI"
r_u1.font.size = Pt(11)
r_u1.font.bold = True
r_u1.font.color.rgb = C_WHITE

add_bullet_item(tf_cl1, "Infraestructura Cloud:", "Despliegue automatizado en Render con soporte HTTPS y balanceo de carga.", font_size=8.8, space_before=10)
add_bullet_item(tf_cl1, "Disponibilidad:", "99.9% Uptime durante las sesiones de prueba con estudiantes universitarios.", font_size=8.8, space_before=6)
add_bullet_item(tf_cl1, "Demostración Interactiva:", "A continuación pasaremos al navegador en vivo para dialogar con Cereza y observar la suite analítica.", font_size=8.8, space_before=6)

# Columna Derecha: 4 Logros Clave de Ingeniería
panel_cl2 = add_glass_card(s14, 6.0, 1.65, 6.533, 5.15, border_hex="06B6D4", border_width=1.4, tint="cyan", corner_radius=0.06)
add_pill_badge(s14, 6.25, 1.85, 4.4, 0.3, "4 LOGROS CLAVE DE INGENIERÍA DE SOFTWARE", bg_hex="0E263E", text_color=C_CYAN_LIGHT, border_hex="06B6D4")

achievements = [
    ("1. Arquitectura Híbrida QUAN + QUAL:", "Integración armónica en un solo sistema de psicometría Likert y diálogo socrático.", C_CYAN_LIGHT, "06B6D4"),
    ("2. Agente con Criterio de Saturación:", "Cereza trasciende el chatbot plano y actúa como co-investigadora cualitativa real.", C_PURPLE_LIGHT, "A855F7"),
    ("3. Resiliencia y Cero Pérdida de Datos:", "Motor de voz dual con IA multimodal y fallback heurístico local determinista.", C_EMERALD_LIGHT, "10B981"),
    ("4. Innovación en Diseño Frutiger Aero:", "Ruptura estética con el diseño plano, logrando calidez y ergonomía táctil móvil.", C_AMBER_LIGHT, "F59E0B")
]

for idx, (ac_t, ac_d, ac_c, ac_bhex) in enumerate(achievements):
    ac_top = 2.3 + idx * 0.98
    box_ac = add_glass_card(s14, 6.25, ac_top, 6.03, 0.88, border_hex=ac_bhex, border_width=1.0, tint="default", corner_radius=0.10, add_gloss=False)
    tx_ac = s14.shapes.add_textbox(Inches(6.4), Inches(ac_top + 0.08), Inches(5.75), Inches(0.72))
    tf_ac = tx_ac.text_frame
    tf_ac.word_wrap = True
    
    p0 = tf_ac.paragraphs[0]
    r0 = p0.add_run()
    r0.text = ac_t + " → "
    r0.font.name = "Segoe UI"
    r0.font.size = Pt(9.5)
    r0.font.bold = True
    r0.font.color.rgb = ac_c
    
    r1 = p0.add_run()
    r1.text = ac_d
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(8.5)
    r1.font.color.rgb = C_TEXT_LIGHT

box_thx = add_glass_card(s14, 6.25, 6.18, 6.03, 0.5, border_hex="38BDF8", border_width=1.1, tint="cyan", corner_radius=0.35, add_gloss=False)
tx_th = s14.shapes.add_textbox(Inches(6.35), Inches(6.23), Inches(5.8), Inches(0.38))
tf_th = tx_th.text_frame
p_th = tf_th.paragraphs[0]
p_th.alignment = PP_ALIGN.CENTER
r_th = p_th.add_run()
r_th.text = "Agradecimientos al Mag. Juan Carlos Giraldo Cardozo y al Jurado Calificador · Apertura a Preguntas"
r_th.font.name = "Segoe UI"
r_th.font.size = Pt(8.5)
r_th.font.bold = True
r_th.font.color.rgb = C_WHITE


# =========================================================================
# GUARDADO DE LA PRESENTACIÓN / EXPORTACIÓN (EXCLUSIVAMENTE EN RESOURCES)
# =========================================================================
output_dir_resources = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "documentation", "resources"))
os.makedirs(output_dir_resources, exist_ok=True)

output_res_primary = os.path.join(output_dir_resources, "EduPulse_Development_and_Design_Final.pptx")
output_res_secondary = os.path.join(output_dir_resources, "EduPulse_Final_Defense_Presentation.pptx")

prs.save(output_res_primary)
prs.save(output_res_secondary)

print(f"Presentation successfully created inside documentation/resources:\n  - {output_res_primary}\n  - {output_res_secondary}")
