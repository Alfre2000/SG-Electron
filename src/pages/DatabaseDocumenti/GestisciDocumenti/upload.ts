import { apiPost } from "@api/apiV2";
import { useState } from "react";
import { toast } from "sonner";
import { URLS } from "urls";
import { capitalize } from "utils";

const gatherData = (file: File, relativePath: string, path: string) => {
  let formData = new FormData();
  formData.append("file", file);
  relativePath = relativePath.split("/").slice(0, -1).join("/");
  let finalPath = path === "" ? relativePath : path + "/" + relativePath;
  finalPath = finalPath.endsWith("/") ? finalPath.slice(0, -1) : finalPath;
  formData.append("path", finalPath);
  const nome = capitalize(file.name.replaceAll("_", " ").split(".").slice(0, -1).join("."));
  formData.append("nome", nome);
  return formData;
};

const countFiles = (items: DataTransferItemList): Promise<number> => {
  const itemList: DataTransferItem[] = Array.from(items);
  let fileCount = 0;
  let pendingDirectoryReads = 0;
  let resolvePromise: (count: number) => void;
  const promise = new Promise<number>((resolve) => {
    resolvePromise = resolve;
  });

  const traverseDirectory = (entry: FileSystemDirectoryEntry) => {
    pendingDirectoryReads++;
    const reader = entry.createReader();
    reader.readEntries((entries) => {
      entries.forEach((entry) => {
        if (entry.isFile && !entry.name.startsWith(".")) {
          fileCount++;
        } else if (entry.isDirectory) {
          traverseDirectory(entry as FileSystemDirectoryEntry);
        }
      });

      pendingDirectoryReads--;
      if (pendingDirectoryReads === 0) {
        resolvePromise(fileCount);
      }
    });
  };

  Array.from(itemList).forEach((item) => {
    if (item.kind === "file") {
      const entry = item.webkitGetAsEntry();
      if (entry?.isFile) {
        fileCount++;
      } else if (entry?.isDirectory) {
        traverseDirectory(entry as FileSystemDirectoryEntry);
      }
    }
  });

  if (pendingDirectoryReads === 0) {
    setTimeout(() => resolvePromise(fileCount), 0);
  }
  return promise;
};

export const useUploadFiles = (path: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);

  const progressSingleFile = (progressEvent: ProgressEvent) => {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadProgress(progress);
  };

  const processFile = async (file: File, relativePath: string, totalFiles: number) => {
    const formData = gatherData(file, relativePath, path);
    console.log("Caricamento file: ", formData.get("path"));
    await apiPost(URLS.DOCUMENTI, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: totalFiles === 1 ? progressSingleFile : () => {},
    })
      .then(() => {
        console.log(uploadedFiles, totalFiles);
        
        if (totalFiles > 1) {
          setUploadedFiles((prev) => prev + 1);
        }
        if (totalFiles === 1) {
          toast.success("Documento caricato");
        } else if (uploadedFiles === totalFiles - 1) {
          toast.success("Documenti caricati");
        }
      })
      .catch(() => {
        if (totalFiles > 1) {
          setUploadedFiles((prev) => prev + 1);
        }
        toast.error("Errore file: " + file.name);
      });
  };
  const reset = () => {
    setUploadProgress(0);
    setTotalFiles(0);
    setUploadedFiles(0);
  };
  const processDirectory = async (
    directoryEntry: FileSystemDirectoryEntry,
    relativePath: string,
    totalFiles: number
  ) => {
    const reader = directoryEntry.createReader();

    // Read all entries within the directory recursively
    const readEntries = async (): Promise<FileSystemEntry[]> => {
      return new Promise((resolve, reject) => {
        reader.readEntries((entries) => {
          if (!entries.length) {
            resolve([]);
          } else {
            readEntries()
              .then((moreEntries) => {
                resolve(entries.concat(moreEntries));
              })
              .catch(reject);
          }
        }, reject);
      });
    };

    const entries = await readEntries();

    for (const entry of entries) {
      if (entry.isFile) {
        if (entry.name.startsWith(".")) {
          continue;
        }
        await new Promise((resolve, reject) => {
          (entry as FileSystemFileEntry).file(async (file) => {
            try {
              let basePath = relativePath.endsWith("/") ? relativePath.slice(0, -1) : relativePath;
              await processFile(file, `${basePath}/${directoryEntry.name}`, totalFiles);
              resolve(null);
            } catch (error) {
              reject(error);
            }
          });
        });
      } else if (entry.isDirectory) {
        let basePath = relativePath.endsWith("/") ? relativePath.slice(0, -1) : relativePath;
        await processDirectory(
          entry as FileSystemDirectoryEntry,
          `${basePath}/${entry.name}`,
          totalFiles
        );
      }
    }
  };

  const uploadFiles = async (items: DataTransferItemList, relativePath: string) => {
    const entries = Array.from(items)
      .map((item) => item.webkitGetAsEntry())
      .filter((entry) => entry != null);
    const nFiles = await countFiles(items);
    setTotalFiles(nFiles);
    console.log("Numero di file da caricare: ", nFiles);
    for (const entry of entries) {
      if (entry?.isFile) {
        await new Promise((resolve, reject) => {
          (entry as FileSystemFileEntry).file(async (file) => {
            try {
              await processFile(file, relativePath, nFiles);
              resolve(null);
            } catch (error) {
              reject(error);
            }
          });
        });
      } else if (entry?.isDirectory) {
        console.log("Caricamento directory: ", entry.name);
        await processDirectory(entry as FileSystemDirectoryEntry, entry.name + '/' + relativePath, nFiles);
      }
    }
  };
  return { uploadFiles, uploadProgress, totalFiles, uploadedFiles, reset };
};
