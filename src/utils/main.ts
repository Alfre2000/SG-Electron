import { faArrowUpRightFromSquare, faFile, faFileCsv, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileVideo, faFileWord, faFolder, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";

export const toCamelCase = <T>(str: T) => {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type RecursiveObject = { [key: string]: any };

export function removeIdRecursively(data: RecursiveObject | RecursiveObject[]): void {
  if (Array.isArray(data)) {
    data.forEach((el) => {
      if (el && typeof el === "object") {
        delete el.id;
        removeIdRecursively(el); // Recurse into nested objects or arrays
      }
    });
  } else if (data && typeof data === "object") {
    delete data.id;
    for (const key in data) {
      if (data[key] && typeof data[key] === "object") {
        removeIdRecursively(data[key]); // Recurse into nested objects or arrays
      }
    }
  }
}

export const toEuro = (value: string | number, decimals: number = 2) => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  return value.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const toFormattedNumber = (value: string | number) => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  return value.toLocaleString("it-IT", { maximumFractionDigits: 4 });
};

export const addSign = (value: string | number) => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  const isPositive = value > 0;
  value = value.toLocaleString("it-IT");
  return isPositive ? `+${value}` : value;
};

export const toTitle = (value: string) => {
  return value.replace(/\b\w/g, (l) => l.toUpperCase());
};

export function findAdjacentDirectories(basePath: string, paths: string[]): Set<string> {
  if (basePath === "") {
    // Extract the first directory from each path
    const topLevelDirectories = paths.map((path) => {
      const firstSlashIndex = path.indexOf("/");
      return firstSlashIndex !== -1 ? path.substring(0, firstSlashIndex) : path;
    });
    // Remove duplicates and return
    return new Set(topLevelDirectories);
  }

  // Normalize base path to remove trailing slash if present
  const normalizedBasePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

  // Function to check if a path is a direct child or sibling of the base path
  const isAdjacent = (path: string) => {
    // Normalize input path
    const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

    // Extract parent directory path
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf("/"));

    // Check if the parent path is the same as the base path
    return parentPath === normalizedBasePath;
  };

  // Extract adjacent directory names
  const adjacentDirectories = paths
    .filter(isAdjacent) // Filter paths that are direct children or siblings
    .map((path) => path.substring(path.lastIndexOf("/") + 1))
  // Remove duplicates
  return new Set(adjacentDirectories);
}


export const fileIcon = (filename: string) => {
  filename = filename.toLowerCase().split("?")[0];  
  if (filename.endsWith(".pdf")) {
    return faFilePdf;
  } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
     return faFileExcel;
  } else if (filename.endsWith(".csv")) {
    return faFileCsv;
  } else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
    return faFileWord;
  } else if (filename.endsWith(".pptx") || filename.endsWith(".ppt")) {
    return faFilePowerpoint;
  } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".gif")) {
    return faFileImage;
  } else if (filename.endsWith(".mp4") || filename.endsWith(".avi") || filename.endsWith(".mov") || filename.endsWith(".mkv")) {
    return faFileVideo;
  } else {
    return faFile;
  }
}