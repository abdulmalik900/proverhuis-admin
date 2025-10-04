// lib/database/db_connection.js
import mongoose from "mongoose";
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

if (!username || !password) {
    console.error('Username or password not found');
    throw new Error('Username or password not found');
}


const connectionString = `mongodb+srv://${username}:${password}@cluster0.abygxbc.mongodb.net/blogs?retryWrites=true&w=majority&appName=Cluster0`;
const connect = async () => {
    // If already connected, no need to connect again
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(connectionString);
        // Mongoose connection events will handle logging
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw new Error("Database connection error");
    }
};

// Connection event listeners
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (error) => {
    console.error("Mongoose connection error:", error);
});

mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose disconnected from DB");
});

// Graceful shutdown on process termination
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed on app termination");
    process.exit(0);
});

export { connect, connectionString };
export default connect;
