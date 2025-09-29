import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchTokenTransfers = async ({ page = 1, from, to, on, q }) => {
  // Build query string from parameters
  const queryParams = new URLSearchParams({ page });
  if (from) queryParams.append("from", from);
  if (to) queryParams.append("to", to);
  if (on) queryParams.append("on", on);
  if (q) queryParams.append("q", q);

  const response = await fetch(
    `${baseUrl}/seller/token-transfers?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "فشل في جلب سجل التحويلات");
  }

  const data = await response.json();

  // Map API data to DataGrid rows
  const rows = data.data.data.map((transfer) => ({
    id: transfer.id,
    recipient_id: transfer.recipient_id,
    recipient: transfer.recipient_name || transfer.recipient_id,
    amount: transfer.amount,
    type: transfer.type === "normal" ? "توكن" : transfer.type,
    status: transfer.status === "done" ? "Done" : "Failed",
    date: new Date(transfer.created_at).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: new Date(transfer.created_at).toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return {
    rows,
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      next_page_url: data.data.next_page_url,
      prev_page_url: data.data.prev_page_url,
      total: data.data.total,
      per_page: data.data.per_page,
    },
  };
};

export const useTokenTransfers = ({ page = 1, from, to, on, q }) => {
  return useQuery({
    queryKey: ["tokenTransfers", page, from, to, on, q],
    queryFn: () =>
      fetchTokenTransfers({
        page,
        from,
        to,
        on,
        q,
      }),
    keepPreviousData: true, // Keep previous data while fetching new page
    onError: (error) => {
      console.error("Token transfers fetch error:", error.message);
    },
  });
};
