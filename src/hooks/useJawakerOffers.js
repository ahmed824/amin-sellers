import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchJawakerOffers = async (page = 1) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("لم يتم العثور على رمز التوثيق. الرKعيد الدخول مرة أخرى.");
  }

  try {
    const response = await fetch(
      `${baseUrl}/seller/jawaker-offers?page=${page}`,
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
      throw new Error(errorData.message || "فشل في جلب عروض جواكر");
    }

    const data = await response.json();

    // Map API data to rows, keeping ends_at as raw string
    const rows = data.data.map((offer) => ({
      id: offer.id,
      external_offer_id: offer.external_offer_id,
      description: offer.description,
      image: offer.image || null,
      seller_price: offer.seller_price,
      seller_price_money: offer.seller_price_money || null,
      currency: offer.currency || null,
      max_per_user: offer.max_per_user,
      ends_at: offer.ends_at, // Keep raw date string
    }));

    return {
      rows,
      pagination: {
        current_page: data.meta.current_page,
        last_page: data.meta.last_page,
        per_page: data.meta.per_page,
        total: data.meta.total,
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

export const useJawakerOffers = (page = 1) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["jawakerOffers", page],
    queryFn: () => fetchJawakerOffers(page),
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (error.message.includes("رمز التوثيق غير صالح")) {
        navigate("/login");
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error("Jawaker offers fetch error:", error.message);
    },
  });
};
