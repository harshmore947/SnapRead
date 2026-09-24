import { Inngest } from "inngest";

type DocumentUploaded = {
  data: {
    documentId: string;
    fileUrl: string;
  };
};

type Events = {
  "document/uploaded": DocumentUploaded;
};

export const inngest = new Inngest({
  id: "snap-read",
});
