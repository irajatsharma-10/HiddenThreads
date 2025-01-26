import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  
  // Get session and user
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  // Log the session and user data for debugging
  console.log('Session:', session);
  console.log('User:', _user);

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    // Check if user exists and has messages (simplified query)
    const user = await UserModel.findById(userId).exec();
    console.log("User Found:", user);

    if (!user || !Array.isArray(user.messages) || user.messages.length === 0) {
      // No messages found, let's return a default message or handle the case.
      return Response.json(
        { 
          message: 'No messages found. Would you like to send a message?', 
          success: true,
          sendNewMessage: true // Indicates to the client to send a new message
        },
        { status: 200 }
      );
    }

    // Aggregation query to retrieve messages
    const aggregatedUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();
    
    console.log("Aggregated User:", aggregatedUser);

    if (!aggregatedUser || aggregatedUser.length === 0) {
      return Response.json(
        { message: 'No messages found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: aggregatedUser[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
