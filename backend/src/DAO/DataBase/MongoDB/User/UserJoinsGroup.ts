import IUserJoinsGroup from "../../../../Types/User/UserJoinsGroup";
import mongoose from "mongoose";
import type { Model } from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class UserJoinsGroupModel extends MongoDBEntityTemplate<IUserJoinsGroup>  {

    protected collection: Model<IUserJoinsGroup>;
    protected errorOrigin: string;

    constructor() {

        super();

        const userSchema = new mongoose.Schema<IUserJoinsGroup>({
            "id": { "type": String, "required": true },
            "userId": { "type": String, "required": true },
            "groupId": { "type": String, "required": true },
            "notify": { "type": Boolean, "required": true },
            "read": { "type": Boolean, "required": true },
            "blocked": { "type": Boolean, "required": true },
            "admin": { "type": Boolean, "required": true },
            "date": { "type": String, "required": true }
        });

        this.errorOrigin = "Error from UserJoinsGroup Mongoose instance";

        this.collection = this.connection.model<IUserJoinsGroup>("user_joins_group", userSchema, "user_joins_groups");

    };

};

export default UserJoinsGroupModel;