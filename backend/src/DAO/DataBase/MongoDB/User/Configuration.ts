import IUserConfiguration from "../../../../Types/User/Configuration";
import mongoose from "mongoose";
import type {  Model } from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class ConfigurationModel extends MongoDBEntityTemplate<IUserConfiguration> {

    protected collection: Model<IUserConfiguration>;
    protected errorOrigin: string;

    constructor() {

        super();

        const schema = new mongoose.Schema<IUserConfiguration>({
            "id": { "type": String, "required": true },
            "online": {
                "type": String,
                "enum": ["everyone", "lastOnline"],
                "required": true
            },
            "writing": { "type": Boolean, "required": true },
            "lastOnline": {
                "type": String,
                "enum": ["everyone", "contact", "none"],
                "required": true
            },
            "read": { "type": Boolean, "required": true },
            "approve": {
                "type": String,
                "enum": ["contact", "group", "both", "none"],
                "required": true
            },
            "notify": { "type": Boolean, "required": true },
            "push": { "type": Boolean, "required": true },
            "email": { "type": Boolean, "required": true }
        });

        this.errorOrigin = "Error from Configuration Mongoose instance";

        this.collection = this.connection.model<IUserConfiguration>("configuration", schema, "configurations");

    };

};

export default ConfigurationModel;