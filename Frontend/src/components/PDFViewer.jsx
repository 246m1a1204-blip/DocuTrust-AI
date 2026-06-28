import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ pdfFile, currentPage }) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">PDF Preview</h2>

      {!pdfFile ? (
        <div className="text-center py-20 text-gray-500">
          Upload a PDF to preview it.
        </div>
      ) : (
        <div className="overflow-auto">
          <Document
            file={pdfFile}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={currentPage} width={700} />
          </Document>

          <p className="text-center mt-4 text-gray-500">
            Page {currentPage} / {numPages}
          </p>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
