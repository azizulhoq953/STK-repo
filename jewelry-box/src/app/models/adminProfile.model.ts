import mongoose, { Schema, Document } from "mongoose";
interface IAdminProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  image?: string;
}
const AdminProfileSchema = new Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      unique: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String 
    }
  }, { 
    timestamps: true 
  });

  
  const AdminProfileModel = mongoose.model<IAdminProfile>('AdminProfile', AdminProfileSchema);
export default AdminProfileModel;