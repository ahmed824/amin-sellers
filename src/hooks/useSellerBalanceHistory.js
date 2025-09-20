// Updated useSellerBalanceHistory hook
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchSellerBalanceHistory = async (page = 1) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى."
    );
  }

  const params = new URLSearchParams({ page });

  try {
    const response = await fetch(
      `${baseUrl}/seller/balance-history?${params.toString()}`,
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
      throw new Error(errorData.message || "فشل في جلب سجل رصيد التوكن");
    }

    const data = await response.json();
    console.log("🔹 API Response (Raw):", data);

    // Extract recipient username from note
    const extractRecipientUsername = (note) => {
      if (!note) return "غير متاح";
      
      // For Arabic notes: "تحويل توكن للاعب #username"
      if (note.includes("تحويل توكن للاعب #")) {
        return note.split("#")[1]?.trim() || "غير معروف";
      }
      
      // For English notes: "Token transfer to recipient: username"
      if (note.includes("Token transfer to recipient:")) {
        return note.split("recipient: ")[1]?.trim() || "غير معروف";
      }
      
      return "غير متاح";
    };

    const rows = data.data?.map((entry) => ({
      id: entry.id,
      type: entry.type || "unknown",
      amount: entry.amount || 0,
      balance_before: entry.balance_before || 0,
      balance_after: entry.balance_after || 0,
      note: entry.note || "",
      created_at: entry.created_at,
      time: entry.created_at, // Add separate time field for DataGrid
      recipient_username: extractRecipientUsername(entry.note),
    })) || [];

    // Since the API doesn't provide pagination info, create basic pagination
    return {
      rows,
      pagination: {
        current_page: 1,
        last_page: 1,
        total: rows.length,
        per_page: rows.length,
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

export const useSellerBalanceHistory = (page = 1) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["sellerBalanceHistory", page],
    queryFn: () => fetchSellerBalanceHistory(page),
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (error.message.includes("رمز التوثيق غير صالح")) {
        navigate("/login");
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error("خطأ في جلب سجل رصيد التوكن:", error.message);
    },
  });
};
