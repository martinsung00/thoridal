exports.up = pgm => {
  pgm.createTable("trades", {
    id: {
      primaryKey: true,
      notNull: true,
      type: "varchar(25)",
      unique: true,
    },
    ticker: {
      type: "varchar(10)",
    },
    company_name: {
      type: "varchar(25)",
    },
    reference_number: {
      type: "varchar(25)",
    },
    unit_price: {
      type: "integer",
    },
    quantity: {
      type: "integer",
    },
    total_cost: {
      type: "integer",
    },
    trade_type: {
      type: "varchar(25)",
    },
    note: {
      type: "varchar(250)",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
    trade_status: {
      type: "boolean",
    },
  });
};

exports.down = pgm => {
  pgm.dropTable("trades");
};
