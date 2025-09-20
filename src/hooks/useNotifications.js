import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

// Shared error handler
const handleApiError = async (response) => {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || "خطأ في الاتصال بالخادم");
};

// Shared headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

const fetchNotifications = async (page = 1) => {
  const response = await fetch(`${baseUrl}/seller/notifications?page=${page}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw handleApiError(response);
  }

  const data = await response.json();

  // Map API data to DataGrid rows
  const rows = data.data.data.map((notification) => ({
    id: notification.id,
    title: notification.title || "بدون عنوان",
    note: notification.message?.replace("\n", "") || "بدون ملاحظات",
    date: notification.created_at
      ? new Date(notification.created_at).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "غير محدد",
    time: notification.created_at
      ? new Date(notification.created_at).toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "غير محدد",
    read: notification.is_read === 1 || notification.read_at ? true : false,
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

const fetchUnreadCount = async () => {
  const response = await fetch(`${baseUrl}/seller/notifications/unread`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw handleApiError(response);
  }

  const data = await response.json();
  return (
    data.data.filter((notification) => notification.is_read === 0).length || 0
  );
};

const markNotificationAsRead = async ({ id }) => {
  const response = await fetch(
    `${baseUrl}/seller/notifications/${id}/mark-as-read`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    throw handleApiError(response);
  }

  return response.json();
};

const markAllNotificationsAsRead = async () => {
  // Fetch unread notifications (limit to avoid over-fetching)
  const response = await fetch(
    `${baseUrl}/seller/notifications?per_page=1000`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw handleApiError(response);
  }

  const data = await response.json();
  const unreadIds = data.data.data
    .filter((notification) => notification.is_read === 0)
    .map((notification) => notification.id);

  if (unreadIds.length === 0) {
    return []; // Nothing to mark
  }

  // Parallel POSTs for unread IDs only (optimized to skip read ones)
  const markPromises = unreadIds.map((id) =>
    fetch(`${baseUrl}/seller/notifications/${id}/mark-as-read`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({}),
    }).then((res) => {
      if (!res.ok) {
        throw handleApiError(res);
      }
      return res.json();
    })
  );

  const results = await Promise.allSettled(markPromises);
  const errors = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason.message);

  if (errors.length > 0) {
    throw new Error(`فشل في تعليم بعض الإشعارات كمقروءة: ${errors.join(", ")}`);
  }

  return results;
};

export const useNotifications = (page = 1) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => fetchNotifications(page),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes: Reduce refetches
    retry: false, // Stop retries on API failure
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: fetchUnreadCount,
    refetchInterval: 30 * 1000, // Refetch every 30s for live count
    retry: false, // Stop retries on API failure
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
