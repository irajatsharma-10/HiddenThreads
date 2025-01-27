import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // session requires the auth option
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";  // Import NextRequest and NextResponse

// DELETE function with correct typing
export async function DELETE(req: NextRequest, { params }: { params: { messageid: string } }) {
    const { messageid } = params; // Extract messageid from params
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated",
            },
            { status: 401 }
        );
    }

    const user: User = session?.user as User;

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message Deleted",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in deleting message", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error deleting message",
            },
            { status: 500 }
        );
    }
}
