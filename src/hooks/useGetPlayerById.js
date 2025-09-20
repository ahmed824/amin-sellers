import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../baseUrl';
import { getAuthToken } from '../utils/token';

const getPlayerById = async (id) => {
  if (!id) return null;
  const response = await fetch(`${baseUrl}/seller/get-player-by-public-id?id=${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'فشل في جلب بيانات اللاعب');
  }

  const data = await response.json();
  // Handle response with { success: true, player: {...} } or direct player object
  return data.success ? data.player : data;
};

export const useGetPlayerById = (id) => {
  return useQuery({
    queryKey: ['getPlayerById', id],
    queryFn: () => getPlayerById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};