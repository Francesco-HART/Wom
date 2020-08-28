const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt-nodejs");

const AddressSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
    },
    //gratuity {name : 'limite'}
    gratuity: Array(String),
    email: {
      type: String,
      lowercase: true,
      //unique: true,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    validation_code: { type: String, select: false },
    //parent_id: {type: Schema.Types.ObjectId, required: true, ref: 'user'}
  },
  { minimize: false } // in order to accept empty objects
);

AddressSchema.pre("save", function (next) {
  // get access to the user model
  const user = this;
  // hash the password
  bcrypt.hash(user.validation_code, 10, function (err, hash) {
    // return next here if NODE_ENV = test
    if (process.env.NODE_ENV === "test") return next();
    // set the hashed user validationCode
    user.validation_code = hash;
    next();
  });
});

AddressSchema.methods.compareValidationCode = function compareValidationCode(
  candidateValidationCode,
  cb
) {
  bcrypt.compare(
    candidateValidationCode,
    this.validation_code,
    (err, isMatch) => {
      cb(err, isMatch);
    }
  );
};

const ModelClass = mongoose.model("address", AddressSchema);
module.exports = ModelClass;
