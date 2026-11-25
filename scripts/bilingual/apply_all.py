import os
from scripts.bilingual.helper import append_english_version
from scripts.bilingual.content_01 import en_01
from scripts.bilingual.content_02 import en_02
from scripts.bilingual.content_03 import en_03
from scripts.bilingual.content_04 import en_04
from scripts.bilingual.content_05 import en_05
from scripts.bilingual.content_06 import en_06
from scripts.bilingual.content_07 import en_07
from scripts.bilingual.content_08 import en_08
from scripts.bilingual.content_script import en_script

DOCS_DIR = "documentation"
RES_DIR = os.path.join(DOCS_DIR, "resources")

mappings = [
    (os.path.join(DOCS_DIR, "01-tutor-model.md"), en_01),
    (os.path.join(DOCS_DIR, "02-knowledge-model.md"), en_02),
    (os.path.join(DOCS_DIR, "03-student-model.md"), en_03),
    (os.path.join(DOCS_DIR, "04-world-model.md"), en_04),
    (os.path.join(DOCS_DIR, "05-master-prompt-rocas.md"), en_05),
    (os.path.join(DOCS_DIR, "06-system-architecture.md"), en_06),
    (os.path.join(DOCS_DIR, "07-instruments-and-triangulation.md"), en_07),
    (os.path.join(DOCS_DIR, "08-security-and-access-control.md"), en_08),
    (os.path.join(RES_DIR, "presentation-defense-script.md"), en_script),
]

for filepath, en_content in mappings:
    append_english_version(filepath, en_content)

print("\nAll 9 documentation files have been successfully processed and updated to bilingual format!")
