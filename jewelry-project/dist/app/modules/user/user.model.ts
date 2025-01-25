// import bcrypt from 'bcryptjs';
// import mongoose, { Schema, Document } from 'mongoose';

// interface IUser extends Document {
//   username: string;
//   password: string;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
//   matchPassword(password: string): Promise<boolean>;  // method to compare passwords
// }

// const UserSchema: Schema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Pre-save middleware to hash password
// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();  // Only hash the password if it was modified
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare entered password with stored hashed password
// UserSchema.methods.matchPassword = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };

// const User = mongoose.model<IUser>('User', UserSchema);

// export default User;

// userInfo.model.ts 

import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document, Types } from 'mongoose';

// Use the ObjectId type explicitly in IUser
export interface IUser extends Document {
  _id: Types.ObjectId;  // Explicitly define _id type
  username: string;
  password: string;
  email: string;
  role?: string;  // Optional field
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Pre-save middleware to hash the password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password matching method
UserSchema.methods.matchPassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
