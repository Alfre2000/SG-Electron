import { apiGet } from "./api";

export const defaultQueryFn = async ({ queryKey }) => {
  const url = new URL(queryKey[0]);
  if (queryKey[1] && typeof queryKey[1] === "object") {
    Object.entries(queryKey[1]).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }
  console.log(url.toString());
  const data = await apiGet(url.toString());
  return data;
};
