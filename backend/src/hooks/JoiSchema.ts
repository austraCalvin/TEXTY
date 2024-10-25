import Joi, { CustomHelpers } from "joi";
import IUser, { ILoginUser, IPOSTUser } from "../Types/User/User";
import { IPOSTFile } from "../Types/Message/File";
import { IPOSTMessage } from "../Types/Message/Message";
import { IPOSTUserReceivingMessage } from "../Types/Message/UserReceivesMessage";
import { IPOSTUserSendsMessage } from "../Types/Message/UserSendsMessage";
import { IPOSTGroup } from "../Types/User/Group";
import { IPOSTUserContactsUser } from "../Types/User/UserContactsUser";
import { IPOSTUserJoinsGroup } from "../Types/User/UserJoinsGroup";
import IUserConfiguration, { IPOSTUserConfiguration } from "../Types/User/Configuration";
import IRegistration, { IPOSTRegistration } from "../Types/Temp/Registration";
import IRecovery from "../Types/Temp/Recovery";
import { IMessageRequest } from "../Types/Message/Request";

export const idJoiSchema = Joi.string();
export const dateJoiSchema = Joi.date();
const replyTypeJoiSchema = Joi.string().valid("send", "receive");
const replyIdJoiSchema = idJoiSchema.when(Joi.ref("replyType"), {
    "then": Joi.required()
});
const chatConfigurationSwitchValue = Joi.boolean();

export const usernameCustomJoi = Joi.extend((joi) => {

    return {
        "type": "username",
        "base": joi.string().trim(),
        "messages": {
            "username.whitespace": "{{#label}} must not have more than one whitespace together"
        },
        "validate": (value: ILoginUser["username"], helpers: CustomHelpers<ILoginUser["username"]>) => {

            if (/\s{2,}/.test(value)) {

                return helpers.error("username.whitespace");

            };

            return value;

        }
    };

});

export const userConfigJoiSchema = Joi.object<IPOSTUserConfiguration, true>({
    "online": Joi.string().valid("everyone", "lastOnline").alter({
        "post": (schema) => schema.default("lastOnline"),
        "patch": (schema) => schema.optional()
    }),
    "writing": chatConfigurationSwitchValue.alter({
        "post": (schema) => schema.default(true),
        "patch": (schema) => schema.optional()
    }),
    "lastOnline": Joi.string().valid("everyone", "contact", "none").alter({
        "post": (schema) => schema.default("everyone"),
        "patch": (schema) => schema.optional()
    }),
    "read": chatConfigurationSwitchValue.alter({
        "post": (schema) => schema.default(true),
        "patch": (schema) => schema.optional()
    }),
    "approve": Joi.string().valid("contact", "group", "both", "none").alter({
        "post": (schema) => schema.default("none"),
        "patch": (schema) => schema.optional()
    }),
    "notify": chatConfigurationSwitchValue.alter({
        "post": (schema) => schema.default(true),
        "patch": (schema) => schema.optional()
    }),
    "push": chatConfigurationSwitchValue.alter({
        "post": (schema) => schema.default(false),
        "patch": (schema) => schema.optional()
    }),
    "email": chatConfigurationSwitchValue.alter({
        "post": (schema) => schema.default(true),
        "patch": (schema) => schema.optional()
    })
});

export const userJoiSchema = Joi.object<IPOSTUser, true>({
    "email": Joi.string().email().alter({
        "signup": (schema) => schema.required(),
        "login": (schema) => schema.optional()
    }),
    // "username": (usernameCustomJoi.username() as Joi.StringSchema<string>).when(Joi.ref("email"), { "then": Joi.required() }),
    "name": Joi.string().alter({
        "signup": (schema) => schema.required(),
        "login": (schema) => schema.optional()
    }),
    "username": Joi.string().alter({
        "signup": (schema) => schema.required(),
        "login": (schema) => schema.required()
    }),
    "password": Joi.string().regex(/^(?=(?:.*[0-9]){5})(?=(?:.*[a-z]){2})(?=(?:.*[A-Z]){1})(?=(?:.*[_.*\-]){1})[0-9a-zA-Z_.*\-]{9,}$/).alter({
        "signup": (schema) => schema.required(),
        "login": (schema) => schema.required()
    })
});

