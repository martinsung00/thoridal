import mongoose from "mongoose";

export default new mongoose.Schema({
  job_id: {
    type: String,
    unique: true,
  },
  ticker: String,
  company_name: String,
  reference_number: String,
  unit_price: Number,
  quantity: Number,
  total_cost: Number,
  trade_type: String,
  note: String,
  created_at: Number,
  trade_status: Boolean,
});
