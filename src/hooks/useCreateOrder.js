import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";
import { toast } from "react-toastify";

const createOrder = async (orderData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى.");
  }

  const response = await fetch(`${baseUrl}/seller/multi-provider/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message || data.errors
        ? Object.values(data.errors || {}).flat().join(", ")
        : "فشل في إنشاء الطلب";
    throw new Error(errorMessage);
  }

  return data;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // Invalidate order history to refresh the list
      queryClient.invalidateQueries({ queryKey: ["multiProviderOrderHistory"] });
      toast.success(data.message || "تم إنشاء الطلب بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إنشاء الطلب");
    },
  });
};

