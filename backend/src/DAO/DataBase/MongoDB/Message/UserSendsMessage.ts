import mongoose from "mongoose";
import type { Model } from "mongoose";
import IUserSendsMessage from "../../../../Types/Message/UserSendsMessage";
import { MongoDBEntityTemplate } from "../Model";

class UserSendsMessageModel extends MongoDBEntityTemplate<IUserSendsMessage> {

    protected collection: Model<IUserSendsMessage>;
    protected errorOrigin: string;

    constructor() {

        super();

        const sendSchema = new mongoose.Schema<IUserSendsMessage>({
            "id": { "type": String, "required": true },
            "userId": { "type": String, "required": true },
            "messageId": { "type": String, "required": true },
            "date": { "type": String, "required": true },
            "chatType": { "type": String, "required": true },
            "chatId": { "type": String, "required": true },
            "deliveredDate": { "type": String, "required": false },
            "readDate": { "type": String, "required": false },
            "replyType": { "type": String, "required": false },
            "replyId": { "type": String, "required": false }
        });

        this.errorOrigin = "Error from UserSendsMessage Mongoose instance";

        this.collection = this.connection.model<IUserSendsMessage>("user_sends_message", sendSchema, "user_sends_messages");

    };

    // async getOne(model: Partial<IUserSendsMessage> & { "$max"?: string }) {

    //     if (!this.online) {

    //         return Promise.reject(`${this.errorOrigin} - offline`);

    //     };

    //     let alternative: any;

    //     if (model["$max"]) {

    //         const foundElement = await this.collection.aggregate([{ $group: { "_id": "lastCreated", "created": { "$max": "$created" } } }]).catch((err) => { });

    //         if (foundElement === undefined) {

    //             return Promise.reject(`${this.errorOrigin} at method getOne - rejected`);

    //         };

    //         alternative = foundElement[0];

    //     };

    //     const foundElement = await this.collection.findOne(alternative ? alternative.created : model).lean().catch((err) => { });

    //     if (foundElement === undefined) {

    //         return Promise.reject(`${this.errorOrigin} at method getOne - rejected`);

    //     };

    //     if (foundElement === null) {

    //         return Promise.resolve(null);

    //     };


    //     return Promise.resolve(foundElement as IUserSendsMessage);

    // }

};

export default UserSendsMessageModel;