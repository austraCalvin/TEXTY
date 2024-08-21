import Joi from "joi";
import { groupJoiSchema, registrationJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import { getManyModel } from "../../../Types/IDAOMethods";
import IRegistration, { IPOSTRegistration } from "../../../Types/Temp/Registration";

export class Registration implements IRegistration {

    public readonly id;
    public readonly email;
    public readonly ttl;
    public readonly code;

    constructor({ id, email, ttl, code }: IRegistration) {

        this.id = id;
        this.email = email;
        this.ttl = ttl;
        this.code = code;

    };

};

class RegistrationFactory {

    private constructor() { };

    static async find(param: getManyModel<Pick<IRegistration, "id">>): Promise<IRegistration[] | null> {

        const elementFound = await DataBase.collection("registrations").getMany(param).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findById(id: IRegistration["id"]): Promise<IRegistration | null> {

        const elementFound = await DataBase.collection("registrations").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject();

        };

        return Promise.resolve(elementFound);

    };

    static async findByEmail(email: IRegistration["email"]) {

        if (!email) {

            return Promise.reject("Error from RegistrationFactory class at findByEmail - param must have value");

        };

        const elementFoundByEmail = await DataBase.collection("registrations").getOne({ email }).catch((err) => {

            console.log(err);

        });

        if (elementFoundByEmail === undefined) {

            return Promise.reject();

        };

        if (elementFoundByEmail === null) {

            return null;

        };

        return !!elementFoundByEmail;

    };

    static async postOne(param: IPOSTRegistration): Promise<IRegistration> {

        const isValid = (registrationJoiSchema.tailor("post") as Joi.ObjectSchema<Required<IPOSTRegistration>>).validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from RegistrationFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const registrationTTL = new Date(Date.now() + 2 * 60 * 1000),
            registrationCode = Math.round(Math.random() * 100000000);

        const postedElement = await DataBase.collection("registrations").postOne({ "id": useId().split("-").join(""), ...isValid.value, "ttl": registrationTTL, "code": registrationCode }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject();

        };

        return Promise.resolve(postedElement);

    };

    static async patchOne(id: string, code: IRegistration["code"]): Promise<boolean> {

        const updatedElement = await DataBase.collection("registrations").patchOne({ id }, { code }).catch((err) => {

            console.log(err);

        });

        if (!updatedElement) {

            return Promise.reject(`Error from RegistraionFactory class at patchOne - rejected`);

        };

        return Promise.resolve(updatedElement);

    };

    static async deleteOne(id: string): Promise<boolean> {

        const acknowledged = await DataBase.collection("registrations").deleteOne(id).catch((err) => {

            console.log(err);

        });

        if (!acknowledged) {

            return Promise.reject(`Error from RegistrationFactory class at deleteOne - rejected`);

        };

        return Promise.resolve(acknowledged);

    };

};

export default RegistrationFactory;