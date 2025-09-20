import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const searchPlayers = async (name) => {
  if (!name || name.length < 2) return [];
  const response = await fetch(
    `${baseUrl}/seller/search-players?name=${encodeURIComponent(name)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "فشل في البحث عن اللاعبين");
  }

  const data = await response.json();
  return data.success ? data.players || [] : [];
};

export const useSearchPlayers = (name) => {
  return useQuery({
    queryKey: ["searchPlayers", name],
    queryFn: () => searchPlayers(name),
    enabled: !!name && name.length >= 2,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    placeholderData: [], // Ensure initial data is an empty array
  });
};
