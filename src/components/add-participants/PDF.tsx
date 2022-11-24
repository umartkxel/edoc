import React, { useState, useRef } from "react";
import { PDFPageProxy } from "react-pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

interface IProps {
  file: any;
  updatePDFSettings?(x: number, y: number, total: number): void;
  handlePageHeight?(total: number): void;
}
const Pages: React.FC<{
  total: number;
  handlePageHeight?(total: number): void;
  setWidth(width: number): void;
  updatePDFSettings?(x: number, y: number, total: number): void;
  width: number;
}> = ({ total, handlePageHeight, width, setWidth, updatePDFSettings }) => {
  const [height, setHeight] = useState(1);

  const onRenderSuccess = (p: PDFPageProxy) => {
    setWidth(p.originalWidth * 2);
    setHeight(p.originalHeight * 2);
    updatePDFSettings &&
      updatePDFSettings(p.originalWidth * 2, p.originalHeight * 2, total);
  };

  const onLoadSuccess = (p: PDFPageProxy) => {
    if (handlePageHeight) {
      handlePageHeight(total);
    }
  };
  return (
    <div>
      {Array.from({ length: total }).map((v, i) => {
        return (
          <div key={i} id={"pdf_page_" + i} style={{ userSelect: "none" }}>
            <Page
              pageNumber={i + 1}
              width={width}
              height={height}
              renderMode="svg"
              renderAnnotationLayer={false}
              renderTextLayer={false}
              renderInteractiveForms={false}
              onRenderSuccess={onRenderSuccess}
              onLoadSuccess={onLoadSuccess}
            />
          </div>
        );
      })}
    </div>
  );
};

const MemoPages = React.memo(Pages);

const CustomPDF: React.FC<IProps> = ({
  file,
  handlePageHeight,
  updatePDFSettings,
}) => {
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
  };

  return (
    <Document file={filePath.current} onLoadSuccess={onDocumentLoadSuccess}>
      <MemoPages
        width={width}
        total={numPages!}
        handlePageHeight={handlePageHeight}
        setWidth={setWidth}
        updatePDFSettings={updatePDFSettings}
      />
    </Document>
  );
};

const PDF = React.memo(CustomPDF);

export default PDF;
