import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Define User Schema
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/.+\@.+\..+/, 'Please provide a valid email address'], 
        trim: true 
    },
    phoneNumber: { 
        type: Number, 
        required: true, 
        validate: { 
            validator: function(v) { 
                return /\d{10}/.test(v); 
            }, 
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    telegramId: { 
        type: String, 
        required: false 
    },
    googleSignIn: { 
        type: Boolean, 
        required: true, 
        default: false 
    }
}, 
{ timestamps: true });

// Prevent OverwriteModelError by checking if the model is already compiled
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Export the model as default
export default User;
