import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchOrderDetails = async (orderId) => {
  if (!orderId) return null;

  const token = getAuthToken();
  if (!token) {
    throw new Error("لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى.");
  }

  const response = await fetch(
    `${baseUrl}/seller/multi-provider/orders/${orderId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error("رمز التوثيق غير صالح. الرجاء تسجيل الدخول مرة أخرى.");
    }
    if (response.status === 404) {
      throw new Error("الطلب غير موجود.");
    }
    throw new Error(errorData.message || "فشل في جلب تفاصيل الطلب");
  }

  const data = await response.json();
  return data.success ? data.data : null;
};

export const useOrderDetails = (orderId, enabled = true) => {
  return useQuery({
    queryKey: ["multiProviderOrderDetails", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId && enabled,
    retry: 2,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};

