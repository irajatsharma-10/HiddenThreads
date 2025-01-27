import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ messageid: string; }> } 
) {
  const { params } = context;
  const { messageid } = await params; 

  // Ensure `messageid` is provided
  if (!messageid) {
    return NextResponse.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new ObjectId(session.user._id);
    const messageId = new ObjectId(messageid);

    const updatedResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message Deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}