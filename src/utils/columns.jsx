import DelayedPDFShare from "./DelayedPDFShare";
import TokenTransferBill from "./TokenTransferBill";

// Function to generate token columns with sellerName
export const getTokenColumns = (sellerName) => [
  {
    field: "recipient",
    headerName: "المستلم",
    flex: 2,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "amount",
    headerName: "الكمية",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span style={{ color: "#00e676", fontWeight: 700 }}>
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "time",
    headerName: "الوقت",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "date",
    headerName: "التاريخ",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "share",
    headerName: "مشاركة",
    flex: 1,
    headerAlign: "center",
    align: "center",
    headerClassName: "transparent-header",
    renderCell: (params) => (
      <DelayedPDFShare
        document={
          <TokenTransferBill transfer={params.row} sellerName={sellerName} />
        }
        fileName={`token_transfer_${params.row.id}.pdf`}
      />
    ),
  },
];

// Function to generate booster columns with sellerName
export const getBoosterColumns = (sellerName) => [
  {
    field: "recipient",
    headerName: "المستلم",
    flex: 2,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "amount",
    headerName: "الكمية",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span style={{ color: "#00e676", fontWeight: 700 }}>
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "type",
    headerName: "النوع",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "time",
    headerName: "الوقت",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "date",
    headerName: "التاريخ",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "share",
    headerName: "مشاركة",
    flex: 1,
    headerAlign: "center",
    align: "center",
    headerClassName: "transparent-header",
    renderCell: (params) => (
      <DelayedPDFShare
        document={
          <TokenTransferBill
            isBooster={true}
            transfer={params.row}
            sellerName={sellerName}
          />
        }
        fileName={`booster_transfer_${params.row.id}.pdf`}
      />
    ),
  },
];

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

    const rows =
      data.data?.map((entry) => ({
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

// Updated tokenBalanceColumns with enhanced styling and proper date/time handling
export const tokenBalanceColumns = [
  {
    field: "recipient_username",
    headerName: "المستلم",
    flex: 1.5,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          color: params.value === "غير متاح" ? "#999" : "#4fc3f7",
          fontWeight: params.value === "غير متاح" ? 400 : 600,
          fontSize: "0.9rem",
          fontStyle: params.value === "غير متاح" ? "italic" : "normal",
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "الكمية",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          color: params.value < 0 ? "#ff1744" : "#00e676",
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        {params.value > 0 ? "+" : ""}
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "type",
    headerName: "النوع",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const typeMap = {
        transfer: "تحويل",
        adjustment: "تعديل",
        deposit: "إيداع",
        withdrawal: "سحب",
        refund: "استرداد",
        bonus: "مكافأة",
        penalty: "غرامة",
        unknown: "غير معروف",
      };
      const colorMap = {
        transfer: "#2196f3",
        adjustment: "#ff9800",
        deposit: "#4caf50",
        withdrawal: "#f44336",
        refund: "#9c27b0",
        bonus: "#00e676",
        penalty: "#ff1744",
        unknown: "#999",
      };
      const arabicType = typeMap[params.value] || params.value || "غير معروف";
      return (
        <span
          style={{
            color: colorMap[params.value] || "#fff",
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: "16px",
            backgroundColor: `${colorMap[params.value] || "#555"}20`,
            border: `1px solid ${colorMap[params.value] || "#555"}`,
            fontSize: "0.875rem",
          }}
        >
          {arabicType}
        </span>
      );
    },
  },
  {
    field: "balance_before",
    headerName: "الرصيد قبل",
    flex: 1.3,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          fontWeight: 600,
          color: "#ccc",
          fontSize: "0.95rem",
        }}
      >
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "balance_after",
    headerName: "الرصيد بعد",
    flex: 1.3,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          fontWeight: 700,
          color: "#4caf50",
          fontSize: "1rem",
        }}
      >
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "created_at",
    headerName: "التاريخ",
    flex: 1.2,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      if (!params.value || isNaN(new Date(params.value))) {
        return (
          <span style={{ color: "#999", fontStyle: "italic" }}>غير متاح</span>
        );
      }
      const date = new Date(params.value);
      const formattedDate = date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return (
        <span
          style={{
            color: "#90caf9",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {formattedDate}
        </span>
      );
    },
  },
  {
    field: "time",
    headerName: "الوقت",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      if (!params.value || isNaN(new Date(params.value))) {
        return (
          <span style={{ color: "#999", fontStyle: "italic" }}>غير متاح</span>
        );
      }
      const date = new Date(params.value);
      const formattedTime = date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return (
        <span
          style={{
            color: "#ffb74d",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {formattedTime}
        </span>
      );
    },
  },
  {
    field: "note",
    headerName: "ملاحظات",
    flex: 2.5,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          color: params.value ? "#fff" : "#999",
          fontStyle: params.value ? "normal" : "italic",
          fontSize: "0.9rem",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
        }}
        title={params.value || "لا توجد ملاحظات"}
      >
        {params.value || "لا توجد ملاحظات"}
      </span>
    ),
  },
];

