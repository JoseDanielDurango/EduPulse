import os

def append_english_version(filepath, english_content):
    with open(filepath, "r", encoding="utf-8") as f:
        spanish = f.read()
    
    # Strip any previous english version to avoid duplicates
    if "\n---\n" in spanish and "# English Version" in spanish:
        spanish = spanish.split("\n---\n")[0].strip()
    
    # Update internal cross-references to new English filenames in Spanish body
    spanish = spanish.replace("01-modelo-del-tutor.md", "01-tutor-model.md")
    spanish = spanish.replace("02-modelo-del-conocimiento.md", "02-knowledge-model.md")
    spanish = spanish.replace("03-modelo-del-alumno.md", "03-student-model.md")
    spanish = spanish.replace("04-modelo-del-mundo.md", "04-world-model.md")
    spanish = spanish.replace("05-prompt-maestro-rocas.md", "05-master-prompt-rocas.md")
    spanish = spanish.replace("06-arquitectura-del-sistema.md", "06-system-architecture.md")
    spanish = spanish.replace("07-instrumentos-y-triangulacion.md", "07-instruments-and-triangulation.md")
    spanish = spanish.replace("08-seguridad-y-control-de-acceso.md", "08-security-and-access-control.md")
    spanish = spanish.replace("GUION-DE-SUSTENTACION.md", "presentation-defense-script.md")
    spanish = spanish.replace("Documento_Tecnico_EduPulse_v2.3.docx", "EduPulse_Technical_Document_v2.3.docx")
    spanish = spanish.replace("EduPulse_Desarrollo_y_Diseno_Final.pptx", "EduPulse_Development_and_Design_Final.pptx")
    spanish = spanish.replace("EduPulse_Sustentacion_Final.pptx", "EduPulse_Final_Defense_Presentation.pptx")
    
    final_text = spanish.strip() + "\n\n---\n\n# English Version\n\n" + english_content.strip() + "\n"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(final_text)
    
    print(f"Successfully processed {filepath} -> Total lines: {len(final_text.splitlines())}")
