export type PaymentMode =
  | "CASH"
  | "UPI"
  | "BANK_TRANSFER"
  | "OTHER";

export type Collection = {
  id: string;

  contributorName: string;
  contributorPhone: string | null;
  contributorAddress: string | null;

  amount: number;

  paymentMode: PaymentMode;

  purpose: string | null;

  year: number;

  contributionDate: string;

  notes: string | null;

  createdAt: string;
  updatedAt: string;

  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};

export type CollectionFormData = {
  contributorName: string;
  contributorPhone: string;
  contributorAddress: string;
  amount: string;
  paymentMode: PaymentMode;
  purpose: string;
  contributionDate: string;
  notes: string;
};
