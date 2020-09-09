const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const AddressSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
    },
    //gratuity {name : 'limite'}
    gratuities: [
      {
        available: { type: Boolean, default: true, require: true },
        remaining_capacity: { type: Number, default: 3, require: true },
        capacity: { type: Number, default: 3, require: true },
        name: { type: String, require: true },
        image: { type: String },
      },
    ],
    email: {
      type: String,
      lowercase: true,
      //unique: true,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    validation_code: { type: String, select: false },
    image: { type: String },
    //parent_id: {type: Schema.Types.ObjectId, required: true, ref: 'user'}
  },
  { minimize: false } // in order to accept empty objects
);

AddressSchema.pre("save", function save(next) {
  // get access to the user model
  let address = this;

  // hash the password
  if (!address.isModified("validation_code")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(address.validation_code, 10, async (err, hash) => {
      if (err) {
        return next(err);
      }
      try {
        const gratuities = await address.gratuities.map((gratuity) => {
          gratuity.remaining_capacity = gratuity.capacity;
          return gratuity;
        });
        address.validation_code = hash;
        address.gratuities = gratuities;
        console.log(address);
        next();
      } catch (err) {
        return next(err);
      }
      // set the hashed user validationCode
    });
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
