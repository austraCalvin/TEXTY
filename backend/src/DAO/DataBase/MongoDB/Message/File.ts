import mongoose from "mongoose";
import type { Model } from "mongoose";
import { IFileData } from "../../../../Types/Message/File";
import { MongoDBEntityTemplate } from "../Model";

class FileModel extends MongoDBEntityTemplate<IFileData> {

    protected collection: Model<IFileData>;
    protected errorOrigin: string;

    constructor() {

        super();

        const messageSchema = new mongoose.Schema<IFileData>({
            "id": { "type": String, "required": true },
            "name": { "type": String, "required": true },
            "type": { "type": String, "required": true },
            "ext": { "type": String, "required": true },
            "size": { "type": Number, "required": true },
        });

        this.errorOrigin = "Error from File Mongoose instance";

        this.collection = this.connection.model<IFileData>("file", messageSchema, "files");

    };

};

export default FileModel;