import type {
  CollectionFormData,
  PaymentMode,
} from "./collection.types";

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

export function createEmptyCollectionForm(): CollectionFormData {
  return {
    contributorName: "",
    contributorPhone: "",
    contributorAddress: "",
    amount: "",
    paymentMode: "CASH",
    purpose: "Ganeshotsav Contribution",
    contributionDate: getToday(),
    notes: "",
  };
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getPaymentLabel(
  paymentMode: PaymentMode
) {
  switch (paymentMode) {
    case "CASH":
      return "Cash";

    case "UPI":
      return "UPI";

    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "OTHER":
      return "Other";

    default:
      return paymentMode;
  }
}

export function getYearOptions() {
  const currentYear = getCurrentYear();

  return Array.from(
    { length: 6 },
    (_, index) => currentYear - index
  );
}
