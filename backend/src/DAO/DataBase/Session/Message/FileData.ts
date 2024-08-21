import {  IFileData } from "../../../../Types/Message/File";
import { SessionEntityTemplate } from "../Model";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log("dirname:", __dirname);
// console.log("filename:", __filename);

class FileModel extends SessionEntityTemplate<IFileData> {

    protected elements: IFileData[];
    protected readonly errorOrigin: string;

    constructor() {
        
        super();

        this.elements = [];

        this.errorOrigin = "Error from File Session instance";

    };

};

export default FileModel;