import Joi from "joi";
import { recoveryJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import { getManyModel } from "../../../Types/IDAOMethods";
import IRecovery, { IPOSTRecovery } from "../../../Types/Temp/Recovery";

export class Recovery implements IRecovery {

    public readonly id;
    public readonly userEmail;
    public readonly type;
    public readonly ttl;
    public readonly code;

    constructor({ id, userEmail, ttl, code, type }: IRecovery) {

        this.id = id;
        this.userEmail = userEmail;
        this.type = type;
        this.ttl = ttl;
        this.code = code;

    };

};

class RecoveryFactory {

    private constructor() { };

    static async find(param: getManyModel<Pick<IRecovery, "id">>): Promise<IRecovery[] | null> {

        const elementFound = await DataBase.collection("recoveries").getMany(param).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findById(id: IRecovery["id"]): Promise<IRecovery | null> {

        const elementFound = await DataBase.collection("recoveries").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(param: IPOSTRecovery): Promise<IRecovery> {

        const isValid = (recoveryJoiSchema.tailor("post") as Joi.ObjectSchema<Required<IPOSTRecovery>>).validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from RecoveryFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const registrationTTL = new Date(Date.now() + 2 * 60 * 1000),
            registrationCode = Math.round(Math.random() * 100000000);

        const postedElement = await DataBase.collection("recoveries").postOne({ "id": useId().split("-").join(""), ...isValid.value, "ttl": registrationTTL, "code": registrationCode }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject();

        };

        return Promise.resolve(postedElement);

    };

    static async patchOne(id: string, code: IRecovery["code"]): Promise<boolean> {

        const updatedElement = await DataBase.collection("recoveries").patchOne({ id }, { code }).catch((err) => {

            console.log(err);

        });

        if (!updatedElement) {

            return Promise.reject(`Error from RecoveryFactory class at patchOne - rejected`);

        };

        return Promise.resolve(updatedElement);

    };

    static async deleteOne(id: string): Promise<boolean> {

        const acknowledged = await DataBase.collection("recoveries").deleteOne(id).catch((err) => {

            console.log(err);

        });

        if (!acknowledged) {

            return Promise.reject(`Error from RecoveryFactory class at deleteOne - rejected`);

        };

        return Promise.resolve(acknowledged);

    };

};

export default RecoveryFactory;