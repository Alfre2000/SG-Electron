import { apiGet } from "./api";

export const defaultQueryFn = async ({ queryKey }) => {
  console.log(queryKey);
  if (!queryKey[0]) return null;
  const url = new URL(queryKey[0]);
  queryKey.slice(1).forEach((element) => {
    if (element && typeof element === "object") {
      Object.entries(element).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
  });
  // console.log(queryKey, url.toString());
  console.log(url.toString());
  const data = await apiGet(url.toString());
  return data;
};
