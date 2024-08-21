import IUserContactsUser from "../../../../Types/User/UserContactsUser";
import mongoose from "mongoose";
import type { Model } from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class UserContactsUserModel extends MongoDBEntityTemplate<IUserContactsUser>  {

    protected collection: Model<IUserContactsUser>;
    protected errorOrigin: string;

    constructor() {

        super();

        const userSchema = new mongoose.Schema<IUserContactsUser>({
            "id": { "type": String, "required": true },
            "userId": { "type": String, "required": true },
            "contactId": { "type": String, "required": true },
            "name": { "type": String, "required": true },
            "notify": { "type": Boolean, "required": true },
            "read": { "type": Boolean, "required": true },
            "blocked": { "type": Boolean, "required": true },
            "date": { "type": String, "required": true }
        });

        this.errorOrigin = "Error from UserContactsUser Mongoose instance";

        this.collection = this.connection.model<IUserContactsUser>("user_contacts_user", userSchema, "user_contacts_users");

    };

};

export default UserContactsUserModel;