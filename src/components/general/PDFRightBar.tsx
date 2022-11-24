import React, { useRef, useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

interface IProps {
  file: any;
  currentPage?: number;
}

const Pages: React.FC<{
  total: number;
  width: number;
  currentPage?: number;
}> = ({ total, width, currentPage }) => {
  return (
    <div>
      {Array.from({ length: total }).map((v, i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 16px",
              cursor: "pointer",
            }}
            onClick={() => {
              const el = document.getElementById("pdf_page_" + i);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <div
              style={{
                border:
                  i === currentPage ? "2px solid yellow" : "1px solid gray",
                textAlign: "center",
                width: width / 2 + 4,
              }}
            >
              <Page
                pageNumber={i + 1}
                width={width / 2}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                renderInteractiveForms={false}
              />
            </div>
            <span>{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

const CustomPDF: React.FC<IProps> = ({ file, currentPage }) => {
  let fileUrl = "http://localhost/edocTemp/62fa4bf9e3c88.pdf";
  if (file) {
    fileUrl = "/Temp/" + file;
  }

  const filePath = useRef({
    url: fileUrl,
  });
  const [numPages, setNumPages] = useState<number | null>(null);

  const [width, setWidth] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    const el = document.getElementById("page_right_bar");
    if (el) {
      setWidth(el.clientWidth);
    }
  };

  return (
    <Document file={filePath.current} onLoadSuccess={onDocumentLoadSuccess}>
      <div id="page_right_bar">
        <Pages width={width} total={numPages!} currentPage={currentPage} />
      </div>
    </Document>
  );
};

const PDFRightBar = React.memo(CustomPDF);

export default PDFRightBar;
