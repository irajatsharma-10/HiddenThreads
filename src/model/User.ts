import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}


// MessageSchema follows the Schema of Message
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        unique: true,
        trim: true,
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,"Please use a valid email address"]
    },
    password:{
        type: String,
        required: [true,"Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true,"Verification of code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required: true,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessages:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})


// mongoose.models.User means in mongoose with in already created models fetch model with <User> dtype which we already created as an interface using typescript
// second one is that when the User model is not already created
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel;