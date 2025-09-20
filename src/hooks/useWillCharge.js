import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const willCharge = async (transferData) => {
  const payload = {
    product: transferData.product || transferData.type,
    amount: transferData.amount,
    ...(transferData.booster_type && {
      booster_type: transferData.booster_type,
    }),
  };

  const response = await fetch(`${baseUrl}/seller/will-charge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل في جلب تفاصيل التسعير");
  }

  const data = await response.json();
  return data.data;
};

export const useWillCharge = () => {
  return useMutation({
    mutationFn: willCharge,
    retry: false, // Stop retries on API failure
  });
};
