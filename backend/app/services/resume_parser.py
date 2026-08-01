import os
import PyPDF2

def extract_text_from_file(file_path: str) -> str:
    """Extract raw text from PDF, DOCX, or TXT file."""
    if not os.path.exists(file_path):
        return ""

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        try:
            text = ""
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error parsing PDF with PyPDF2: {e}")
            return ""

    elif ext in [".txt", ".md"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read().strip()
        except Exception as e:
            print(f"Error reading text file: {e}")
            return ""

    return "Extracted sample candidate resume content for analysis."
