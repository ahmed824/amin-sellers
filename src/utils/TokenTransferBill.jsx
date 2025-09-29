import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register Noto Sans Arabic font locally
Font.register({
  family: "NotoSansArabic",
  src: "/fonts/NotoSansArabic-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    fontFamily: "NotoSansArabic",
    fontSize: 12,
    backgroundColor: "#f8fafc",
    color: "#1f2937",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 12,
  },
  logo: {
    width: "auto",
    height: 60,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    color: "#111827",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 30,
    padding: "4 12",
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  statusDone: {
    backgroundColor: "#059669",
    color: "#ffffff",
  },
  statusFail: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
  },
  section: {
    marginBottom: 12,
    padding: 12,
    border: "1 solid #e5e7eb",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
  },
  value: {
    fontSize: 12,
    fontWeight: 500,
    color: "#059669",
  },
  boosterValueRed: {
    color: "#dc2626",
    fontWeight: 600,
    fontSize: 12,
  },
  boosterValueBlue: {
    color: "#2563eb",
    fontWeight: 600,
    fontSize: 12,
  },
  boosterValueBlack: {
    color: "#111827",
    fontWeight: 600,
    fontSize: 12,
  },
  footer: {
    marginTop: 24,
    borderTop: "1 solid #e5e7eb",
    paddingTop: 12,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
  footerContact: {
    marginTop: 4,
    fontSize: 10,
    color: "#9ca3af",
  },
});

// Translate booster types to English
const translateBoosterType = (booster_type) => {
  if (!booster_type) return "Unspecified";

  const normalized = booster_type.trim();

  const map = {
    red: "Red",
    blue: "Blue",
    black: "Black",
    unspecified: "Unspecified",
    أحمر: "Red",
    أزرق: "Blue",
    أسود: "Black",
    "غير محدد": "Unspecified",
  };

  return map[normalized] || map[normalized.toLowerCase?.()] || "Unspecified";
};

const getBoosterColorStyle = (type) => {
  const colorType = translateBoosterType(type);
  if (colorType === "Red") return styles.boosterValueRed;
  if (colorType === "Blue") return styles.boosterValueBlue;
  if (colorType === "Black") return styles.boosterValueBlack;
  return styles.value;
};

const TokenTransferBill = ({ transfer, isBooster = false }) => {
  const statusStyle =
    transfer.status.toLowerCase() === "done"
      ? styles.statusDone
      : styles.statusFail;
  const statusText =
    transfer.status.toLowerCase() === "done" ? "Completed" : "Fail";

  // Label depending on type
  const amountLabel = isBooster ? "Boosters" : "Tokens";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, statusStyle]}>
          <Text>{statusText}</Text>
        </View>

        {/* Logo + Title */}
        <View style={styles.headerContainer}>
          <Image src="/src/assets/amin1.jpeg" style={styles.logo} />
          <Text style={styles.headerTitle}>
            {isBooster
              ? "Jawaker Booster Transfer Invoice"
              : "Jawaker Token Transfer Invoice"}
          </Text>
        </View>

        {/* Recipient + ID */}
         <View style={styles.section}>
          <Text style={styles.label}>Recipient</Text>
          <Text style={styles.value}>
            {transfer.recipient}
            {transfer.recipient_id ? ` (ID: ${transfer.recipient_id})` : ""}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>
            {Number(transfer.amount).toLocaleString()} {amountLabel}
          </Text>
        </View>

        {/* Booster Type if booster */}
        {isBooster && (
          <View style={styles.section}>
            <Text style={styles.label}>Booster Type</Text>
            <Text style={getBoosterColorStyle(transfer.type)}>
              {translateBoosterType(transfer.type)}
            </Text>
          </View>
        )}

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{transfer.date}</Text>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{transfer.time}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by CardPlay</Text>
          <Text style={styles.footerContact}>info@cardplay.net</Text>
          <Text style={styles.footerContact}>+966 56 239 0002</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TokenTransferBill;
