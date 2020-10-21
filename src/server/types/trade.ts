export type Trade = {
  id: string;
  ticker: string;
  company_name: string;
  reference_number: string;
  unit_price: number;
  quantity: number;
  total_cost: number;
  trade_type: "long" | "short";
  note: string;
  created_at: string;
  trade_status: boolean;
};
