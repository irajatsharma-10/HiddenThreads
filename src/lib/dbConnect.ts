import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


// this async function will return the void promise
export async function dbConnect(): Promise<void> {
    // first check if the database is already connected
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        // console.log("db",db);
        connection.isConnected = db.connections[0].readyState

        console.log("Database connected successfully");

    }catch(error){
        console.log("Database connection failed", error);
        process.exit(1);
    }
}


