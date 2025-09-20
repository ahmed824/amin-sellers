import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchBoostersBalanceHistory = async (
  page = 1,
  fromDate = null,
  toDate = null
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى."
    );
  }

  const params = new URLSearchParams({ page });
  if (fromDate) params.append("from", fromDate);
  if (toDate) params.append("to", toDate);

  try {
    const response = await fetch(
      `${baseUrl}/seller/boosters/balance-history?${params.toString()}`,
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
      throw new Error(errorData.message || "فشل في جلب سجل رصيد المسرعات");
    }

    const data = await response.json();

    const rows = data.data.data.map((booster) => ({
      id: booster.id,
      recipient_username: booster.seller_id
        ? `Seller ${booster.seller_id}`
        : booster.admin_id
        ? `Admin ${booster.admin_id}`
        : "غير متاح",
      booster_type: booster.booster_type,
      amount: booster.amount,
      balance_before: booster.balance_before,
      balance_after: booster.balance_after,
      created_at: booster.created_at,
      // Add a separate time field for easier access in the DataGrid
      time: booster.created_at,
      note: booster.note || "لا توجد ملاحظات",
    }));

    return {
      rows,
      pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        total: data.data.total,
        per_page: data.data.per_page,
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

export const useBoostersBalanceHistory = (
  page = 1,
  fromDate = null,
  toDate = null
) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["boostersBalanceHistory", page, fromDate, toDate],
    queryFn: () => fetchBoostersBalanceHistory(page, fromDate, toDate),
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (error.message.includes("رمز التوثيق غير صالح")) {
        navigate("/login");
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error("Boosters balance history fetch error:", error.message);
    },
  });
};
