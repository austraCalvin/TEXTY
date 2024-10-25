import Joi from "joi";
import { idJoiSchema, messageJoiSchema, messageRequestJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import { IMessageRequest } from "../../../Types/Message/Request";
import { getManyModel } from "../../../Types/IDAOMethods";
import IUser from "../../../Types/User/User";

class MessageRequestFactory {

    private constructor() { };

    static async find(param: getManyModel<Pick<IMessageRequest, "contactId">>): Promise<IMessageRequest[] | null> {

        const isValid = Joi.object<{ contactId: IMessageRequest["contactId"][] }, true>({
            "contactId": Joi.array<IUser["id"][]>().items(idJoiSchema).min(1)
        }).validate(param);

        if (isValid.error) {

            return Promise.reject(`Error from MessageRequestFactory class at find - joi validation: ${isValid.error.details[0].message}`);

        };

        const elementFound = await DataBase.collection("message-requests").getMany(param).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from MessageRequestFactory class at find - rejected`);

        };

        return Promise.resolve(elementFound ? (elementFound as IMessageRequest[]) : []);

    };

    static async findById(id: IMessageRequest["id"]): Promise<IMessageRequest | null> {

        const elementFound = await DataBase.collection("message-requests").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from MessageRequestFactory class at findById - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async findByUserIds(userId: IMessageRequest["userId"], contactId: IMessageRequest["contactId"]): Promise<IMessageRequest | null> {

        const elementFound = await DataBase.collection("message-requests").getOne({ userId, contactId }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from MessageRequestFactory class at findById - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(messageRequest: Pick<IMessageRequest, Exclude<keyof IMessageRequest, "id">>): Promise<IMessageRequest> {

        const tailoredSchema: Joi.Schema<Pick<IMessageRequest, Exclude<keyof IMessageRequest, "id">>> = messageRequestJoiSchema.tailor("post");
        const isValid = tailoredSchema.validate(messageRequest, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from MessageRequestFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const postedElement = await DataBase.collection("message-requests").postOne({ "id": useId(), ...messageRequest }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject(`Error from MessageRequestFactory class at postOne - rejected`);

        };

        return Promise.resolve(postedElement);

    };

    static async deleteOne(id: IMessageRequest["id"]): Promise<boolean> {

        const deletedElement = await DataBase.collection("message-requests").deleteOne(id).catch((err) => {

            console.log(err);

        });

        if (!deletedElement) {

            return Promise.reject(`Error from MessageRequestFactory class at postOne - rejected`);

        };

        return Promise.resolve(deletedElement);

    };

};

export default MessageRequestFactory;