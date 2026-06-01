import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchProducts = async (categoryId) => {
  if (!categoryId) return [];

  const token = getAuthToken();
  if (!token) {
    throw new Error("لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى.");
  }

  const response = await fetch(
    `${baseUrl}/seller/multi-provider/products?category_id=${categoryId}`,
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
    throw new Error(errorData.message || "فشل في جلب المنتجات");
  }

  const data = await response.json();
  return data.success ? data.data || [] : [];
};

export const useProducts = (categoryId, enabled = true) => {
  return useQuery({
    queryKey: ["multiProviderProducts", categoryId],
    queryFn: () => fetchProducts(categoryId),
    enabled: !!categoryId && enabled,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

