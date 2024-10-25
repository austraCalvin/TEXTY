import mongoose from "mongoose";
import type {  Model } from "mongoose";
import IUserReceivesMessage from "../../../../Types/Message/UserReceivesMessage";
import { MongoDBEntityTemplate } from "../Model";

class UserReceivesMessageMongoDB extends MongoDBEntityTemplate<IUserReceivesMessage>  {

    protected collection: Model<IUserReceivesMessage>;
    protected errorOrigin: string;

    constructor() {

        super();

        const sendSchema = new mongoose.Schema<IUserReceivesMessage>({
            "id": { "type": String, "required": true },
            "userId": { "type": String, "required": true },
            // "messageId": { "type": String, "required": true },
            // "senderId": { "type": String, "required": true },
            "sendId": { "type": String, "required": true },
            "date": { "type": String, "required": false },
            "readDate": { "type": String, "required": false },
            "chatType": { "type": String, "required": true },
            "chatId": { "type": String, "required": true },
            "replyType": { "type": String, "required": false },
            "replyId": { "type": String, "required": false }
        });

        this.errorOrigin = "Error from UserReceivesMessage Mongoose instance";

        this.collection = this.connection.model<IUserReceivesMessage>("user_receives_message", sendSchema, "user_receives_messages");

    };

};

export default UserReceivesMessageMongoDB;