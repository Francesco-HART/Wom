const mongoose = require("mongoose");
const { Schema } = mongoose;
const AddressModel = require("./address");
const CouponModel = require("./coupon");

const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    login: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    insta: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
    },
    list_address: [
      {
        expiration: { type: Date },
        address: { type: AddressModel.schema },
      },
    ],
    coupon: { type: Schema.Types.ObjectId, ref: "coupon" },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["user", "admin", "address"],
      default: "user",
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    preferences: { type: Schema.Types.Mixed },
  },
  { minimize: false } // in order to accept empty objects
);

UserSchema.pre("save", function save(next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const ModelClass = mongoose.model("user", UserSchema);
module.exports = ModelClass;
