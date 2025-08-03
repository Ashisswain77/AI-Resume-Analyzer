// app/lib/pdf2img.ts

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
  if (typeof window === "undefined") {
    return {
      imageUrl: "",
      file: null,
      error: "This function must run in a browser environment.",
    };
  }

  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
    const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.entry");

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context!, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imageFile = new File([blob], `${file.name.replace(/\.pdf$/, "")}.png`, {
            type: "image/png",
          });

          resolve({
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
          });
        } else {
          resolve({
            imageUrl: "",
            file: null,
            error: "Failed to create image blob",
          });
        }
      }, "image/png");
    });
  } catch (error: any) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${error.message || error}`,
    };
  }
}
