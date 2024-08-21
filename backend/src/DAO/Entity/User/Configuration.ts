import Joi from "joi";
import IUserConfiguration, { IPOSTUserConfiguration } from "../../../Types/User/Configuration";
import { idJoiSchema, userConfigJoiSchema } from "../../../hooks/JoiSchema";
import useId from "../../../hooks/useId";
import DataBase from "../../DataBase/Config";
import { IPOSTUser } from "../../../Types/User/User";

class UserConfigFactory {

    private constructor() { };

    static async find(id: IUserConfiguration["id"][]) {

        const isValid = Joi.array<IUserConfiguration["id"][]>().items(idJoiSchema).min(1).validate(id, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserConfigFactory class at find - joi validation: ${isValid.error.details[0].message}`);

        };

        const elementFound = await DataBase.collection("user-configuration").getMany({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from ConfigurationFactory class at find - rejected`);

        };

        const unique: Partial<Record<IUserConfiguration["id"], IUserConfiguration>> = {};

        if(elementFound){

            for (const key in elementFound) {

                unique[elementFound[key].id] = elementFound[key];
    
            };

        };

        return Promise.resolve(elementFound ? unique : elementFound);

    };

    static async findById(id: IUserConfiguration["id"]): Promise<IUserConfiguration | null> {

        const elementFound = await DataBase.collection("user-configuration").getOne({ id }).catch((err) => {

            console.log(err);

        });

        if (elementFound === undefined) {

            return Promise.reject(`Error from ConfigurationFactory class at findById - rejected`);

        };

        return Promise.resolve(elementFound);

    };

    static async postOne(param: Partial<IPOSTUserConfiguration>): Promise<IUserConfiguration> {
        
        const tailoredSchema: Joi.Schema<IPOSTUserConfiguration> = userConfigJoiSchema.tailor("post");
        const isValid = tailoredSchema.validate(param, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserConfigurationFactory class at postOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const postedElement = await DataBase.collection("user-configuration").postOne({ "id": useId(), ...isValid.value }).catch((err) => {

            console.log(err);

        });

        if (!postedElement) {

            return Promise.reject(`Error from ConfigurationFactory class at postOne - rejected`);

        };

        return Promise.resolve(postedElement);

    };

    static async patchOne(id: string, update: Partial<IPOSTUserConfiguration>): Promise<boolean> {

        const tailoredSchema: Joi.Schema<IPOSTUserConfiguration> = userConfigJoiSchema.tailor("patch");
        const isValid = tailoredSchema.validate(update, { "stripUnknown": true });

        if (isValid.error) {

            return Promise.reject(`Error from UserConfigurationFactory class at patchOne - joi validation: ${isValid.error.details[0].message}`);

        };

        const updatedElement = await DataBase.collection("user-configuration").patchOne({ id }, update).catch((err) => {

            console.log(err);

        });

        if (!updatedElement) {

            return Promise.reject(`Error from UserFactory class at patchOne - rejected`);

        };

        return Promise.resolve(updatedElement);

    };

};

export default UserConfigFactory;