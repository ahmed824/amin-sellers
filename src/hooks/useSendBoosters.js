import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const sendBoosters = async ({ recipientId, type, amount, note }) => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing or invalid");

  if (!recipientId || !type || !amount || amount <= 0) {
    throw new Error(
      "Invalid input: recipientId, type, and a positive amount are required"
    );
  }

  const response = await fetch(`${baseUrl}/seller/boosters/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipient_id: String(recipientId),
      type,
      amount,
      note: note || "",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send boosters");
  }

  return await response.json();
};

export const useSendBoosters = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendBoosters,
    onSuccess: (data, variables) => {
      console.log("Boosters sent successfully:", data, variables);

      // 🔹 Re-fetch seller profile
      queryClient.invalidateQueries({ queryKey: ["sellerProfile"] });
    },
    onError: (error, variables) => {
      console.error("Send boosters error:", error.message, variables);
    },
    retry: (failureCount, error) => {
      if (failureCount < 3 && error.message.includes("Failed to fetch")) {
        return true;
      }
      return false;
    },
  });
};
