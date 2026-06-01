import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchOrderHistory = async (params = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى.");
  }

  const queryParams = new URLSearchParams();
  if (params.status) queryParams.append("status", params.status);
  if (params.from_date) queryParams.append("from_date", params.from_date);
  if (params.to_date) queryParams.append("to_date", params.to_date);
  if (params.page) queryParams.append("page", params.page);
  if (params.per_page) queryParams.append("per_page", params.per_page);

  const url = `${baseUrl}/seller/multi-provider/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error("رمز التوثيق غير صالح. الرجاء تسجيل الدخول مرة أخرى.");
    }
    throw new Error(errorData.message || "فشل في جلب سجل الطلبات");
  }

  const data = await response.json();
  return data.success ? data.data : { data: [], current_page: 1, last_page: 1, total: 0, per_page: 20 };
};

export const useOrderHistory = (params = {}, enabled = true) => {
  return useQuery({
    queryKey: ["multiProviderOrderHistory", params],
    queryFn: () => fetchOrderHistory(params),
    enabled,
    retry: 2,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};

