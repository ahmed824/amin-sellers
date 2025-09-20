import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../baseUrl';
import { getAuthToken } from '../utils/token';

const getPlayerProfile = async (id) => {
  if (!id) return null;
  const response = await fetch(`${baseUrl}/seller/get-player-profile?id=${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'فشل في جلب ملف اللاعب');
  }

  const data = await response.json();
   return data.success ? data.profile || null : null;
};

export const useGetPlayerProfile = (id, enabled = true) => {
  return useQuery({
    queryKey: ['getPlayerProfile', id],
    queryFn: () => getPlayerProfile(id),
    enabled: !!id && enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};