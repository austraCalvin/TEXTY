import IGroup from "../../../../Types/User/Group";
import mongoose from "mongoose";
import type { Model } from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class GroupModel extends MongoDBEntityTemplate<IGroup>  {

    protected collection: Model<IGroup>;
    protected errorOrigin: string;

    constructor() {

        super();

        const modelSchema = new mongoose.Schema<IGroup>({
            "id": { "type": String, "required": true },
            "description": { "type": String, "required": true },
            "name": { "type": String, "required": true },
            "configurable": { "type": Boolean, "required": true },
            "messages": { "type": Boolean, "required": true },
            "joinable": { "type": Boolean, "required": true },
            "approve": { "type": Boolean, "required": true }
        });

        this.errorOrigin = "Error from Group Mongoose instance";

        this.collection = this.connection.model<IGroup>("group", modelSchema, "groups");

    };

};

export default GroupModel;