import IUser from "../../../../Types/User/User";
import mongoose from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class UserMongoDB extends MongoDBEntityTemplate<IUser>  {

    protected collection: mongoose.Model<IUser>;
    protected errorOrigin: string;

    constructor() {

        super();

        const userSchema = new mongoose.Schema<IUser>({
            "id": { "type": String, "required": true },
            "name": { "type": String, "required": false },
            "username": { "type": String, "required": true },
            "description": { "type": String, "required": false },
            "password": { "type": String, "required": true },
            "email": { "type": String, "required": true },
            "created": { "type": String, "required": true },
            "lastOnline": { "type": String, "required": true },
            "configId": { "type": String, "required": false }
        });

        this.errorOrigin = "Error from User Mongoose instance";

        this.collection = this.connection.model<IUser>("user", userSchema, "users");

    };

};

export default UserMongoDB;