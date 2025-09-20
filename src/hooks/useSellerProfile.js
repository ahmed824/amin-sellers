import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const fetchSellerProfile = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى."
    );
  }

  try {
    const response = await fetch(`${baseUrl}/seller/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error("رمز التوثيق غير صالح. الرجاء تسجيل الدخول مرة أخرى.");
      }
      throw new Error(errorData.message || "فشل في جلب بيانات الملف الشخصي");
    }

    const data = await response.json();

    return {
      id: data.data.id,
      name: data.data.name,
      image: data.data.image || "/images/default-avatar.png",
      wallet: {
        balance: data.data.wallet?.balance || 0,
        currency: data.data.wallet?.currency || "USD"
      },
      pricing: {
        currency: data.data.pricing?.currency || "USD",
        jawaker_offers: data.data.pricing?.jawaker_offers || [],
        group_pricing: data.data.pricing?.group_pricing || null
      }
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

export const useSellerProfile = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["sellerProfile"],
    queryFn: fetchSellerProfile,
    retry: (failureCount, error) => {
      if (error.message.includes("رمز التوثيق غير صالح")) {
        navigate("/login");
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error("Seller profile fetch error:", error.message);
    },
  });
};
