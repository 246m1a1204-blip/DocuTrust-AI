import numpy as np


def search_similar_chunks(
    query_embedding,
    index,
    chunks,
    k=5
):

    query_vector = np.array(
        [query_embedding]
    ).astype("float32")

    distances, indices = index.search(
        query_vector,
        k
    )

    results = []

    for idx in indices[0]:

        if idx != -1:

            results.append(chunks[idx])

    return results