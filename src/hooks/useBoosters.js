import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchBoosters = async ({ page = 1, from, to }) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى."
    );
  }

  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams({ page });
    if (from) queryParams.append("from", from);
    if (to) queryParams.append("to", to);

    const response = await fetch(
      `${baseUrl}/seller/boosters?${queryParams.toString()}`,
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
      throw new Error(errorData.message || "فشل في جلب سجل المسرعات");
    }

    const data = await response.json();

    // Map API data to rows
    const rows = data.data.history.data.map((booster) => ({
      id: booster.id,
      recipient: booster?.recipient_name || booster?.recipient_id,
      amount: booster.amount,
      type:
        booster.booster_type === "red"
          ? "أحمر"
          : booster.booster_type === "blue"
          ? "أزرق"
          : booster.booster_type === "black"
          ? "أسود"
          : "غير محدد",
      status: booster.status === "done" ? "Done" : "Failed",
      date: new Date(booster.created_at).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: new Date(booster.created_at).toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return {
      balances: data.data.balances || { red: 0, blue: 0, black: 0 },
      rows,
      pagination: {
        current_page: data.data.history.current_page,
        last_page: data.data.history.last_page,
        next_page_url: data.data.history.next_page_url,
        prev_page_url: data.data.history.prev_page_url,
        total: data.data.history.total,
        per_page: data.data.history.per_page,
      },
    };
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "خطأ في الاتصال بالخادم. الرجاء التحقق من الاتصال بالإنترنت أو تكوين CORS."
      );
    }
    throw error;
  }
};

export const useBoosters = ({ page = 1, from, to }) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["boosters", page, from, to],
    queryFn: () => fetchBoosters({ page, from, to }),
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (error.message.includes("رمز التوثيق غير صالح")) {
        navigate("/login");
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error("Boosters fetch error:", error.message);
    },
  });
};
