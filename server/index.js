import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import ImageKit from "imagekit";
import UserChats from "./models/userChats.js";
import chatModel from "./models/chatModel.js";

const app = express();
dotenv.config();

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

// 1) MIDDLEWARES
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL, // Specify your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials
}));

// 2) ROUTE
app.use("/api/auth", authRouter);

// Uploads images
app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

// Creates a new chat and chat list if one doesn't already exists or adds the new chat to the already existing chat list
app.post("/api/chats", async (req, res) => {
    const { userData, text: initialQuestion, img, aiResponse } = req.body;

    // Initialize imgPath to null
    let imgPath = null;

    // Check if img is provided, then split the path
    if (img) {
        imgPath = img.split("/").pop();
    }

    const userId = userData._id;

    try {

        const newChat = new chatModel({
            userId: userId,
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: initialQuestion,
                        }
                    ],
                    img: imgPath || null,
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: aiResponse, // Save AI response here
                        }
                    ],
                    img: null, // Assuming AI doesn't have an image
                }
            ],
        });

        const savedChat = await newChat.save();

        // Check if the userchats exists
        const userChats = await UserChats.find({
            userId: userId
        });

        // If doesn't exist, create a new one and add the chat in the chats array
        if (!userChats.length) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: initialQuestion.substring(0, 40),
                    },
                ],
            });

            await newUserChats.save();
        } else {
            // If exists, push the chat to the existing array

            await UserChats.updateOne({ userId: userId }, {
                $push: {
                    chats: {
                        _id: savedChat._id,
                        title: initialQuestion.substring(0, 40)
                    }
                }
            });

            //res.status(201).send(newChat._id);
        }

        res.status(201).send(newChat._id);

    } catch (error) {
        console.log(error);
        res.status(500).send(`Error in creating chat: ${error.message}`);
    }
});

// Retrieve list of user chats
app.post("/api/userchats", async (req, res) => {
    const { userData } = req.body;
    const userId = userData._id;

    try {
        const userChats = await UserChats.find({ userId });

        if (!userChats || userChats.length === 0) {
            // If no chats are found, send an empty array
            return res.status(200).send([]);
        }

        res.status(200).send(userChats[0].chats);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching userchats!");
    }
});

// Retrieves chat and chat history
app.post("/api/chats/:id", async (req, res) => {
    const { userData } = req.body; // Now it comes from the request body
    const userId = userData._id;

    try {
        const chat = await chatModel.findOne({ _id: req.params.id, userId });

        res.status(200).send(chat);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching chat!");
    }
});

// Add/Update new input to chats
app.put("/api/chats/:id", async (req, res) => {
    const { userData, question, answer, img } = req.body; // Now it comes from the request body

    const userId = userData._id;

    const newItems1 = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await chatModel.updateOne({ _id: req.params.id, userId }, {
            $push: {
                history: {
                    $each: newItems1,
                }
            }
        });

        res.status(200).send(updatedChat);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding conversation!");
    }
});

// Delete chats
app.delete("/api/chats/:id", async (req, res) => {
    const userId = req.body.userData._id; // Get user ID from the request body
    const chatId = req.params.id;

    try {
        // Remove the chat from the database
        await chatModel.deleteOne({ _id: chatId, userId });
        // Optionally remove the chat from the user's chat list
        await UserChats.updateOne({ userId }, { $pull: { chats: { _id: chatId } } });

        res.status(204).send(); // No content response
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting chat!");
    }
});

// Retrieve user chats
app.get("/api/chats/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find user chats by userId
        const userChats = await UserChats.findOne({ userId });

        // Check if user chats exist
        if (!userChats) {
            return res.status(404).json({ error: "User chats not found" });
        }

        // Extract chat information
        const chats = userChats.chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            createdAt: chat.createdAt,
        }));

        // Example response structure
        const response = {
            userId,
            chats, // Send the actual list of chats for the user
        };

        res.status(200).json(response); // Send a JSON response
    } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3) MONGO DB CONNECTION
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MongoDB URI is undefined");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

connectDB();

// 4) GLOBAL ERROR HANDLER
app.use((err, req, res, next) => { // Correct parameter order
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    console.log(err.message);

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// 5) SERVER
const PORT = process.env.PORT || 3000; // Allow for dynamic port configuration
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

// Optional: Graceful shutdown
const gracefulShutdown = () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);