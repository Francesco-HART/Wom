const mongoose = require("mongoose");
const { Schema } = mongoose;

const actionUserSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["create_address", "update_address", "delete_address"],
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  target: { type: Schema.Types.ObjectId, ref: "address" },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String },
});

actionUserSchema.index({ user: 1 });
actionUserSchema.index({ target: 1 });
actionUserSchema.index({ date: 1 });
actionUserSchema.index({ type: 1 });

const ModelClass = mongoose.model("action_address", actionUserSchema);
module.exports = ModelClass;
