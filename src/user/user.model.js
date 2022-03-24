// External Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { boolean } = require('joi');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      max: 30,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePhoto: {
      hasPhoto: {
        type: Boolean,
        default: false
      },
      url: String,
      filename: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

//Remove refreshToken from the response
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.email;
    delete ret.__v;
    delete ret.profilePhoto.filename;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.isAdmin;
    return ret;
  }
});

// Get public profile
userSchema.methods.getPrivateProfile = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (providedPassword) {
  const isMatch = await bcrypt.compare(providedPassword, this.password);
  return isMatch;
};

// User Model
const User = mongoose.model('User', userSchema);

// Export User Model
module.exports = User;
