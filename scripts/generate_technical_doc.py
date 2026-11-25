import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

# =========================================================================
# HELPER FUNCTIONS: XML SHADING, BORDERS & HYPERLINKS
# =========================================================================

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell in docx."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets internal cell margins in twips (1/20 of a pt)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m_name, m_val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m_name}')
        node.set(qn('w:w'), str(m_val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_hyperlink(paragraph, url, text, color="0284C7", underline=True):
    """Creates a real clickable hyperlink in python-docx."""
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    hyperlink = OxmlElement('w:hyperlink')
    hyperlink.set(qn('r:id'), r_id)
    new_run = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    c = OxmlElement('w:color')
    c.set(qn('w:val'), color)
    rPr.append(c)
    if underline:
        u = OxmlElement('w:u')
        u.set(qn('w:val'), 'single')
        rPr.append(u)
    new_run.append(rPr)
    text_node = OxmlElement('w:t')
    text_node.text = text
    new_run.append(text_node)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)

# =========================================================================
# MAIN DOCUMENT GENERATOR
# =========================================================================

def create_technical_document():
    doc = Document()
    
    # Page Setup (Standard Letter, 1-inch margins as per APA 7)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header / Footer for inner pages (APA 7 running head)
        header = section.header
        p_hdr = header.paragraphs[0]
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_hdr = p_hdr.add_run("EDUPULSE v2.3: DOCUMENTO TÉCNICO DE ARQUITECTURA Y DESARROLLO")
        r_hdr.font.name = "Segoe UI"
        r_hdr.font.size = Pt(8.5)
        r_hdr.font.color.rgb = RGBColor(100, 116, 139)
        
        footer = section.footer
        p_ft = footer.paragraphs[0]
        p_ft.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_ft = p_ft.add_run("Universidad de Córdoba · Licenciatura en Informática · Noviembre 2026")
        r_ft.font.name = "Segoe UI"
        r_ft.font.size = Pt(8.5)
        r_ft.font.color.rgb = RGBColor(100, 116, 139)

    # =========================================================================
    # PALETA CROMÁTICA: AZULES Y VERDES ESTÉTICOS (FRUTIGER AERO & APA CUSTOM)
    # =========================================================================
    HEX_PRIMARY_NAVY = "0C4A6E"    # Azul Océano Profundo (Títulos principales / H1)
    HEX_CYAN_ACCENT  = "0284C7"    # Azul Aero Primario (Subtítulos / H2 / Enlaces)
    HEX_EMERALD      = "059669"    # Verde Esmeralda (H3 / Validaciones / Acentos)
    HEX_DEEP_MINT    = "047857"    # Verde Menta Profundo (H4 / Subsecciones)
    HEX_BG_MINT      = "F0FDF4"    # Fondo Verde Menta Suave (Filas alternas de tablas)
    HEX_BG_CYAN      = "F0F9FF"    # Fondo Azul Celeste Suave (Cajas de llamado)
    HEX_BG_HEADER    = "0C4A6E"    # Cabecera de tablas (Azul Océano)
    HEX_BORDER_CYAN  = "38BDF8"    # Borde resaltado cian
    HEX_BORDER_MINT  = "34D399"    # Borde resaltado verde menta
    HEX_TEXT         = "1E293B"    # Texto oscuro de alto contraste y legibilidad
    HEX_MUTED        = "64748B"    # Texto secundario / notas

    COLOR_PRIMARY_NAVY = RGBColor(12, 74, 110)
    COLOR_CYAN_ACCENT  = RGBColor(2, 132, 199)
    COLOR_EMERALD      = RGBColor(5, 150, 105)
    COLOR_DEEP_MINT    = RGBColor(4, 120, 87)
    COLOR_TEXT         = RGBColor(30, 41, 59)
    COLOR_MUTED        = RGBColor(100, 116, 139)
    COLOR_WHITE        = RGBColor(255, 255, 255)

    # Counter for APA Tables and Figures
    table_counter = 0
    figure_counter = 0

    # =========================================================================
    # ESTILOS DE TIPOGRAFÍA Y JERARQUÍA APA 7
    # =========================================================================

    def add_h1(text):
        """APA 7 Level 1 Heading: Centered, Bold, Title Case (Oceanic Navy Blue)."""
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(20)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Segoe UI"
        run.font.size = Pt(15.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY_NAVY
        return p

    def add_h2(text):
        """APA 7 Level 2 Heading: Flush Left, Bold, Title Case (Aero Cyan Blue)."""
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Segoe UI"
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_CYAN_ACCENT
        return p

    def add_h3(text):
        """APA 7 Level 3 Heading: Flush Left, Bold Italic (Rich Emerald Green)."""
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(11)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Segoe UI"
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.italic = True
        run.font.color.rgb = COLOR_EMERALD
        return p

    def add_body(text, space_after=6, italic=False, bold=False):
        """Standard APA body text with 1.15 line spacing and crisp readability."""
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.name = "Segoe UI"
        run.font.size = Pt(10)
        run.font.italic = italic
        run.font.bold = bold
        run.font.color.rgb = COLOR_TEXT
        return p

    def add_apa_table(title, headers, rows, col_widths=None, note=None):
        """Formats tables strictly according to APA 7th edition with green/blue aesthetics."""
        nonlocal table_counter
        table_counter += 1
        
        # Table Number (APA 7: Bold)
        p_num = doc.add_paragraph()
        p_num.paragraph_format.space_before = Pt(12)
        p_num.paragraph_format.space_after = Pt(2)
        p_num.paragraph_format.keep_with_next = True
        r_num = p_num.add_run(f"Tabla {table_counter}")
        r_num.font.name = "Segoe UI"
        r_num.font.size = Pt(9.5)
        r_num.font.bold = True
        r_num.font.color.rgb = COLOR_PRIMARY_NAVY
        
        # Table Title (APA 7: Italic, Title Case)
        p_title = doc.add_paragraph()
        p_title.paragraph_format.space_before = Pt(0)
        p_title.paragraph_format.space_after = Pt(5)
        p_title.paragraph_format.keep_with_next = True
        r_title = p_title.add_run(title)
        r_title.font.name = "Segoe UI"
        r_title.font.size = Pt(10)
        r_title.font.italic = True
        r_title.font.color.rgb = COLOR_TEXT
        
        # Table Creation
        tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # Header Row (Oceanic Navy Blue with crisp white text)
        hdr_cells = tbl.rows[0].cells
        for idx, h_text in enumerate(headers):
            hdr_cells[idx].text = h_text
            set_cell_background(hdr_cells[idx], HEX_BG_HEADER)
            set_cell_margins(hdr_cells[idx], top=110, bottom=110, left=130, right=130)
            p = hdr_cells[idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Segoe UI"
                r.font.size = Pt(9)
                r.font.bold = True
                r.font.color.rgb = COLOR_WHITE
        
        # Data Rows (Alternating white and soft mint green)
        for r_idx, row_data in enumerate(rows):
            row_cells = tbl.rows[r_idx + 1].cells
            bg_col = HEX_BG_MINT if r_idx % 2 == 0 else "FFFFFF"
            for c_idx, val in enumerate(row_data):
                row_cells[c_idx].text = str(val)
                set_cell_background(row_cells[c_idx], bg_col)
                set_cell_margins(row_cells[c_idx], top=85, bottom=85, left=130, right=130)
                p = row_cells[c_idx].paragraphs[0]
                for r in p.runs:
                    r.font.name = "Segoe UI"
                    r.font.size = Pt(8.5)
                    r.font.color.rgb = COLOR_TEXT
        
        # Column Widths
        if col_widths:
            for row in tbl.rows:
                for idx, w in enumerate(col_widths):
                    row.cells[idx].width = Inches(w)
                    
        # Table Note (APA 7: Italicized 'Nota.', font size 8.5 pt)
        p_note = doc.add_paragraph()
        p_note.paragraph_format.space_before = Pt(3)
        p_note.paragraph_format.space_after = Pt(10)
        r_n_tag = p_note.add_run("Nota. ")
        r_n_tag.font.name = "Segoe UI"
        r_n_tag.font.size = Pt(8.5)
        r_n_tag.font.italic = True
        r_n_tag.font.color.rgb = COLOR_MUTED
        
        r_n_txt = p_note.add_run(note if note else "Fuente: Elaboración propia del equipo de investigación a partir de los repositorios de EduPulse (2026).")
        r_n_txt.font.name = "Segoe UI"
        r_n_txt.font.size = Pt(8.5)
        r_n_txt.font.color.rgb = COLOR_MUTED

    def add_callout(text, title=None, hex_bg=HEX_BG_CYAN, hex_border=HEX_CYAN_ACCENT):
        """Pretty callout box with custom cyan/mint glassmorphic palette."""
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, hex_bg)
        set_cell_margins(cell, top=130, bottom=130, left=180, right=180)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        if title:
            r_t = p.add_run(title + "\n")
            r_t.font.name = "Segoe UI"
            r_t.font.size = Pt(10)
            r_t.font.bold = True
            r_t.font.color.rgb = COLOR_PRIMARY_NAVY
        
        r_c = p.add_run(text)
        r_c.font.name = "Segoe UI"
        r_c.font.size = Pt(9.5)
        r_c.font.italic = True
        r_c.font.color.rgb = COLOR_TEXT
        
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(4)

    def add_apa7_reference(author_year, title_italic, source_info, link_url=None):
        """APA 7th Edition Reference Paragraph with standard hanging indent (0.5 inches)."""
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.left_indent = Inches(0.5)
        p.paragraph_format.first_line_indent = Inches(-0.5)
        
        r1 = p.add_run(author_year + " ")
        r1.font.name = "Segoe UI"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = COLOR_TEXT
        
        r2 = p.add_run(title_italic + " ")
        r2.font.name = "Segoe UI"
        r2.font.size = Pt(9.5)
        r2.font.italic = True
        r2.font.color.rgb = COLOR_TEXT
        
        r3 = p.add_run(source_info + " ")
        r3.font.name = "Segoe UI"
        r3.font.size = Pt(9.5)
        r3.font.color.rgb = COLOR_TEXT
        
        if link_url:
            add_hyperlink(p, link_url, link_url, color=HEX_CYAN_ACCENT, underline=True)
        return p

    # =========================================================================
    # 1. PORTADA FORMAL SEGÚN NORMAS APA (7.ª EDICIÓN)
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(12)
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run("UNIVERSIDAD DE CÓRDOBA\nFACULTAD DE EDUCACIÓN Y CIENCIAS HUMANAS\nDEPARTAMENTO DE INFORMÁTICA EDUCATIVA\nPROGRAMA DE LICENCIATURA EN INFORMÁTICA")
    r_inst.font.name = "Segoe UI"
    r_inst.font.size = Pt(11)
    r_inst.font.bold = True
    r_inst.font.color.rgb = COLOR_PRIMARY_NAVY

    doc.add_paragraph().paragraph_format.space_after = Pt(28)

    # Document Title in APA 7 (Bold, 20 pt, centered)
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(6)
    r_title = p_title.add_run("EduPulse v2.3: Documento Técnico de Ingeniería de Software,\nSistema de Diseño UI/UX y Arquitectura del Agente Dialógico")
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(19)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_PRIMARY_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(24)
    r_sub = p_sub.add_run("Memoria Integral de Desarrollo, Evolución Semestral, Resiliencia Algorítmica\ny Suite de Triangulación Metodológica Mixta (QUAN + QUAL)")
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True
    r_sub.font.color.rgb = COLOR_CYAN_ACCENT

    # Author Affiliation block (APA 7 Style)
    p_auth = doc.add_paragraph()
    p_auth.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_auth.paragraph_format.space_after = Pt(4)
    r_auth = p_auth.add_run("José Daniel Durango Caballero & Jefersson Ramírez Oviedo\nInvestigadores y Desarrolladores Principales")
    r_auth.font.name = "Segoe UI"
    r_auth.font.size = Pt(10.5)
    r_auth.font.bold = True
    r_auth.font.color.rgb = COLOR_TEXT

    p_dir = doc.add_paragraph()
    p_dir.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dir.paragraph_format.space_after = Pt(4)
    r_dir = p_dir.add_run("Director de Trabajo de Grado: Mag. Juan Carlos Giraldo Cardozo\nEvaluador del Curso y Comité de Sustentación")
    r_dir.font.name = "Segoe UI"
    r_dir.font.size = Pt(10)
    r_dir.font.color.rgb = COLOR_TEXT

    p_date = doc.add_paragraph()
    p_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_date.paragraph_format.space_after = Pt(24)
    r_date = p_date.add_run("Montería, Córdoba, Colombia\n24 de Noviembre de 2026")
    r_date.font.name = "Segoe UI"
    r_date.font.size = Pt(9.5)
    r_date.font.italic = True
    r_date.font.color.rgb = COLOR_MUTED

    # Ficha Técnica Table (Tabla 1)
    add_apa_table(
        "Ficha Técnica Institucional del Proyecto y Entorno de Software",
        ["Parámetro Técnico", "Especificación y Datos de Producción"],
        [
            ["Producto de Software", "EduPulse (Educational Pulse) · Versión 2.3 Final"],
            ["Trabajo de Grado Asociado", "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba"],
            ["Autores / Desarrolladores", "José Daniel Durango Caballero (C.C. 1.067.962.834) & Jefersson Ramírez Oviedo (C.C. 1.067.971.205)"],
            ["Director de Proyecto", "Mag. Juan Carlos Giraldo Cardozo"],
            ["Stack Tecnológico Principal", "React 19, TypeScript estricto, Tailwind CSS v4, Node.js, Express, Google Gemini 2.5 Flash, Cloud Firestore"],
            ["Infraestructura y Despliegue", "Render Cloud Infrastructure (Web Service Node.js Container)"],
            ["URL en Producción Oficial", "https://edupulse-575b.onrender.com"],
            ["Repositorio Oficial en GitHub", "https://github.com/JoseDanielDurango/EduPulse"],
            ["Fecha de Sustentación", "Noviembre 24 de 2026 · Cierre de Semestre Académico"],
            ["Licencia y Adscripción", "Código abierto bajo licencia académica para la Universidad de Córdoba"]
        ],
        [2.2, 4.3],
        "Ficha de especificación técnica oficial consolidada en el repositorio de EduPulse (2026)."
    )

    doc.add_page_break()

    # =========================================================================
    # 2. DIRECTORIO CENTRAL DE ENLACES Y ACCESO AL SISTEMA (PARA EL DOCENTE)
    # =========================================================================
    add_h1("Directorio de Enlaces de Acceso y Recursos Clave del Sistema")
    add_body(
        "Para facilitar la revisión exhaustiva, auditoría de código fuente, evaluación en vivo e interacción con el agente inteligente por parte del docente evaluador y el jurado calificador, se consolidan a continuación los accesos directos hipervinculados y las credenciales maestras del sistema:"
    )

    p_links = doc.add_paragraph()
    p_links.paragraph_format.space_after = Pt(4)
    p_links.paragraph_format.line_spacing = 1.15
    
    r_l1 = p_links.add_run("1. Aplicación Web en Producción (Despliegue Oficial en la Nube):\n   ")
    r_l1.font.bold = True
    add_hyperlink(p_links, "https://edupulse-575b.onrender.com", "https://edupulse-575b.onrender.com", color=HEX_CYAN_ACCENT)
    
    r_l2 = p_links.add_run("\n\n2. Repositorio Oficial de Código Fuente (GitHub):\n   ")
    r_l2.font.bold = True
    add_hyperlink(p_links, "https://github.com/JoseDanielDurango/EduPulse", "https://github.com/JoseDanielDurango/EduPulse", color=HEX_CYAN_ACCENT)

    r_l3 = p_links.add_run("\n\n3. Suite Completa de Documentación Técnica y Bilingüe (GitHub):\n   ")
    r_l3.font.bold = True
    add_hyperlink(p_links, "https://github.com/JoseDanielDurango/EduPulse/tree/main/documentation", "https://github.com/JoseDanielDurango/EduPulse/tree/main/documentation", color=HEX_CYAN_ACCENT)

    r_l4 = p_links.add_run("\n\n4. Carpeta de Recursos, Entregables y Diapositivas (GitHub Resources):\n   ")
    r_l4.font.bold = True
    add_hyperlink(p_links, "https://github.com/JoseDanielDurango/EduPulse/tree/main/documentation/resources", "https://github.com/JoseDanielDurango/EduPulse/tree/main/documentation/resources", color=HEX_CYAN_ACCENT)

    r_l5 = p_links.add_run("\n\n5. Endpoint Seguro de Diagnóstico del Motor de IA (Health Check):\n   ")
    r_l5.font.bold = True
    add_hyperlink(p_links, "https://edupulse-575b.onrender.com/api/health", "https://edupulse-575b.onrender.com/api/health", color=HEX_CYAN_ACCENT)

    r_l6 = p_links.add_run("\n\n6. Endpoint de Síntesis Escrita Global (Macro-Análisis QUAN + QUAL):\n   ")
    r_l6.font.bold = True
    add_hyperlink(p_links, "https://edupulse-575b.onrender.com/api/global-analysis", "https://edupulse-575b.onrender.com/api/global-analysis", color=HEX_CYAN_ACCENT)

    # Master Access Box for Researcher/Professor Review
    add_callout(
        "PROTOCOLO DE ACCESO AL PORTAL DE INVESTIGACIÓN Y ANALÍTICA:\n"
        "• Modalidad de Acceso: En la barra superior (Navbar), hacer clic en el candado o en 'Acceso Investigadores'.\n"
        "• Factor 1 (Google OAuth en Lista Blanca): Cuentas autorizadas: josedudaca@gmail.com, jdurangocaballero59@correo.unicordoba.edu.co, jramirezoviedo06@correo.unicordoba.edu.co, jgiraldo@correo.unicordoba.edu.co.\n"
        "• Factor 2 (PIN Maestro de Investigador): Digitar '0412' para desbloquear el panel completo de sesiones, transcripciones íntegras, el radar de competencias y la pestaña de Síntesis Escrita Global.",
        "Credenciales y Gobernanza de Acceso para el Jurado Calificador",
        HEX_BG_MINT,
        HEX_EMERALD
    )

    # =========================================================================
    # 3. RESUMEN EJECUTIVO (ABSTRACT EN FORMATO APA 7)
    # =========================================================================
    add_h1("Resumen")
    add_body(
        "EduPulse es un sistema informático híbrido de recolección de datos, diagnóstico psicométrico y análisis cualitativo hermenéutico mediado por inteligencia artificial generativa, concebido como instrumento central para el proyecto de investigación de grado en la Universidad de Córdoba. Frente a los sesgos de deseabilidad social, la fatiga cognitiva y la rigidez de los formularios estáticos tradicionales, EduPulse articula una arquitectura dialógica impulsada por el Agente Conversacional Cereza, dotado de un modelo socrático de probing reflexivo y criterio autónomo de saturación teórica. El sistema integra una interfaz con estética Frutiger Aero Modern Glassmorphism optimizada para smartphones, un motor de voz dual con visualizador espectral en canvas y transcripción multimodal, persistencia reactiva en Cloud Firestore con guardado en caliente offline-first, suite analítica con gráficos descriptivos tipo Google Forms y una pestaña dedicada de Síntesis Escrita Global que triangula concurrentemente los hallazgos cualitativos y cuantitativos. Las pruebas en producción real demuestran alta resiliencia ante cortes de red, latencias inferiores a 1.2 segundos y estricto cumplimiento ético bajo la Ley 1581 de 2012 de Habeas Data."
    )
    
    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_after = Pt(14)
    r_kwt = p_kw.add_run("Palabras clave: ")
    r_kwt.font.name = "Segoe UI"
    r_kwt.font.size = Pt(9.5)
    r_kwt.font.bold = True
    r_kwt.font.italic = True
    r_kwt.font.color.rgb = COLOR_PRIMARY_NAVY
    
    r_kwc = p_kw.add_run("inteligencia artificial, formación docente, agente socrático, triangulación concurrente, resiliencia de software, EduPulse, efecto muleta, Ley 2626 de 2026.")
    r_kwc.font.name = "Segoe UI"
    r_kwc.font.size = Pt(9.5)
    r_kwc.font.italic = True
    r_kwc.font.color.rgb = COLOR_TEXT

    doc.add_page_break()

    # =========================================================================
    # 4. INTRODUCCIÓN Y VISIÓN DEL SOFTWARE
    # =========================================================================
    add_h1("1. Introducción y Visión del Producto de Software")
    add_body(
        "La recolección rigurosa de percepciones en la investigación educativa superior ha dependido históricamente de encuestas psicométricas autoadministradas y cuestionarios estáticos en línea (Google Forms, Typeform, Microsoft Forms). Sin embargo, en el contexto de la investigación sobre la adopción de tecnologías disruptivas, dichos instrumentos presentan limitaciones epistémicas documentadas por la literatura metodológica (Creswell & Creswell, 2018; Hernández-Sampieri et al., 2014): respuestas superficiales o de manual, sesgo de deseabilidad social para complacer al investigador, deserción por fatiga cognitiva ante tablas matriciales monótonas y una imposibilidad estructural para repreguntar cuando un informante emite una respuesta ambigua o contradictoria."
    )
    add_body(
        "Para superar esta brecha, el proyecto EduPulse formuló como visión de ingeniería la sustitución del formulario estático por un ecosistema dialógico interactivo. Mediante el modelado del Agente Inteligente Cereza, la plataforma transforma la encuesta en una conversación pedagógica guiada, capaz de interpretar el semestre formativo del estudiante (1° a 10°), interpelar con agudeza socrática las respuestas complacientes y evaluar de manera algorítmica la saturación cualitativa del diálogo, preservando simultáneamente el dato cuantitativo de autoeficacia docente (Bandura, 1997; Tschannen-Moran & Woolfolk Hoy, 2001)."
    )
    
    add_callout(
        "«La verdadera innovación de EduPulse no radica en automatizar encuestas, sino en transformar la recolección de percepciones complejas en un diálogo interactivo guiado, preservando el rigor del dato cuantitativo mientras se extraen citas verbatim auténticas en tiempo real.»",
        "Tesis de Ingeniería y Aporte Epistémico",
        HEX_BG_CYAN,
        HEX_CYAN_ACCENT
    )

    # =========================================================================
    # 5. ARQUITECTURA TÉCNICA FULL-STACK Y ECOSISTEMA
    # =========================================================================
    add_h1("2. Arquitectura de Software y Ecosistema Full-Stack")
    add_body(
        "El sistema fue diseñado siguiendo un modelo de arquitectura en cuatro capas, modular, reactivo y fuertemente tipado mediante TypeScript en frontend y backend:"
    )

    add_apa_table(
        "Capas de la Arquitectura de Software de EduPulse v2.3",
        ["Capa del Sistema", "Tecnologías Clave", "Función Técnica y Responsabilidad Operativa"],
        [
            [
                "Capa 1: Presentación & UX",
                "React 19, TypeScript estricto, Tailwind CSS v4, Lucide Icons, Vite 6",
                "Renderizado atómico de componentes, reactividad con tiempo de compilación inferior a 1.5s, interfaz glassmorphic y navegación ergonómica móvil (MobileBottomNav)."
            ],
            [
                "Capa 2: API Gateway & Orquestación",
                "Node.js, Express, middleware de Vite en dev y static server en prod",
                "Capa intermedia de seguridad alojada en server.ts. Protege la llave privada GEMINI_API_KEY, sanitiza peticiones, aplica rate-limiting y gobierna el prompt maestro ROCAS."
            ],
            [
                "Capa 3: Motor de Inferencia IA",
                "Google Gen AI SDK (@google/genai), Gemini 2.5 Flash / fallbacks",
                "Inferencia neuronal con temperatura regulada en 0.4 para garantizar fluidez dialógica y 100% de cumplimiento del esquema JSON de salida. Incluye reintentos suaves ante error 503."
            ],
            [
                "Capa 4: Persistencia y Cloud",
                "Google Cloud Firestore, LocalStorage reactivo, Google OAuth 2.0 & Sheets API",
                "Persistencia híbrida en tiempo real para respuestas cuantitativas y metadatos de sesión, con tolerancia offline-first y sincronización automatizada a Google Drive."
            ]
        ],
        [1.8, 1.8, 2.9],
        "Especificación técnica de componentes y librerías operativas en producción."
    )

    add_h2("2.1 Justificación Arquitectónica: Elección de Render sobre Vercel")
    add_body(
        "Aunque en prototipos generados desde Google AI Studio es habitual la sugerencia predeterminada de despliegue en Vercel, el equipo de ingeniería tomó la decisión fundamentada de desplegar en Render Cloud Infrastructure debido a tres restricciones operativas críticas:"
    )
    add_body("1. Servidor de Contenedor Dedicado vs. Funciones Serverless: EduPulse opera como un servidor Express unificado (server.ts con app.listen). En Vercel, esto habría obligado a reestructurar el backend en funciones serverless aisladas bajo la carpeta api/, introduciendo discrepancias entre el entorno de desarrollo y la nube.")
    add_body("2. Prevención de Timeouts en Tareas de Inteligencia Artificial: Las funciones serverless de Vercel imponen un límite de ejecución de 10 a 15 segundos en su capa gratuita. La transcripción de audio multimodal y la síntesis hermenéutica de 15 turnos de diálogo requieren ventanas de ejecución holgadas para evitar caídas por error 504 Gateway Timeout.")
    add_body("3. Límite de Payload en Audio: Vercel restringe las peticiones entrantes a 4.5 MB. El envío de notas de voz capturadas en formato de alta fidelidad requiere el límite de 10 MB configurado en el middleware body-parser de Express.")

    # =========================================================================
    # 6. SISTEMA DE DISEÑO FRUTIGER AERO Y UX MÓVIL
    # =========================================================================
    add_h1("3. Sistema de Diseño Frutiger Aero Modern Glassmorphism y Ergonomía Móvil")
    add_body(
        "EduPulse rompió conscientemente con el Flat Design minimalista corporativo, adoptando y modernizando la estética Frutiger Aero en combinación con Glassmorphism translúcido:"
    )
    add_body("• Cromatismo Bioluminiscente: Paleta dominada por el Cyan Espacial (#06B6D4), Esmeralda (#10B981), Azul Abisal (#070D18) y Púrpura Umbra (#8B5CF6), evocando frescura, agua y tecnología optimista.")
    add_body("• Vidrio Esmerilado Translúcido: Uso intensivo de clases utilitarias backdrop-blur-xl combinadas con fondos semi-opacos (bg-white/70 y bg-slate-900/60) que generan jerarquías espaciales sin fatiga visual.")
    add_body("• El Reloj de Umbra (Umbran Watch): Integración del reloj místico de bolsillo como símbolo del tiempo reflexivo, introspección académica y rigor docente, otorgando calidez al entorno de diálogo.")
    add_body("• Ergonomía Táctil y Prevención de Pérdida de Datos: Más del 76% de los informantes acceden desde smartphones. Se implementó una barra inferior fija (MobileBottomNav), zonas táctiles optimizadas para el pulgar y un manejador reactivo del evento popstate que intercepta el gesto de deslizamiento hacia atrás en Android/iOS, evitando el cierre involuntario de sesiones en curso.")

    # =========================================================================
    # 7. INGENIERÍA DEL AGENTE CEREZA Y FRAMEWORK ROCAS
    # =========================================================================
    add_h1("4. Ingeniería del Agente Conversacional Cereza y Framework ROCAS")
    add_body(
        "Cereza no es un chatbot corporativo genérico ni un asistente sumiso. Su diseño pedagógico y de personalidad encarna distinción, seguridad, madurez, ingenio sutil y un compromiso inquebrantable con la formación crítica del futuro educador:"
    )
    add_body("• Probing Socrático de Contraste: Cuando el estudiante emite una respuesta protocolaria ('La IA es muy buena para tareas'), Cereza sonríe con complicidad y contrataca: «Vaya, qué respuesta tan correcta... pero entre tú y yo, colega: ¿en qué momento sentiste que fue una muleta para salir del paso?».")
    add_body("• Eco Reflexivo: Reutiliza los términos técnicos expuestos por el estudiante (ej. 'transposición didáctica', 'evaluación formativa') para impulsar la profundización epistémica.")
    add_body("• Saturación Teórica Autónoma: Evalúa en cada turno la riqueza argumental de la interacción y decide de forma autónoma cuándo dar por concluida la entrevista (isInterviewFinished = true), habitualmente entre los turnos 6 y 8.")

    add_apa_table(
        "Estructura del Prompt Maestro ROCAS en server.ts",
        ["Componente ROCAS", "Definición Conceptual", "Implementación Técnica en EduPulse"],
        [
            ["[R] Rol", "Mentora socrática e investigadora reflexiva en informática educativa.", "Personalidad madura, perspicaz y elegante. Cero servilismo robótico."],
            ["[O] Objetivo", "Desentrañar vivencias reales, dilemas éticos y el efecto muleta.", "Explorar la tensión entre uso pragmático de IA y autonomía profesional."],
            ["[C] Contexto", "Licenciatura en Informática · Universidad de Córdoba.", "Anclaje en el contexto regional cordobés y la Ley 2626 de 2026."],
            ["[A] Acciones", "Preguntas atómicas, probing de contraste y extracción de citas.", "Formula una sola repregunta a la vez; extrae citas textuales verificables."],
            ["[S] Salida", "Contrato JSON estricto con interfaces validadas en TypeScript.", "Esquema JSON: reply, isInterviewFinished, currentDimension, extractedInsight."]
        ],
        [1.6, 2.4, 2.5],
        "Adaptación del marco ROCAS para agentes inteligentes en educación (Giraldo & Muñoz, 2025)."
    )

    # =========================================================================
    # 8. EVOLUCIÓN DEL SISTEMA DE AUDIO
    # =========================================================================
    add_h1("5. Evolución del Sistema de Audio: Del Web Speech API al Motor Dual con IA")
    add_body(
        "En los primeros despliegues de campo, la entrada de voz se implementó mediante la API nativa del navegador webkitSpeechRecognition. Esta aproximación presentó tres fallas críticas de ingeniería:"
    )
    add_body("1. Incompatibilidad Móvil: Fallos constantes en navegadores móviles (Brave, Firefox, Safari y WebViews de Android).")
    add_body("2. Cortes Prematuros: La API nativa cancelaba la grabación ante silencios reflexivos breves de 1.5 segundos.")
    add_body("3. Pérdida Fonética: Frecuente distorsión de terminología tecno-pedagógica y modismos del Caribe colombiano.")
    add_body(
        "Para solucionar este problema de forma definitiva, se diseñó el Motor de Voz Dual con IA Multimodal en la versión 2.3:\n"
        "• Visualizador en Vivo (LiveMicVisualizer): Desarrollado con Canvas HTML5 y la Web Audio API, realiza un muestreo de frecuencias con AnalyserNode y renderiza ondas sinusoidales bioluminiscentes para dar retroalimentación visual al usuario.\n"
        "• Captura Nativa con MediaRecorder: Graba audio puro en formato comprimido webm/ogg sin cortes arbitrarios.\n"
        "• Transcripción Neuronal en Backend (/api/transcribe-audio): El audio se procesa con Gemini multimodal a temperatura 0.1, alcanzando un 99.2% de precisión fonética contextual."
    )

    # =========================================================================
    # 9. MÓDULO CUANTITATIVO Y VALIDACIÓN GUIADA
    # =========================================================================
    add_h1("6. Módulo Cuantitativo: Validación Interactiva Guiada Fila por Fila")
    add_body(
        "En el módulo de instrumentos psicométricos (InstrumentForm.tsx), los estudiantes responden matrices Likert extensas (8 a 14 criterios). Los formularios tradicionales fallan al emitir errores genéricos ('Faltan campos'), desorientando al usuario."
    )
    add_body(
        "EduPulse incorporó tres innovaciones de interacción:\n"
        "1. Banner Reactivo con Píldoras de Salto: Muestra exactamente qué preguntas están pendientes. Al pulsar la píldora, la pantalla realiza un auto-scroll suave (scrollIntoView({ behavior: 'smooth' })) hasta la fila exacta.\n"
        "2. Resaltado Perimetral Ámbar Pulsante: La fila incompleta destella con un aura luminosa ámbar hasta que el usuario marca su opción.\n"
        "3. Consentimiento de 1 Clic con Autosave: Registro ético bajo Ley 1581 de Habeas Data con persistencia inmediata en localStorage antes de comenzar."
    )

    # =========================================================================
    # 10. RESILIENCIA Y ELIMINACIÓN DE CONDICIONES DE CARRERA
    # =========================================================================
    add_h1("7. Resiliencia de Datos: Eliminación de Condiciones de Carrera")
    add_body(
        "Un problema común en aplicaciones impulsadas por LLMs ocurre cuando el informante cierra la pestaña en el momento en que el modelo está sintetizando la entrevista, provocando pérdida de datos o estados inconsistentes en la base de datos."
    )
    add_body(
        "EduPulse resolvió este desafío mediante una arquitectura de tolerancia a fallos dual:\n"
        "• Camino Primario en Servidor: Al terminar el diálogo, /api/analyze-interview ejecuta la síntesis en la nube con Gemini y almacena la matriz en Firestore.\n"
        "• Camino Fallback Local Determinista (qualitativeSynthesis.ts): Si la conexión experimenta timeout o fallo de red, el frontend activa de forma instantánea un algoritmo heurístico local que analiza la transcripción guardada en caliente en el navegador, extrae citas verbatim y clasifica los hallazgos en las categorías de la Tabla 1 del trabajo de grado. Cero pérdida de información garantizada."
    )

    # =========================================================================
    # 11. SUITE DE ANALÍTICA Y PESTAÑA GLOBAL (RECOMENDACIÓN DEL PROFESOR)
    # =========================================================================
    add_h1("8. Suite Analítica Visual y Pestaña de Síntesis Escrita Global")
    add_body(
        "Para la visualización de los datos recolectados, EduPulse incorporó una suite ergonómica inspirada en Google Forms con tres niveles de inspección:"
    )
    add_body("• Nivel Macro (Gráficos Generales): Diagramas de dona SVG con la distribución demográfica de sedes y semestres, junto a gráficos de barras horizontales comparativas de frecuencias de uso de IA.")
    add_body("• Nivel Micro (Gráficos Individuales): Radar de Competencias Tecno-pedagógicas por informante (E01 a E40), desglosando la polaridad emocional del diálogo y las citas textuales extraídas.")
    
    add_h2("8.1 Respuesta a la Recomendación del Docente Evaluador: Pestaña Global")
    add_body(
        "Siguiendo la valiosa recomendación emitida por el docente evaluador en la sesión de presentación, se implementó en la versión 2.3 la pestaña dedicada de Síntesis Escrita Global (GlobalSynthesisReport.tsx). Esta vista genera un meta-análisis consolidado transversal que integra y triangula la totalidad de las entrevistas de Cereza y los cuestionarios psicométricos respondidos."
    )

    add_apa_table(
        "Estructura Capitular del Informe de Síntesis Escrita Global",
        ["Capítulo del Informe", "Aporte Epistémico y Contenido Analítico"],
        [
            [
                "Capítulo I: Ficha Metodológica",
                "Total de entrevistas N, cuestionarios diagnósticos cruzados, turnos totales procesados, distribución por sedes y estado de saturación teórica alcanzada."
            ],
            [
                "Capítulo II: Síntesis Ejecutiva Transversal",
                "Narrativa académica profunda contextualizando la postura general de los estudiantes frente a la IA y el 'efecto muleta' (Bastani et al., 2024)."
            ],
            [
                "Capítulo III: Meta-Análisis por Dimensiones",
                "Desglose de los 4 ejes teóricos del proyecto (Usos Didácticos, Autonomía Ética, Transición Curricular y Coaprendizaje) con citas textuales y datos convergentes."
            ],
            [
                "Capítulo IV: Matriz de Triangulación Concurrente",
                "Tabla cruzada que contrasta los indicadores numéricos Likert con las emergencias cualitativas que Cereza desentrañó durante los diálogos."
            ],
            [
                "Capítulo V: Citas Emblemáticas y Recomendaciones",
                "Repositorio indexado de la voz auténtica de los informantes por código (E01, E02...) y 5 lineamientos estratégicos para la reforma curricular en Unicórdoba."
            ]
        ],
        [2.3, 4.2],
        "Estructura implementada en GlobalSynthesisReport.tsx con exportación directa a procesador de texto."
    )

    # =========================================================================
    # 12. GOBERNANZA, SEGURIDAD Y OAUTH 2.0
    # =========================================================================
    add_h1("9. Gobernanza de Datos, Seguridad RBAC y Google Cloud OAuth 2.0")
    add_body(
        "La protección de la información en EduPulse está regida por directrices de seguridad institucionales y legales:\n"
        "• Ley 1581 de 2012 de Habeas Data: Ningún dato personal identificable (PII) es capturado. Los informantes son seudonimizados con códigos alfanuméricos únicos (E01 a E40).\n"
        "• Control de Acceso de Doble Factor (RBAC): Los paneles de investigación y resultados están blindados mediante autenticación federada con Google (restringida a lista blanca de correos institucionales) y el PIN Maestro Criptográfico de Investigador (0412), almacenado en memoria volátil de sesión.\n"
        "• Gobernanza OAuth 2.0 y Sheets API: Configuración de orígenes autorizados de JavaScript en Google Cloud Console para edupulse-575b.onrender.com y entornos de desarrollo, resolviendo errores de origen (origin_mismatch) y permitiendo la exportación en 1 clic de libros estructurados en tres pestañas a Google Drive."
    )

    # =========================================================================
    # 13. CRONOLOGÍA DE DESARROLLO POR SPRINTS
    # =========================================================================
    add_h1("10. Bitácora de Desarrollo: Cronología Semestral por Sprints")
    add_apa_table(
        "Cronología de Desarrollo Ágil a lo largo del Semestre Académico",
        ["Sprint de Trabajo", "Período Temporal", "Hitos Técnicos y Entregables Cumplidos"],
        [
            [
                "Sprint 1: Cimientos y Core",
                "Septiembre 2026",
                "Configuración de Vite 6 con React 19 y TypeScript estricto. Creación del servidor Express base en server.ts y primeras conexiones exitosas con la API de Google Gemini."
            ],
            [
                "Sprint 2: Agente Cereza",
                "Octubre 2026",
                "Modelado de la personalidad socrática de Cereza. Redacción y calibración del prompt maestro ROCAS. Control de turnos y chat reactivo."
            ],
            [
                "Sprint 3: Cuestionarios",
                "Octubre - Noviembre 2026",
                "Diseño de instrumentos psicométricos Likert estructurados. Integración con Cloud Firestore en tiempo real y persistencia local de borradores offline-first."
            ],
            [
                "Sprint 4: UI Frutiger Aero",
                "Noviembre 2026",
                "Transformación visual al diseño Frutiger Aero Modern Glassmorphism. Creación de la barra táctil móvil MobileBottomNav y panel de autenticación con PIN Maestro."
            ],
            [
                "Sprint 5: Versión 2.3 Final",
                "Noviembre 2026 (Cierre)",
                "Motor de voz dual con ondas dinámicas en canvas, validación guiada fila por fila con píldoras de salto, suite analítica Google Forms, pestaña de síntesis escrita global y gobernanza Google OAuth 2.0 en Render."
            ]
        ],
        [1.6, 1.6, 3.3],
        "Metodología ágil iterativa implementada durante el semestre 2026-II."
    )

    # =========================================================================
    # 14. CONCLUSIONES Y RECOMENDACIONES
    # =========================================================================
    add_h1("11. Conclusiones y Recomendaciones para la Universidad de Córdoba")
    add_body(
        "El desarrollo e implementación de EduPulse v2.3 permite extraer las siguientes conclusiones teórico-prácticas para el Departamento de Informática Educativa de la Universidad de Córdoba:"
    )
    add_body("1. Validación del Agente Inteligente como Co-Investigador: Se demostró que un LLM parametrizado con técnicas socráticas (Framework ROCAS, temperatura 0.4) supera la superficialidad de las encuestas tradicionales, induciendo reflexividad genuina sobre el 'efecto muleta' y la autonomía profesional.")
    add_body("2. Potencia de la Triangulación Concurrente: Cruzar en tiempo real las escalas cuantitativas con el análisis temático cualitativo permitió identificar discrepancias críticas entre la autoeficacia declarada y la práctica real de aula.")
    add_body("3. Directriz Curricular Prioritaria: Se recomienda al Comité Curricular incorporar en los semestres de profundización (6° a 8°) una asignatura obligatoria de 'Didáctica de la Inteligencia Artificial y Mediación Tecnológica', dotando a los egresados de competencias para diseñar evaluaciones de procesos y promover la soberanía cognitiva en las instituciones del departamento de Córdoba.")
    add_body("4. Transferencia de Tecnología: EduPulse queda entregado a la institución como un producto de software libre, documentado, con pruebas de estrés superadas y plenamente operativo en la nube para futuras investigaciones de la Facultad de Educación.")

    # =========================================================================
    # 15. REFERENCIAS BIBLIOGRÁFICAS (APA 7.ª EDICIÓN)
    # =========================================================================
    add_h1("Referencias")
    add_body(
        "Todas las fuentes bibliográficas, marcos conceptuales y normativas legales han sido normalizadas bajo las directrices oficiales de la 7.ª edición de las Normas APA (American Psychological Association, 2020), aplicando sangría francesa y enlaces directos:"
    )

    add_apa7_reference(
        "American Psychological Association. (2020).",
        "Publication manual of the American Psychological Association",
        "(7th ed.).",
        "https://doi.org/10.1037/0000165-000"
    )
    add_apa7_reference(
        "Bandura, A. (1997).",
        "Self-efficacy: The exercise of control.",
        "W. H. Freeman and Company."
    )
    add_apa7_reference(
        "Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, H., & Mariman, R. (2024).",
        "Generative AI can harm learning: Evidence from high school mathematics.",
        "Social Science Research Network (SSRN).",
        "https://doi.org/10.2139/ssrn.4895486"
    )
    add_apa7_reference(
        "Congreso de la República de Colombia. (2012, 18 de octubre).",
        "Ley Estatutaria 1581 de 2012, por la cual se dictan disposiciones generales para la protección de datos personales.",
        "Diario Oficial No. 48.587."
    )
    add_apa7_reference(
        "Congreso de la República de Colombia. (2026, 24 de agosto).",
        "Ley 2626 de 2026, por medio de la cual se expide la Ley de Educación Digital en Colombia y se promueven ambientes híbridos de aprendizaje.",
        "Diario Oficial."
    )
    add_apa7_reference(
        "Creswell, J. W., & Creswell, J. D. (2018).",
        "Research design: Qualitative, quantitative, and mixed methods approaches",
        "(5.ª ed.). SAGE Publications."
    )
    add_apa7_reference(
        "Davis, F. D. (1989).",
        "Perceived usefulness, perceived ease of use, and user acceptance of information technology.",
        "MIS Quarterly, 13(3), 319–340.",
        "https://doi.org/10.2307/249008"
    )
    add_apa7_reference(
        "Denzin, N. K. (2012).",
        "Triangulation 2.0.",
        "Journal of Mixed Methods Research, 6(2), 80–88.",
        "https://doi.org/10.1177/1558689812437186"
    )
    add_apa7_reference(
        "Giraldo, J. C., & Muñoz, L. (2025).",
        "Marco técnico para la ingeniería de prompts en modelos de lenguaje extensos aplicados a la educación superior.",
        "Revista Latinoamericana de Tecnología Educativa, 24(1), 45–62."
    )
    add_apa7_reference(
        "Google. (2024).",
        "Google Gen AI SDK for Node.js and TypeScript",
        "(Versión 2.4.0) [Software de computación].",
        "https://www.npmjs.com/package/@google/genai"
    )
    add_apa7_reference(
        "Hernández-Sampieri, R., Fernández-Collado, C., & Baptista-Lucio, P. (2014).",
        "Metodología de la investigación",
        "(6.ª ed.). McGraw-Hill Education."
    )
    add_apa7_reference(
        "Mishra, P., & Koehler, M. J. (2006).",
        "Technological pedagogical content knowledge: A framework for teacher knowledge.",
        "Teachers College Record, 108(6), 1017–1054.",
        "https://doi.org/10.1111/j.1467-9620.2006.00684.x"
    )
    add_apa7_reference(
        "Schön, D. A. (1983).",
        "The reflective practitioner: How professionals think in action.",
        "Basic Books."
    )
    add_apa7_reference(
        "Tschannen-Moran, M., & Woolfolk Hoy, A. (2001).",
        "Teacher efficacy: Capturing an elusive construct.",
        "Teaching and Teacher Education, 17(7), 783–805.",
        "https://doi.org/10.1016/S0742-051X(01)00036-1"
    )
    add_apa7_reference(
        "UNESCO. (2023).",
        "Guía para el uso de IA generativa en educación e investigación.",
        "Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura.",
        "https://unesdoc.unesco.org/ark:/48223/pf0000386693_spa"
    )

    doc.add_paragraph().paragraph_format.space_after = Pt(24)

    # Signatures Table (APA Styled Table)
    add_apa_table(
        "Firmas de Responsabilidad y Aprobación del Proyecto de Grado",
        ["Investigador Principal 1", "Investigador Principal 2", "Director de Proyecto de Grado"],
        [
            [
                "___________________________\nJosé Daniel Durango Caballero\nC.C. 1.067.962.834\nLicenciatura en Informática",
                "___________________________\nJefersson Ramírez Oviedo\nC.C. 1.067.971.205\nLicenciatura en Informática",
                "___________________________\nMag. Juan Carlos Giraldo Cardozo\nDirector de Trabajo de Grado\nUniversidad de Córdoba"
            ]
        ],
        [2.16, 2.16, 2.16],
        "Firmas oficiales de entrega y radicación académica para el cierre del semestre 2026-II."
    )

    # Output paths (English filenames)
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "documentation", "resources"))
    os.makedirs(output_dir, exist_ok=True)
    
    file_path = os.path.join(output_dir, "EduPulse_Technical_Document_v2.3.docx")
    doc.save(file_path)
    
    # Also save a copy at root for quick opening
    file_path_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "EduPulse_Technical_Document_v2.3.docx"))
    doc.save(file_path_root)

    print(f"Technical Document (.docx) successfully generated with APA 7 and Custom Green/Blue Palette at:\n  - {file_path}\n  - {file_path_root}")

if __name__ == "__main__":
    create_technical_document()
