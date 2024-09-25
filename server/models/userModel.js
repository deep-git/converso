import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (v) => /\S+@\S+\.\S+/.test(v),
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guest'],
        default: "user",
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt

const User = mongoose.model("User", userSchema);
export default User;