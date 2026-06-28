from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(texts):
    return model.encode(texts).tolist()

def create_query_embedding(query):
    return model.encode(query).tolist()