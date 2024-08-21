// import mongoose from "mongoose";
// import DataBase, { SessionStorageDB } from "../DAO/DataBase/Config";
// import IUser from "../Types/User/User";
// import useId from "../hooks/useId";
// import * as buffer from "buffer";
// import { dateJoiSchema } from "../hooks/JoiSchema";

// console.log("mongoose.connection:", !!mongoose.connection);
// console.log("mongoose.connection.db:", mongoose.connection.db);
// console.log("mongoose.connection.name:", mongoose.connection.name);
// console.log("mongoose.readyState:", mongoose.connection.readyState);

// DataBase.isOnline().then(async (e) => {

//     console.log("success:", e);

//     // DataBase.collection("users").getOne({}).then((e) => {

//     //     console.log("then:", e);

//     // }).catch((err) => {

//     //     console.log("catch:", err);

//     // });

//     const userSchema = new mongoose.Schema<IUser>({
//         "id": String,
//         "username": String,
//         "password": String,
//         "email": String,
//         "created": Date,
//         "lastOnline": Date
//     });

//     mongoose.connection.model("user", userSchema, "users").updateOne({"username": new Date()}).then((e) => {

//         console.log("a:", e);

//     }).catch((e) => {

//         console.log("b:", e);

//     });

//     const postedArray = await DataBase.collection("users").getMany({ "username": "lollol" }).catch((err) => {

//         console.log("err:", err);

//     });

//     console.log("specialz typeof:", typeof postedArray);
//     console.log("specialz value:", postedArray);

// }).catch((e) => {

//     console.log("danger:", e);

// });


// mongoose.connection.asPromise().then((success) => {

//     console.log("connected to mongodb");

// }).catch((err) => {

//     if (err) {

//         console.log("error:", typeof err);

//     };

// });

// const localPromise: Promise<number> = new Promise((success, danger) => {
//     danger(2);
//     console.log("a");
//     success(1);
//     console.log("b");

//     console.log("c");

// });

// (async () => {

//     localPromise.then((e) => {

//         console.log("succ:", e);

//     }).catch((err) => {
//         console.log("err:", err);
//     });

//     const result = await localPromise.catch((err) => {});

//     console.log("typeof result:", typeof result);
//     console.log("valueof result:", result);

// })();

// localPromise.then((e) => {

//     console.log(e);

// });

// localPromise.then((e) => {

//     console.log(e);

// });

// localPromise.catch((e) => {

//     console.log(e);

// });

// localPromise.catch((e) => {

//     console.log(e);

// });

// setTimeout(async () => {

//     localPromise.then((e) => {

//         console.log(e);

//     }).catch((e) => {

//         console.log(e);

//     });

//     const result = await localPromise.catch((err) => { });

//     console.log("hello world");
//     console.log("result:", result);
//     console.log("typeof result:", typeof result);

// }, 3000);

// const blobContent = new Blob(["austra is back again"], { "type": "text/plain", "encoding": "utf8" });
// const createdFile = new buffer.File([blobContent], "lol.txt", {"type": blobContent.type});

// // console.log("file-name:", createdFile.name);
// // console.log("file-size:", createdFile.size);

// const bufferRaw = buffer.Buffer.from("hello world");
// const bufferString = bufferRaw.toString();
// const bufferSize = bufferRaw.byteLength;

// console.log("buffer raw:", bufferRaw);
// console.log("buffer string:", bufferString);
// console.log("buffer arraybuffer:", bufferRaw.buffer);
// console.log("buffer size1:", bufferRaw.byteLength);
// console.log("buffer size2:", bufferRaw.length);
// console.log("buffer byte-offset:", bufferRaw.byteOffset);

// console.log("createdFile:", createdFile);

// DataBase.isOnline().then(async (db) => {

//     console.log(`${db.dbName} is online`);

//     const content = await createdFile.arrayBuffer().catch((err) => {});

//     if (!content) {

//         console.log("failed getting the arrayBuffer from file");
//         return;

//     };

//     const fileExtMatch = createdFile.name.match(/(\.[a-z]{1,4})/g);

//     const uploadedFile = await SessionStorageDB.collection("files-content").postOne({ "id": useId(), "name": createdFile.name, "type": createdFile.type, "ext": fileExtMatch ? fileExtMatch[0] : "bin", "size": bufferSize, "content": buffer.Buffer.from(content)}).catch((err) => {

//         console.log(err);

//     });

//     if (!uploadedFile) {

//         return;

//     };

//     console.log("uploaded file:", uploadedFile);

//     const postedMessage = await db.collection("messages").postOne({ "id": useId(), "body": "hello world", "fileId": uploadedFile.id }).catch((err) => {

//         console.log(err);

//     });

//     if (!postedMessage) {

//         return;

//     };

//     console.log("posted message:", postedMessage);


// }).catch((err) => {

//     console.log(`${DataBase.dbName} is offline`);
//     console.log("WHY", err);

// });

// for (let index = 0; index <= 10; index++) {

//     if(index === 8){

//         continue;

//     };

//     console.log(index);

// };

// const model = [{ "id": "lala", "date": undefined }, { "id": "jojo", "date": undefined }, { "id": "teletuvi", "date": undefined }];

// const random: Partial<Record<keyof { "id": string, "date": Date }, any>> = {};

// for (const props in model[0]) {

//     const property = props as keyof { "id": string, "date": Date };

//     for (const each of model) {

//         if (!random[property]) {

//             random[property] = {
//                 "$in": []
//             };

//         };

//         random[property]["$in"] = [...random[property]["$in"], each[property]];

//     };

// };

// console.log(random);

// for (let random = 0; random <= 10; random++) {

//     if (random <= 5) {

//         continue;

//     };

//     console.log("random:", random);

// };

console.log(("a".localeCompare("b")));