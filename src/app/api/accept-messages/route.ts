import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; // session requires the auth option
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";


// When you install and use next-auth, it provides built-in types like User, Session, JWT, etc., to ensure type safety in TypeScript projects.
// you can extend these field to custom inputs
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()

    // to get the currently logged in user
    // this server session requires the authOptions
    const session = await getServerSession(authOptions)
    // already injected the user in the session
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not Authenticated' },
            { status: 401 }
        )
    }

    const userId = user._id

    // front end will sent the request whether to accept the message or not
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }

}


export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        console.log("Error in getting message acceptance status",error)
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        },{status: 500})
    }
}