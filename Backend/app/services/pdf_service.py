import fitz
import re

def extract_pages(file_path):

    doc = fitz.open(file_path)

    pages = []

    for page_num in range(len(doc)):

        page = doc.load_page(page_num)

        text = page.get_text("text")

        text = re.sub(r"\n+", "\n", text)
        text = re.sub(r"[ ]{2,}", " ", text)

        pages.append({
            "page": page_num + 1,
            "text": text
        })

    return pages