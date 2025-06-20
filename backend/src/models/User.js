import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    // ! This is a schema level validation... we have to add the controller level validation too..
    required: [true, "Full name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: 10
  },
  bio: {
    type: String,
    default: "",

  },
  profilePic: {
    type: String,
    default: ""
  },

  nativeLanguage: {
    type: String,
    default: ""
  },
  learningLanguage: {
    type: String,
    default: ""
  },
  isOnBoard: {
    type: Boolean,
    default: false
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, {
  timestamps: true
  //for created At and Updated at fields
})

// TODO: Add a compare method to quickly access and compare it

//pre-hook for hashing password
userSchema.pre("save", async function (next) {
  try {
    //check if the document is modified but not the password
    if (!this.isModified("password")) return next();

    //creating a salt for the hashing of password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
})

userSchema.methods.matchpassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
}

export const User = mongoose.model("User", userSchema);