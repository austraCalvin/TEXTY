import Joi from "joi";
import IGroup, { IPOSTGroup } from "../../../Types/User/Group";
import { groupJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import { getManyModel } from "../../../Types/IDAOMethods";

export class Group implements IGroup {

    public readonly id;
    public readonly description;
    public readonly name;
    public readonly configurable;
    public readonly messages;
    public readonly joinable;
    public readonly approve;

    constructor({ id, description, name, configurable, messages, joinable, approve }: IGroup) {

        this.id = id;
        this.description = description;
        this.name = name;
        this.configurable = configurable;
        this.messages = messages;
        this.joinable = joinable;
        this.approve = approve;

    };

};

class GroupFactory {

    private constructor() { };

    static async find(param: getManyModel<Pick<IGroup, "id">>): Promise<IGroup[] | null> {

        const elementFound = await DataBase.collection("groups").getMany(param).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findById(id: IGroup["id"]): Promise<IGroup | null> {

        const elementFound = await DataBase.collection("groups").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(param: IPOSTGroup): Promise<IGroup> {

        const isValid = (groupJoiSchema as Joi.ObjectSchema<Required<IPOSTGroup>>).validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from GroupFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const postedElement = await DataBase.collection("groups").postOne({ "id": useId(), ...isValid.value }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject();

        };

        return Promise.resolve(postedElement);

    };

};

export default GroupFactory;