
import mongoose, { Schema, Document } from 'mongoose';

// Defining IUser interface for internal use
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Define the schema for the user model
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the User model from the schema
const UserModel = mongoose.model<IUser>('User', UserSchema);

// Export the model as default
export default UserModel;
