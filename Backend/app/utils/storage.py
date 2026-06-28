import json
import os

DATA_DIR = "data"
CHUNKS_FILE = os.path.join(DATA_DIR, "chunks.json")

os.makedirs(DATA_DIR, exist_ok=True)


def save_chunks(chunks):

    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(
            chunks,
            f,
            ensure_ascii=False,
            indent=4
        )


def load_chunks():

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)