import { IFileAttachedMessagePending, IMessage, IMessagePending, IPlainTextMessagePending, IPOSTEDFileAttachedMessage, IPOSTEDOptionMessage, IPOSTEDPlainTextMessage } from "../../../Types/Message/Message";
import Joi from "joi";
import { idJoiSchema, messageJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import FileFactory from "./File";

class MessageFactory {

    private constructor() { };

    static async find(id: IMessage["id"][]): Promise<IMessage[] | null> {

        const isValid = Joi.array<IMessage["id"][]>().items(idJoiSchema).min(1).validate(id, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from MessageFactory class at find - joi validation: ${isValid.error.details[0].message}`);

        };

        const elementFound = await DataBase.collection("messages").getMany({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from MessageFactory class at find - rejected`);

        };

        return Promise.resolve(elementFound ? (elementFound as IMessage[]) : []);

    };

    static async findById(id: IMessage["id"]): Promise<IPOSTEDOptionMessage | null> {

        const elementFound = await DataBase.collection("messages").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from MessageFactory class at findById - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(message: IPlainTextMessagePending): Promise<IPOSTEDPlainTextMessage>
    static async postOne(message: IFileAttachedMessagePending): Promise<IPOSTEDFileAttachedMessage>
    static async postOne(message: IMessagePending): Promise<IPOSTEDOptionMessage> {

        const tailoredSchema: Joi.Schema<IMessagePending> = messageJoiSchema.tailor("post");
        const isValid = tailoredSchema.validate(message, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from MessageFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        if (message.file) {

            const fileAttached = await FileFactory.postOne(message.file).catch((err) => {

                console.log(err);

            });

            if (!fileAttached) {

                return Promise.reject(`Error from MessageFactory class at postOne - rejected`);

            };

            const postedFileAttached = await DataBase.collection("messages").postOne({ "id": useId(), "body": isValid.value.body, "fileId": fileAttached.id }).catch((err) => {

                console.log(err);

            });

            if (!postedFileAttached) {

                return Promise.reject(`Error from MessageFactory class at postOne - rejected`);

            };

            return Promise.resolve(postedFileAttached);

        };

        const postedPlainText = await DataBase.collection("messages").postOne({ "id": useId(), "body": message.body }).catch((err) => {

            console.log(err);

        });

        if (!postedPlainText) {

            return Promise.reject(`Error from MessageFactory class at postOne - rejected`);

        };

        return Promise.resolve(postedPlainText);

    };

};

//{"content": new Buffer("aa"), "ext": "", "name": "", "size": 1, "type": ""}

// MessageFactory.create({"body": undefined, "file": {"content": new Buffer("aa"), "ext": "", "name": "", "size": 1, "type": ""}}, ModelFactory.dataBase("mongodb").collection("messages"));

export default MessageFactory;