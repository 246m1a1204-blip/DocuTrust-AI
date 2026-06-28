import faiss
import numpy as np

import faiss
import numpy as np
import os

def create_faiss_index(embeddings):

    dimension = len(embeddings[0])

    index = faiss.IndexFlatL2(dimension)

    vectors = np.array(embeddings).astype("float32")

    index.add(vectors)

    os.makedirs("vectorstore", exist_ok=True)

    faiss.write_index(index, "vectorstore/faiss_index.bin")

    return index