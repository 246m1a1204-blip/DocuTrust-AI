from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_pages(pages):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=300
    )

    chunks = []

    for page in pages:

        texts = splitter.split_text(page["text"])

        for txt in texts:

            chunks.append({
                "page": page["page"],
                "text": txt
            })

    return chunks