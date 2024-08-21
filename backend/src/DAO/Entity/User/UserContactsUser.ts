import IUser from "../../../Types/User/User";
import IUserContactsUser, { IPOSTUserContactsUser } from "../../../Types/User/UserContactsUser";
import { userContactsUserJoiSchema } from "../../../hooks/JoiSchema";
import DataBase from "../../DataBase/Config";
import Joi from "joi";
import useId from "../../../hooks/useId";
import { getManyModel } from "../../../Types/IDAOMethods";

export class UserContactsUser implements IUserContactsUser {

    public readonly id;
    public readonly userId;
    public readonly contactId;
    public readonly name;
    public readonly notify;
    public readonly read;
    public readonly verified;
    public readonly blocked;
    public readonly date;

    constructor({ id, userId, contactId, name, notify, read, verified, blocked, date }: IUserContactsUser) {

        this.id = id;
        this.userId = userId;
        this.contactId = contactId;
        this.name = name;
        this.notify = notify;
        this.read = read;
        this.verified = verified;
        this.blocked = blocked;
        this.date = date;

    };

};

class UserContactsUserFactory {

    private constructor() { };

    static async find(filter: getManyModel<Pick<IUserContactsUser, "userId" | "contactId" | "id">>): Promise<IUserContactsUser[] | null> {

        const elementFound = await DataBase.collection("user-contacts-user").getMany(filter).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findByUserIds(userId: IUser["id"], contactId: IUser["id"]): Promise<IUserContactsUser | null> {

        const elementFound = await DataBase.collection("user-contacts-user").getOne({ userId, contactId }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findById(id: IUserContactsUser["id"]): Promise<IUserContactsUser | null> {

        const elementFound = await DataBase.collection("user-contacts-user").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(param: IPOSTUserContactsUser): Promise<IUserContactsUser> {

        const tailoredSchema: Joi.Schema<Required<IPOSTUserContactsUser>> = userContactsUserJoiSchema.tailor("post");
        const isValid = tailoredSchema.validate(param);

        if (isValid.error) {

            return Promise.reject(`Error from UserContactsUserFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        console.log("param contact:", param);
        console.log("post one contact:", isValid.value);

        const createdDate = new Date().toUTCString();

        const postedElement = await DataBase.collection("user-contacts-user").postOne({ "id": useId(), ...isValid.value, "date": createdDate }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject(`Error from UserContactsUserFactory class at postOne - rejected`);

        };

        return Promise.resolve(postedElement);

    };

};

export default UserContactsUserFactory;