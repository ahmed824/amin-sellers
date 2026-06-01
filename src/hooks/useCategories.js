import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchCategories = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى.");
  }

  const response = await fetch(`${baseUrl}/seller/multi-provider/categories`, {
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
    throw new Error(errorData.message || "فشل في جلب الفئات");
  }

  const data = await response.json();
  return data.success ? data.data || [] : [];
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["multiProviderCategories"],
    queryFn: fetchCategories,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

