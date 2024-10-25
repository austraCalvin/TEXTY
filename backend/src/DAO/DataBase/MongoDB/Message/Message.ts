import mongoose from "mongoose";
import type {  Model } from "mongoose";
import IMessage from "../../../../Types/Message/Message";
import { MongoDBEntityTemplate } from "../Model";

class MessageMongoDB extends MongoDBEntityTemplate<IMessage>  {

    protected collection: Model<IMessage>;
    protected errorOrigin: string;

    constructor() {

        super()

        const messageSchema = new mongoose.Schema<IMessage>({
            "id": { type: String, required: true },
            "body": { type: String, required: false, },
            "fileId": { type: String, required: false }
        });

        this.errorOrigin = "Error from Message Mongoose instance";

        this.collection = this.connection.model<IMessage>("message", messageSchema, "messages");

    };

};

export default MessageMongoDB;