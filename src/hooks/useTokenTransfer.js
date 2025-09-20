import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const tokenTransfer = async ({ recipient_id, amount, note }) => {
  if (!recipient_id || !amount || !note) {
    throw new Error("All fields are required: recipient_id, amount, and note");
  }
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const response = await fetch(`${baseUrl}/seller/token-transfers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      recipient_id: String(recipient_id),
      amount: parseInt(amount, 10),
      note,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Token transfer failed");
  }

  return await response.json();
};

export const useTokenTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["tokenTransfer"],
    mutationFn: tokenTransfer,
    onSuccess: (data, variables) => {
      console.log("Token transfer success:", data, variables);

      // 🔹 Re-fetch seller profile
      queryClient.invalidateQueries({ queryKey: ["sellerProfile"] });
    },
    onError: (error) => {
      console.error("Token transfer error:", error.message);
    },
  });
};
