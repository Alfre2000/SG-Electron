import React, { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { URLS } from "urls";
import { useUploadFiles } from "@pages/DatabaseDocumenti/GestisciDocumenti/upload";
import { Progress } from "@components/shadcn/Progress";
import { cn } from "@lib/utils";

type DraggableProps = {
  children: React.ReactNode;
  path: string;
  className?: string;
};

function Draggable({ children, className, path }: DraggableProps) {
  const queryClient = useQueryClient();
  const [active, setActive] = useState(false);

  const { uploadFiles, uploadProgress, totalFiles, uploadedFiles, reset } = useUploadFiles(path);

  const preventDefaults = (e: React.DragEvent | ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    preventDefaults(e);
    let items = e.dataTransfer.items;
    await handleUpload(items);
  };

  const handleUpload = React.useCallback(
    async (items: DataTransferItemList) => {
      setActive(true);
      uploadFiles(items, "").finally(() => {
        queryClient.invalidateQueries(URLS.DOCUMENTI);
        setActive(false);
        reset();
      });
    },
    [queryClient, reset, uploadFiles]
  );

  const handlePaste = React.useCallback(
    async (e: any) => {
      preventDefaults(e);
      let items = e.clipboardData?.items;
      if (!items) return;
      await handleUpload(items);
    },
    [handleUpload]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return (
    <div
      onDragEnter={(e) => {
        setActive(true);
        preventDefaults(e);
      }}
      onDragLeave={(e) => {
        setActive(false);
        preventDefaults(e);
      }}
      onDrop={handleDrop}
      onDragOver={(e) => {
        setActive(true);
        preventDefaults(e);
      }}
      className={cn(``, className)}
    >
      {active && (
        <div className="w-screen h-screen z-50 bg-gray-600/30 fixed top-0 left-0 flex justify-center items-center">
          {totalFiles === 1 ? (
            <div className="w-72 ml-60 text-center">
              <p className="text-sm mb-2.5 font-semibold">Caricamento file</p>
              <Progress value={uploadProgress} className="h-3 w-full" />
              <span className="text-sm">{uploadProgress}%</span>
            </div>
          ) : (
            <div className="w-72 ml-60 text-center">
              <p className="text-sm mb-2.5 font-semibold">Caricamento cartella</p>
              <Progress value={(uploadedFiles / totalFiles) * 100} className="h-3 w-full" />
              <span className="text-sm">
                {uploadedFiles} files caricati su {totalFiles}
              </span>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default Draggable;