export const boosterBalanceColumns = [
  {
    field: "recipient_username",
    headerName: "اسم المستلم",
    flex: 1.5,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          color: "#4fc3f7",
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "booster_type",
    headerName: "نوع المسرع",
    flex: 1.5,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const typeMap = {
        red: "أحمر",
        blue: "أزرق",
        black: "أسود",
        green: "أخضر",
        yellow: "أصفر",
        purple: "بنفسجي",
        orange: "برتقالي",
      };
      const colorMap = {
        red: "#f44336",
        blue: "#2196f3",
        black: "#424242",
        green: "#4caf50",
        yellow: "#ff9800",
        purple: "#9c27b0",
        orange: "#ff5722",
      };
      const arabicType = typeMap[params.value] || params.value || "غير معروف";
      return (
        <span
          style={{
            color: colorMap[params.value] || "#fff",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "16px",
            backgroundColor: `${colorMap[params.value] || "#555"}20`,
            border: `1px solid ${colorMap[params.value] || "#555"}`,
            fontSize: "0.875rem",
          }}
        >
          {arabicType}
        </span>
      );
    },
  },
  {
    field: "amount",
    headerName: "الكمية",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          color: params.value < 0 ? "#ff1744" : "#00e676",
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        {params.value > 0 ? "+" : ""}
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "balance_before",
    headerName: "الرصيد قبل",
    flex: 1.3,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          fontWeight: 600,
          color: "#ccc",
          fontSize: "0.95rem",
        }}
      >
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "balance_after",
    headerName: "الرصيد بعد",
    flex: 1.3,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          fontWeight: 700,
          color: "#4caf50",
          fontSize: "1rem",
        }}
      >
        {Number(params.value).toLocaleString()}
      </span>
    ),
  },
  {
    field: "created_at",
    headerName: "التاريخ",
    flex: 1.5,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      if (!params.value || isNaN(new Date(params.value))) {
        return (
          <span style={{ color: "#999", fontStyle: "italic" }}>غير متاح</span>
        );
      }
      const date = new Date(params.value);
      const formattedDate = date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return (
        <span
          style={{
            color: "#90caf9",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {formattedDate}
        </span>
      );
    },
  },
  {
    field: "time",
    headerName: "الوقت",
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      if (!params.value || isNaN(new Date(params.value))) {
        return (
          <span style={{ color: "#999", fontStyle: "italic" }}>غير متاح</span>
        );
      }
      const date = new Date(params.value);
      const formattedTime = date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      });
      return (
        <span
          style={{
            color: "#ffb74d",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {formattedTime}
        </span>
      );
    },
  },
  {
    field: "note",
    headerName: "ملاحظات",
    flex: 2.5,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <span
        style={{
          color:
            params.value && params.value !== "لا توجد ملاحظات"
              ? "#fff"
              : "#999",
          fontStyle:
            params.value && params.value !== "لا توجد ملاحظات"
              ? "normal"
              : "italic",
          fontSize: "0.9rem",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
        }}
        title={params.value} // Show full text on hover
      >
        {params.value || "لا توجد ملاحظات"}
      </span>
    ),
  },
];
