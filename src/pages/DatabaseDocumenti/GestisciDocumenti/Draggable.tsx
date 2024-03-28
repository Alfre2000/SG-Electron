import { Progress } from "@components/shadcn/Progress";
import { cn } from "@lib/utils";
import { useUploadFiles } from "@pages/DatabaseDocumenti/GestisciDocumenti/upload";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { URLS } from "urls";

type DraggableProps = {
  children: React.ReactNode;
  path: string;
  className?: string;
};

function Draggable({ children, className, path }: DraggableProps) {
  const queryClient = useQueryClient();
  const [active, setActive] = useState(false);

  const { uploadFiles, uploadProgress, totalFiles, uploadedFiles, reset } = useUploadFiles(path);

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    let items = e.dataTransfer.items;
    uploadFiles(items, "").finally(() => {
      queryClient.invalidateQueries(URLS.DOCUMENTI);
      setActive(false);
      reset();
    });
  };
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
      onDrop={(e) => {
        handleDrop(e);
        preventDefaults(e);
      }}
      onDragOver={(e) => {
        setActive(true);
        preventDefaults(e);
      }}
      className={cn(``, className)}
    >
      {active && (
        <div className="w-screen h-screen z-50 bg-gray-600/30 fixed top-0 left-0 flex justify-center items-center">
          {totalFiles === 1 && (
            <div className="w-72 ml-60 text-center">
              <p className="text-sm mb-2.5 font-semibold">Caricamento file</p>
              <Progress value={uploadProgress} className="h-3 w-full" />
              <span className="text-sm">{uploadProgress}%</span>
            </div>
          )}
          {totalFiles > 1 && (
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
