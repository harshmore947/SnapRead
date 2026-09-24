import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fectAndExtractionPdfText(fileUrl: string) {

  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  const loader = new PDFLoader(new Blob([arrayBuffer]));
  const docs = await loader.load();

  //combine all pages
  return docs.map((doc,index)=>{
    const pageNum = doc.metadata?.loc?.pageNumber ?? index + 1;
    return `<!-- PAGE_BREAK: ${pageNum} -->\n${doc.pageContent}`;
  }).join('\n')
}
