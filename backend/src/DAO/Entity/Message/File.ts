import Joi from "joi";
import IFile, { IPOSTFile } from "../../../Types/Message/File";
import { fileJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import  { SessionStorageDB } from "../../DataBase/Config";

class FileFactory {

    private constructor(){};

    static async findById(id: IFile["id"]): Promise<IFile | null> {

        const elementFound = await SessionStorageDB.collection("files-content").getOne({ id }).catch((err) => { 

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from FileFactory class at findById - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(param: IPOSTFile): Promise<IFile> {

        const isValid = fileJoiSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error in MessageFactory class - joi validation ${isValid.error.details[0].message}`);

        };

        const postedElement = await SessionStorageDB.collection("files-content").postOne({ "id": useId(), ...isValid.value }).catch((err) => {

            console.log(err);

         });

        if (!postedElement) {

            return Promise.reject(`Error from FileFactory class at postOne - rejected`);

        };

        return Promise.resolve(postedElement);

    };

};

export default FileFactory;