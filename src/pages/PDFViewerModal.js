// src/pages/PDFViewerModal.js
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import "./PDFViewerModal.css";

// ===== التصحيح هنا - استخدام رابط ثابت ومحدث =====
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
// ===============================================

function PDFViewerModal({ fileUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="pdf-modal-backdrop" onClick={onClose}>
      <div className="pdf-modal-content" onClick={handleContentClick}>
        <button className="close-modal-btn" onClick={onClose} title="إغلاق">
          &times;
        </button>
        <div className="pdf-document-container">
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}

export default PDFViewerModal;