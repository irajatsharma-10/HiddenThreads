import {dbConnect} from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();


  // localhost:3000/api?username=Ravan?country=india

  try {

    // searchParams will provide you the current url by creating the URL object reqpersenting the full URL from the request.url
    const { searchParams } = new URL(request.url);

    // this will return the query parameter from the current url
    const queryParams = {
      username: searchParams.get('username'),
    };

    // Unlike parse, which throws an exception when validation fails, safeParse provides a structured way to handle errors without needing a try-catch block.
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log("check-username-unique result", result)

    if (!result.success) {

        // these are the errors  we already defined in zod for the username
      const usernameErrors = result.error.format().username?._errors || [];
      console.log("username Error", usernameErrors);
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}