// "password": Joi.string().regex(/^(?=(?:.*[a-z]){2})(?!.*[a-z]{4})(?=(?:.*[A-Z]){2})(?!.*[A-Z]{3})(?=(?:.*[0-9]){3})(?!.*[0-9]{4})(?=(?:.*[_.*\-]){1})(?!.*[_.*\-]{2})[a-zA-Z0-9_.*\-]{8,}$/).alter({
//     "signup": (schema) => schema.required(),
//     "login": (schema) => schema.required()
// })

export const messageJoiSchema = Joi.object<IPOSTMessage, true>({
    "body": Joi.string().trim().min(1).when(Joi.ref("fileId"), { "then": Joi.optional(), "otherwise": Joi.required() }),
    "fileId": Joi.string()
});

// userId
// contactId
// name
// notify
// read
// verified
// blocked

export const userContactsUserJoiSchema = Joi.object<IPOSTUserContactsUser, true>({
    "userId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "contactId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "name": Joi.string(),
    "notify": chatConfigurationSwitchValue.default(true),
    "read": chatConfigurationSwitchValue.default(true),
    "verified": chatConfigurationSwitchValue.default(true),
    "blocked": chatConfigurationSwitchValue.default(false)
});

export const userJoinsGroupSchema = Joi.object<IPOSTUserJoinsGroup, true>({
    "userId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "groupId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "notify": chatConfigurationSwitchValue.default(true),
    "read": chatConfigurationSwitchValue.default(true),
    "blocked": chatConfigurationSwitchValue.default(false),
    "admin": chatConfigurationSwitchValue.default(false)
});

export const userReceivesMessageJoiSchema = Joi.object<IPOSTUserReceivingMessage, true>({
    "userId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    // "messageId": idJoiSchema.alter({
    //     "post": (schema) => schema.required()
    // }),
    // "senderId": Joi.string().alter({
    //     "post": (schema) => schema.required()
    // }),
    "sendId": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "chatType": Joi.string().valid("contact", "group").alter({
        "post": (schema) => schema.required()
    }),
    "chatId": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "replyType": replyTypeJoiSchema,
    "replyId": replyIdJoiSchema
});

export const userSendsMessageJoiSchema = Joi.object<IPOSTUserSendsMessage, true>({
    "userId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "messageId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "date": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "chatType": Joi.string().valid("contact", "group").alter({
        "post": (schema) => schema.required()
    }),
    "chatId": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "replyType": replyTypeJoiSchema,
    "replyId": replyIdJoiSchema
});

export const groupJoiSchema = Joi.object<IPOSTGroup, true>({
    "description": Joi.string(),
    "name": Joi.string(),
    "configurable": chatConfigurationSwitchValue.default(true),
    "messages": chatConfigurationSwitchValue.default(true),
    "joinable": chatConfigurationSwitchValue.default(true),
    "approve": chatConfigurationSwitchValue.default(true)
});

export const registrationJoiSchema = Joi.object<IRegistration, true>({
    "id": Joi.string().optional(),
    "email": Joi.string().email().alter({
        "post": (schema) => schema.required(),
        "confirm": (schema) => schema.required()
    }),
    "code": Joi.number().integer().alter({
        "post": (schema) => schema.optional(),
        "confirm": (schema) => schema.required()
    }),
    "ttl": Joi.date().optional()
});

export const recoveryJoiSchema = Joi.object<IRecovery, true>({
    "id": Joi.string().alter({
        "post": (schema) => schema.optional()
    }),
    "userEmail": Joi.string().email().alter({
        "post": (schema) => schema.required()
    }),
    "type": Joi.string().valid("email", "username", "password").alter({
        "post": (schema) => schema.required()
    }),
    "ttl": Joi.date().alter({
        "post": (schema) => schema.optional()
    }),
    "code": Joi.number().integer().alter({
        "post": (schema) => schema.optional()
    }),
});

export const messageRequestJoiSchema = Joi.object<IMessageRequest, true>({
    "id": idJoiSchema.alter({
        "post": (schema) => schema.optional()
    }),
    "userId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "messageId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    }),
    "contactId": idJoiSchema.alter({
        "post": (schema) => schema.required()
    })
});



export const fileJoiSchema = Joi.object<IPOSTFile, true>({
    "type": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "name": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "ext": Joi.string().alter({
        "post": (schema) => schema.required()
    }),
    "size": Joi.number().alter({
        "post": (schema) => schema.required()
    }),
    "content": Joi.binary().alter({
        "post": (schema) => schema.required()
    })
});