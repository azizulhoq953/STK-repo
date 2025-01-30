import { Request, Response, NextFunction } from "express";
import AdminProfileModel from "../../models/adminProfile.model";
import mongoose from "mongoose";

export const AdminProfileController = {
    getProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          console.log("🔍 Debug - Get Profile Request");
          console.log("User from request:", req.user);
          
          if (!req.user) {
            console.log("❌ No user in request");
            res.status(401).json({ message: "User not found in request" });
            return;
          }
    
          // Assuming the user has an ObjectId from JWT payload, not just a string "admin"
          const userId = (req.user as { id: mongoose.Types.ObjectId }).id;
    
          console.log("🔍 Looking for profile with userId:", userId);
    
          // Correct query to use ObjectId
          const profile = await AdminProfileModel.findOne({ userId });
    
          if (!profile) {
            console.log("❌ Profile not found, creating default profile");
            const newProfile = new AdminProfileModel({
              userId,
              name: "Admin",
              address: "Default Address"
            });
            await newProfile.save();
            res.status(200).json({ profile: newProfile });
            return;
          }
    
          res.status(200).json({ profile });
        } catch (error) {
          console.error("❌ Error in getProfile:", error);
          next(error);
        }
      },
      

  updateProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("🔍 Debug - Update Profile Request");
      console.log("Request body:", req.body);
      console.log("User from request:", req.user);

      const userId = (req.user as { id: string }).id;
      const { name, address, image } = req.body;

      console.log("Updating profile for userId:", userId);
      console.log("Update data:", { name, address, image });

      if (!name || !address) {
        console.log("❌ Missing required fields");
        res.status(400).json({ message: "Name and address are required" });
        return;
      }

      let profile = await AdminProfileModel.findOne({ userId });
      console.log("Existing profile:", profile);

      if (!profile) {
        console.log("Creating new profile");
        profile = new AdminProfileModel({
          userId,
          name,
          address,
          ...(image && { image })
        });
      } else {
        console.log("Updating existing profile");
        profile.name = name;
        profile.address = address;
        if (image) profile.image = image;
      }

      await profile.save();
      console.log("✅ Profile saved successfully:", profile);

      res.status(200).json({
        message: "Profile updated successfully",
        profile
      });
    } catch (error) {
      console.error("❌ Error in updateProfile:", error);
      next(error);
    }
  }
};