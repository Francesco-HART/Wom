const mongoose = require("mongoose");
const { Schema } = mongoose;

const CouponSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  address: { type: Schema.Types.ObjectId, required: true, ref: "address" },
  gratuity: {
    type: String,
    required: true,
    trim: true,
  },
  contribution: { type: String, required: true, trim: true },
  start: { type: Date, default: Date.now },
  //Date.now + 1
  end: { type: Date },
});

const ModelClass = mongoose.model("coupon", CouponSchema);
module.exports = ModelClass;
