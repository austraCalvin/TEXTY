import IRegistration from "../../../../Types/Temp/Registration";
import mongoose from "mongoose";
import { MongoDBEntityTemplate } from "../Model";

class RegistrationModel extends MongoDBEntityTemplate<IRegistration> {

    protected collection: mongoose.Model<IRegistration>;
    protected errorOrigin: string;

    constructor() {

        super();

        const schema = new mongoose.Schema<IRegistration>({
            "id": { "type": String, "required": true },
            "email": { "type": String, "required": true },
            "ttl": { "type": Date, "required": true },
            "code": { "type": Number, "required": true }
        });

        this.errorOrigin = "Error from Registration Mongoose instance";

        this.collection = this.connection.model<IRegistration>("registration", schema, "registrations");

    };

};

export default RegistrationModel;