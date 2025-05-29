'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UploadDropzone } from "../ui/upload-dropzone";
import { TicketAttachmentProps, useTicketAttachments } from "./hooks/use-ticket-attachments";
import { Button } from "../ui/button";
import { File, X } from "lucide-react";
import { deleteAttachment, uploadAttachment } from "@/services/ticket-service";

export function TicketAttachments({ ticket }: { ticket: any }) {
  const { attachments, isLoading, onDeleteAttachment, refetch } = useTicketAttachments(ticket.id);
  const [uploadingFiles, setUploadingFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUploadFiles() {
    setIsUploading(true);

    for (const file of uploadingFiles) {
      await handleUploadFile(file)
    }

    setUploadingFiles(null);
    setIsUploading(false);
    refetch();
  }

  async function handleUploadFile(file: File) {
    try {
      await uploadAttachment(ticket.id, file);
    } catch (error) {
      console.log(error, `erro ao salvar: `, file.name);
    }
  }

  useEffect(() => {
    if (isUploading || !uploadingFiles) return;
    handleUploadFiles();
  }, [uploadingFiles])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anexos</CardTitle>
        <CardDescription>Veja os documentos anexados à esse chamado</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p>Carregando anexos...</p>
        ) : (
          <section className="flex gap-2 w-full flex-wrap mb-4">
            {attachments?.data?.length > 0 ? (
              attachments.data.map(attachment => (
                <TicketAttachment
                  attachment={attachment}
                  key={attachment.id}
                  onDeleteAttachment={onDeleteAttachment}
                />
              ))
            ) : (
              <p>Nenhum arquivo anexado.</p>
            )}
          </section>
        )}


        <UploadDropzone
          onFilesSelected={(files) => {
            if (isUploading) return;
            setUploadingFiles(files);
          }}
          isLoading={isUploading}
        />
      </CardContent>

    </Card>
  );
}

type TicketAttachmentItemProps = {
  attachment: TicketAttachmentProps;
  onDeleteAttachment: (attachmentId: number | string) => void;
};


function TicketAttachment({
  attachment,
  onDeleteAttachment
}: TicketAttachmentItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onRemove() {
    if (isLoading) return
    setIsLoading(true);

    try {
      await deleteAttachment(attachment.id);
      onDeleteAttachment(attachment.id)
    } catch (e) {
      console.log(e, 'erro ao remover anexo!');
    }

    setIsLoading(false)
  }

  return (
    <div className="relative border p-2 rounded-lg bg-muted/50 flex items-center gap-4 w-full max-w-[220px]">
      <a href={attachment.url} target="_blank" rel="noreferer noopener" className="p-2 flex gap-4 w-full">
        <File className="w-4 h-4" />

        <div className="flex-1 w-full">
          <p className="text-xs font-medium line-clamp-1">{attachment.fileName}</p>
        </div>
      </a>

      <Button
        variant="outline"
        className="border-red-300 hover:bg-red-50"
        size="icon"
        onClick={onRemove}
        disabled={isLoading}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}