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
  status: {
    type: String,
    required: true,
    enum: ["toDo", "inProgress", "valid", "neverValid", "refuse"],
    default: "user",
  },
  contribution: { type: String, required: true, trim: true },
  date_start: { type: Date, default: Date.now },
  //Date.now + 1
  date_end: { type: Date },
});

CouponSchema.pre("save", function save(next) {
  let coupon = this;
  coupon.status = "toDo";
  next();
});
const ModelClass = mongoose.model("coupon", CouponSchema);
module.exports = ModelClass;
