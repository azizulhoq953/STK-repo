"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProfileController = void 0;
const adminProfile_model_1 = __importDefault(require("../../models/adminProfile.model"));
exports.AdminProfileController = {
    getProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("🔍 Debug - Get Profile Request");
            console.log("User from request:", req.user);
            if (!req.user) {
                console.log("❌ No user in request");
                res.status(401).json({ message: "User not found in request" });
                return;
            }
            // Assuming the user has an ObjectId from JWT payload, not just a string "admin"
            const userId = req.user.id;
            console.log("🔍 Looking for profile with userId:", userId);
            // Correct query to use ObjectId
            const profile = yield adminProfile_model_1.default.findOne({ userId });
            if (!profile) {
                console.log("❌ Profile not found, creating default profile");
                const newProfile = new adminProfile_model_1.default({
                    userId,
                    name: "Admin",
                    address: "Default Address"
                });
                yield newProfile.save();
                res.status(200).json({ profile: newProfile });
                return;
            }
            res.status(200).json({ profile });
        }
        catch (error) {
            console.error("❌ Error in getProfile:", error);
            next(error);
        }
    }),
    updateProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("🔍 Debug - Update Profile Request");
            console.log("Request body:", req.body);
            console.log("User from request:", req.user);
            const userId = req.user.id;
            const { name, address, image } = req.body;
            console.log("Updating profile for userId:", userId);
            console.log("Update data:", { name, address, image });
            if (!name || !address) {
                console.log("❌ Missing required fields");
                res.status(400).json({ message: "Name and address are required" });
                return;
            }
            let profile = yield adminProfile_model_1.default.findOne({ userId });
            console.log("Existing profile:", profile);
            if (!profile) {
                console.log("Creating new profile");
                profile = new adminProfile_model_1.default(Object.assign({ userId,
                    name,
                    address }, (image && { image })));
            }
            else {
                console.log("Updating existing profile");
                profile.name = name;
                profile.address = address;
                if (image)
                    profile.image = image;
            }
            yield profile.save();
            console.log("✅ Profile saved successfully:", profile);
            res.status(200).json({
                message: "Profile updated successfully",
                profile
            });
        }
        catch (error) {
            console.error("❌ Error in updateProfile:", error);
            next(error);
        }
    })
};
