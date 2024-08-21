import IRecovery from "../../../../Types/Temp/Recovery";
import mongoose from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class RecoveryMongoDB extends MongoDBEntityTemplate<IRecovery> {

    protected collection: mongoose.Model<IRecovery>;
    protected errorOrigin: string;

    constructor() {

        super();

        const schema = new mongoose.Schema<IRecovery>({
            "id": { "type": String, "required": true },
            "userEmail": { "type": String, "required": true },
            "type": { "type": String, "enum": ["email", "username", "password"], "required": true },
            "ttl": { "type": Date, "required": true },
            "code": { "type": Number, "required": true }
        });

        this.errorOrigin = "Error from Recovery Mongoose instance";

        this.collection = this.connection.model<IRecovery>("recovery", schema, "recoveries");

    };

};

export default RecoveryMongoDB;