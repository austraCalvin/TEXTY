// interface R {
//     field: string;
//     operator: string;
//     value: any;
// }
// interface RG {
//     combinator: 'and' | 'or';
//     rules: (R | RG)[];
// }
// interface RGIC {
//     rules: (RGIC | R | string)[];
// }
// type RGT = RG | RGIC;

// const f = <T extends RGT>(r: T): T => {
//     if ('combinator' in r) {
//         return { combinator: 'and', rules: [] }; // <-- TS error here
//     }
//     return { rules: [] }; // <-- TS error here
// }

// type opcionesDB = "users" | "messages";

// call signatures
// function f(r: "users"): void;
// function f(r: "messages"): void;

// // implementation
// function f(r: opcionesDB) {

// }

// interface Whaa {
//     combinator: 'or',
//     rules: R[],
//     brainCellCount: number;
// }

// const whaa: Whaa = {
//     combinator: 'or',
//     rules: [],
//     brainCellCount: 86e9
// }

// const f = <T extends RGT>(r: T): T extends RGT ? RG : RGIC => {
//     if ('combinator' in r) {
//         return { combinator: 'and', rules: [] } as any;
//     }
//     return { rules: [] } as any;
// }

// f(whaa)

// const f = <T extends RGT>(r: T): T => {
//     if ('combinator' in r) {
//         return { combinator: 'and', rules: [] }; // error
//     }
//     return { rules: [] }; // error
// }
// const hmm = f(whaa);
// const abc = hmm.brainCellCount.toFixed(2); // no compiler error


// import Joi, { CustomValidator } from "joi";
// import UserFactory from "../DAO/Entity/User/Factory";
// import IUser from "../Types/User/User";

// const username_regexp = new RegExp("[a-z][A-Z][*/.#%&]");

// const userSchema = Joi.object<IUser>({
//     "id": Joi.number().min(1).max(100),
//     "username": Joi.string().regex(/^[a-z][A-Z][\*\/\.]$/).min(5).max(12),
//     "password": Joi.string().min(8).max(14),
//     "email": Joi.string().email(),
//     "created": Joi.date().timestamp("javascript")
// }).or();

// const user_abc = { "id": 123, "username": "austra", "password": "abcACe4ZC414fgh*", "email": "alexandrerivero16@gmail.com" };

// const userJoiSchema = Joi.object<IUser, true>({
//     "id": Joi.number().min(1),
//     "username": Joi.string().alphanum().min(3).max(12),
//     "password": Joi.string().regex(/^(?=(?:.*[a-z]){3})(?!.*[a-z]{4})(?=(?:.*[A-Z]){2})(?!.*[A-Z]{3})(?=(?:.*[0-9]){3})(?!.*[0-9]{4})(?=(?:.*[_.*\-]){1})(?!.*[_.*\-]{2})[a-zA-Z0-9_.*\-]$/).min(8).max(16),
//     "email": Joi.string().email()
// });

// console.log("validating...");
// console.time("austra");

// userSchema.validate(user_abc);

// console.timeEnd("austra");
// console.log("validated...");

// UserFactory.create();

// import mongoose from "mongoose";
// import IUser from "../Types/User/User";
// import IMessage from "../Types/Message/Message";
// import Joi, { CustomHelpers, StringSchema } from "joi";

// (() => {

//     const schemaUsuario = new mongoose.Schema<IUser>({
//         "id": { type: String, required: true },
//         "username": { type: String, required: true },
//         "password": { type: String, required: true },
//         "email": { type: String, required: false },
//         "created": { type: Date, required: false },
//     });

//     const modeloUsuario = mongoose.model<IUser>("User", schemaUsuario, "Users");
//     const nuevoUsuario = new modeloUsuario<IMessage>({ "id": "123" });

//     // hello world
//     const usernameCustomJoi = Joi.extend((joi) => {

//         return {
//             "type": "username",
//             "base": joi.string().trim(),
//             "messages": {
//                 "username.whitespace": "{{#label}} must not have more than one whitespace together"
//             },
//             "validate": (value: IUser["username"], helpers: CustomHelpers<IUser["username"]>) => {

//                 if (/\s{2,}/.test(value)) {

//                     return helpers.error("username.whitespace");

//                 };

//                 return value;

//             }
//         }

//     });

//     const userJoiSchema = Joi.object<IUser>({
//         "id": Joi.string().required(),
//         "username": usernameCustomJoi.username().alter({
//             "login": (schema: StringSchema) => { return schema.forbidden() },
//             "signup": (schema: StringSchema) => { return schema.required() }
//         }),
//         "password": Joi.string().required(),
//         "email": Joi.string().email().alter({
//             "login": (schema) => { return schema.forbidden() },
//             "signup": (schema) => { return schema.required() }
//         }),
//         "created": Joi.date().timestamp("javascript").alter({
//             "login": (schema) => { return schema.forbidden() },
//             "signup": (schema) => { return schema.required() }
//         })
//     });

//     type ILoginUser = { [K in keyof IUser]: K extends "id" | "username" | "password" ? IUser[K] : undefined }

//     const result: Joi.ValidationResult<ILoginUser> = userJoiSchema.tailor("login").validate({ "id": 123, "password": "avcasd" });

//     if (result.error) {

//         return console.log("not passed");

//     };

//     console.log("result:", result.value);

// })();
