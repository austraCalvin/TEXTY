import mongoose from "mongoose";
import path from "path";
import { Socket, io } from "socket.io-client";
import { IClientToServerEvents, IServerToClientEvents, IInterServerEvents } from "../Types/SocketEvents";
import Joi from "joi";
import IReply from "../Types/Message/Reply";

// const clientSocket: Socket<IServerToClientEvents, IClientToServerEvents> = io("ws://127.0.0.1:4141");
// clientSocket.connect();

// if (clientSocket.connected) {

//     console.log("connected!");

// };

// clientSocket.emit("add-friend", { "userId": "yo", "contactId": "danielancer", "username": "jaja" }, (result) => {

//     console.log("result --->", result);

// });

// console.log("mongoose connection", mongoose.connection.readyState);

// mongoose.connection;

// enum ConnectionStates {
//     disconnected = 0,
//     connected = 1,
//     connecting = 2,
//     disconnecting = 3,
//     uninitialized = 99
// };

// const states: ConnectionStates = 3;

// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // const dircito = dirname(new URL(import.meta.url).pathname);
// // console.log("dirname1:", dircito);

// console.log("dirname2:", __dirname);
// console.log("filename:", __filename);

// console.log("path.join:", path.join(__dirname, "upload"));
// fs.readdir(path.join(__dirname, "message_passing_protocol", "src", ""), (err, files) => {

//     console.log("files:", files);

//     files.forEach((each) => {

//         console.log("file:", each);

//     });

// });

// console.log("nombre:", path.parse("file.txt"));

// console.log(path.resolve("./lol.txt"));
// console.log(path.resolve("./src/upload"));


// const okFn = async (choose: "black" | "white"): Promise<string> => {

//     if (choose === "black") {

//         return Promise.reject("no");

//     };

//     return Promise.resolve("yes");

// };

// const result = await okFn("black").catch(()=>{

//     console.log("jaja");

// });

// console.log("result ---> ", result);


// const failed = true;

// const future: Promise<boolean> = new Promise((success, danger) => {

//     if (failed) {

//         danger("parameter must be string");

//     };

//     return success(true);

// });

// (async () => {

//     let result: Promise<boolean>;

//     result = future;

//     result.then((value) => {

//         console.log("result:", result);

//     })
//     .catch((err) => {

//         console.log("promise error:", !!err);

//     });

// })();

// const randomArray: any[] = [];
// const randomObj = {};

// console.log("1.", randomObj instanceof Array);
// new Array()

// const isValid = Joi.string().valid("x").validate("x");
// const isValid = Joi.object({
//     "type": Joi.string().valid("send", "receive"),
//     "id": Joi.string().when(Joi.ref("type"), {"is": Joi.required(),"then": Joi.required(), "otherwise": Joi.forbidden()})
// }).validate({"type": undefined});

// console.log("is valid:", !!isValid.error ? "no" : "yes");
// console.log("details:", isValid.error)


// const schema = Joi.object({
//     "hello": Joi.string().required(),
//     "world": Joi.string()
// });

// const isValid = schema.validate({ "hello": "world", "lol": "yes", "world": "jaja" }, {"stripUnknown": true});

// console.log("is valid:", !!isValid.error ? "no" : "yes");
// console.log("error message:", isValid.error?.details[0].message)
// console.log("is valid:", isValid.value);


// const schema = Joi.array().items(Joi.object({
//     "name": Joi.string().required(),
//     "age": Joi.number().integer().optional()
// })).single();

// const isValid = schema.validate([{ "name": "hello" }, { "hello": "world", "name": "austra" }, {"a": "b"}], { "stripUnknown": true});

// console.log("is valid:", !!isValid.error ? "no" : "yes");
// console.log("error message:", isValid.error?.details)
// console.log("is valid:", isValid.value);

// console.log(`'${path.resolve("./src/upload/lol.ts")}'`);