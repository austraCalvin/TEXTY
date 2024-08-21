import Joi from "joi";
import IUserJoinsGroup, { IPOSTUserJoinsGroup, IPartialUserJoinsGroup } from "../../../Types/User/UserJoinsGroup";
import { userJoinsGroupSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import IGroup from "../../../Types/User/Group";
import IUser from "../../../Types/User/User";
import { getManyModel } from "../../../Types/IDAOMethods";

export class UserJoinsGroup implements IUserJoinsGroup {

    public readonly id;
    public readonly userId;
    public readonly groupId;
    public readonly notify;
    public readonly read;
    public readonly blocked;
    public readonly admin;
    public readonly date;

    constructor({ id, userId, groupId, notify, read, blocked, admin, date }: IUserJoinsGroup) {

        this.id = id;
        this.userId = userId;
        this.groupId = groupId;
        this.notify = notify;
        this.read = read;
        this.blocked = blocked;
        this.admin = admin;
        this.date = date;

    };

};

class UserJoinsGroupFactory {

    private constructor() { };

    static async find(param: getManyModel<Pick<IUserJoinsGroup, "userId" | "groupId">>):Promise<IUserJoinsGroup[] | null> {

        const elementFound = await DataBase.collection("user-joins-group").getMany(param).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findByUserId(userId: IUser["id"], groupId: IGroup["id"]): Promise<IUserJoinsGroup | null> {

        const elementFound = await DataBase.collection("user-joins-group").getOne({ "userId": userId, "groupId": groupId }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findById(id: IUserJoinsGroup["id"]): Promise<IUserJoinsGroup | null> {

        const elementFound = await DataBase.collection("user-joins-group").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async getMany(param: IPartialUserJoinsGroup): Promise<IUserJoinsGroup[] | null> {

        const isValid = userJoinsGroupSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error in UserJoinsGroupFactory class - joi validation: ${isValid.error.details[0].message}`);

        };

        const foundElements = await DataBase.collection("user-joins-group").getMany({ "groupId": [isValid.value.groupId] }).catch((err) => {

            console.log(err);

        });

        if (foundElements === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(foundElements);

    };

    static async postOne(param: IPOSTUserJoinsGroup): Promise<IUserJoinsGroup> {

        const tailoredSchema: Joi.Schema<Required<IPOSTUserJoinsGroup>> = userJoinsGroupSchema.tailor("post");
        const isValid = tailoredSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserJoinsGroupFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const createdDate = new Date().toUTCString();

        const postedElement = await DataBase.collection("user-joins-group").postOne({ "id": useId(), ...isValid.value, "date": createdDate }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject();

        };

        return Promise.resolve(postedElement);

    };

    static async postMany(param: IPOSTUserJoinsGroup[]): Promise<IUserJoinsGroup[]> {

        const tailoredSchema: Joi.Schema<Required<IPOSTUserJoinsGroup>> = userJoinsGroupSchema.tailor("post");
        const isValid = Joi.array<Required<IPOSTUserJoinsGroup>[]>().items(tailoredSchema).validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserSendsMessageFactory class at postMany - joi validation:${isValid.error.details[0].message}`);

        };

        const createdDate = new Date().toUTCString();

        const idGenerated: IUserJoinsGroup[] = isValid.value.map((each) => {

            return { ...each, "id": useId(), "date": createdDate };

        });

        const postedArray = await DataBase.collection("user-joins-group").postMany(idGenerated).catch((err) => {

            console.log(err);

        });

        if (!postedArray) {

            return Promise.reject();

        };

        return Promise.resolve(postedArray);

    };

};

export default UserJoinsGroupFactory;