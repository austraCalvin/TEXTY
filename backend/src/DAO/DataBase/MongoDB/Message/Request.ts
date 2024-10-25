import mongoose from "mongoose";
import type {  Model } from "mongoose";
import { MongoDBEntityTemplate } from "../Model";
import { IMessageRequest } from "../../../../Types/Message/Request";

class MessageRequestMongoDB extends MongoDBEntityTemplate<IMessageRequest>  {

    protected collection: Model<IMessageRequest>;
    protected errorOrigin: string;

    constructor() {

        super()

        const messageRequestSchema = new mongoose.Schema<IMessageRequest>({
            "id": { type: String, required: true },
            "userId": { type: String, required: true },
            "messageId": { type: String, required: true },
            "contactId": { type: String, required: true }
        });

        this.errorOrigin = "Error from MessageRequest Mongoose instance";

        this.collection = this.connection.model<IMessageRequest>("message_request", messageRequestSchema, "message_requests");

    };

};

export default MessageRequestMongoDB;