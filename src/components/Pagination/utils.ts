import { PaginationData } from "./Paginator";

export const getCurrentPage = (data: PaginationData | undefined) => {
  if (!data) return 1;
  return data?.next
    ? parseInt(data.next.split("page=")[data.next.split("page=").length - 1].split("&")[0]) - 1
    : data?.previous?.includes("page=")
    ? parseInt(data.previous.split("page=")[data.previous.split("page=").length - 1].split("&")[0]) + 1
    : data?.results?.length === data?.count
    ? 1
    : 2;
};

export const getTotalPages = (data: PaginationData | undefined) => {
  if (!data) return 1;
  if (data.next !== null) {
    return Math.ceil(data.count / data.results.length);
  } else {
    return getCurrentPage(data);
  }
};
