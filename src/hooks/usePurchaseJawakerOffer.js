import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import { getAuthToken } from "../utils/token";

const purchaseJawakerOffer = async ({ recipient_id, external_offer_id }) => {
  const token = getAuthToken();
  if (!token)
    throw new Error(
      "لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى."
    );

  // ✅ force strings
  const payload = {
    recipient_id: String(recipient_id),
    external_offer_id: String(external_offer_id),
  };

  const response = await fetch(`${baseUrl}/seller/jawaker-offers/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error("رمز التوثيق غير صالح. الرجاء تسجيل الدخول مرة أخرى.");
    }
    throw new Error(errorData.message || "فشل في شراء عرض جواكر");
  }

  return await response.json();
};

export const usePurchaseJawakerOffer = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: purchaseJawakerOffer,
    onError: (error) => {
      if (error.message.includes("رمز التوثيق غير صالح")) {
        navigate("/login");
      }
      console.error("Jawaker offer purchase error:", error.message);
    },
  });
};
