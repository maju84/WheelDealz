import { SearchQueryParams } from "@/types";

export const constructQueryString = (params: SearchQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, value.toString());
    }
  });

  return searchParams.toString();
};
