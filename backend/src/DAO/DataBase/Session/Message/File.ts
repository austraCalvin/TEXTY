import path from "path";
import { IDAOMethods } from "../../../../Types/IDAOMethods";
import IFile, { IPartialFile } from "../../../../Types/Message/File";
import fs from "fs";
import DataBase, { SessionStorageDB } from "../../Config";
import { SessionEntityTemplate } from "../Model";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log("dirname:", __dirname);
// console.log("filename:", __filename);

class FileModel extends SessionEntityTemplate<IFile> {

    protected elements: any[];
    private files: fs.PathLike[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.files = fs.readdirSync(path.resolve("../upload"));
        this.errorOrigin = "Error from File Session instance";

    };

    async getMany(model: IPartialFile, limit: number): Promise<IFile[]>;
    async getMany(model: IPartialFile): Promise<IFile[]>;
    async getMany(): Promise<IFile[]>;

    async getMany(model?: IPartialFile, limit?: number) {

        return Promise.reject();

    };

    async getOne(model: IPartialFile) {

        const db = await DataBase.isOnline().catch((err) => { });

        if (!db) {

            return Promise.reject();

        };

        const foundElement = await db.collection("files").getOne(model).catch((err) => { });

        if (!foundElement) {

            return Promise.resolve(null);

        };

        const localPromise: Promise<IFile> = new Promise((success, danger) => {

            fs.readFile(path.resolve(`../upload/${foundElement.id}.${foundElement.ext}`), (err, data) => {

                if (err) {

                    return danger(`${this.errorOrigin} - not found`);

                };

                success({ ...foundElement, "content": data });

            });

        });


        return localPromise;

    };

    async postMany(models: IFile[]) {

        return Promise.reject();

    };

    async postOne(model: IFile) {

        const db = await DataBase.isOnline().catch((err) => { });

        if (!db) {

            return Promise.reject();

        };

        console.log("model:", model);

        console.log("dir path:", path.resolve())
        console.log("specialz path:", path.resolve(`../upload/${model.id}.${model.ext}`));

        const localPromise: Promise<IFile> = new Promise((success, danger) => {

            fs.writeFile(path.resolve(`../upload/${model.id}.${model.ext}`), model.content, async (err1) => {

                if (err1) {

                    console.log("WHY jeje:", err1);

                    return danger(`${this.errorOrigin} - not inserted`);

                };

                fs.readdir(path.resolve("../upload"), (err2, files) => {

                    if (err2) {

                        return danger(`${this.errorOrigin} - could not read the directory`);

                    };

                    console.log("file directory:", files);
                    this.files = files;

                });

                const postedElement = await db.collection("files").postOne(model).catch((err) => { });

                if (!postedElement) {

                    return Promise.reject(`${this.errorOrigin} at method postOne - not inserted`);

                };

                success({ ...postedElement, "content": fs.readFileSync(path.resolve(`../upload/${model.id}.${model.ext}`)) });

            });

        });

        return localPromise;

    };

    async patchMany(model: Partial<IFile>[], update: Partial<IFile>) {

        return Promise.reject();

    };

    async patchOne(model: IPartialFile, update: IPartialFile) {

        return Promise.reject();

    };

    async deleteOne(id: IFile["id"]) {

        const db = await DataBase.isOnline().catch((err) => { });

        if (!db) {

            return Promise.reject();

        };

        const foundElement = await db.collection("files").getOne({ id }).catch((err) => { });

        if (!foundElement) {

            return Promise.reject();

        };

        const localPromise: Promise<boolean> = new Promise((success, danger) => {

            fs.unlink(path.resolve(`./src/upload/${foundElement.id}.${foundElement.ext}`), async (err) => {

                if (err) {

                    return danger(`${this.errorOrigin} - not deleted`);

                };

                const deletedElement = await db.collection("files").deleteOne(id).catch((err) => { });

                if (!deletedElement) {

                    return danger(`${this.errorOrigin} - not deleted - fileId:${id}`);

                };

                success(true);

            });

        });

        return localPromise;
    };
};

export default FileModel;