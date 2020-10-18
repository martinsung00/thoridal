const MongoDBGateway = require('./plugin');
const mongoose = require('mongoose');
const tradeSchema = require('./schema');

const url = 'mongodb://localhost:1125/thoridal_primary_db';

mongoose.connect(url, { useMongoClient: true });

const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

const Trade = mongoose.model('Trade', tradeSchema);

const save = (trade) => {
  return new Promise((resolve, reject) => {
    const newTrade = {
      job_id: trade.job_id,
      ticker: trade.ticker,
      company_name: trade.company_name,
      reference_number: trade.reference_number,
      unit_price: trade.unit_price,
      quantity: trade.quantity,
      total_cost: trade.total_cost,
      trade_type: trade.trade_type,
      note: trade.note,
      created_at: trade.created_at,
      trade_status: trade.trade_status,
    };

    Trade.update({ job_number: trade.job_id }, newTrade, { upsert: true, setDefaultOnInsert: true }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  });
}

const delete = (id) => {
  return new Promise((resolve, reject) => {
    Trade.remove({ job_id: id }, { justOne: true }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const convertToNumber = (createdAt) => {
  return new Date(createdAt).getTime();
};

module.exports.save = save;
module.exports.Trade = Trade;
// export default MongoDBGateway;

module.exports = {
  save: save,
  Trade: Trade,
  delete: delete,
  MongoDBGateway: MongoDBGateway,
};
