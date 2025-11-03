import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const sendBoosters = async (payload) => {
  const { recipient_id, recipient_public_id, recipientId, type, amount } = payload || {};
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing or invalid");

  const hasRecipient = Boolean(recipient_public_id || recipient_id || recipientId);
  if (!hasRecipient || !type || !amount || amount <= 0) {
    throw new Error(
      "Invalid input: recipient (id or public_id), type, and positive amount are required"
    );
  }

  const response = await fetch(`${baseUrl}/seller/boosters/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...(recipient_public_id
        ? { recipient_public_id: String(recipient_public_id) }
        : { recipient_id: String(recipient_id || recipientId) }),
      type,
      amount
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
