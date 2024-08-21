// (()=>{

// import { idJoiSchema } from "../hooks/JoiSchema";

//     interface IIUser {

//         id: number
//         username: string

//     };

//     interface IIMessage {

//         id: number
//         body: string

//     };

//     type Custom<P = undefined> = P extends undefined
//         ? any
//         : { [K in keyof P]?: K extends "id" ? P[K] : any }

//     let sdf: Custom<IIMessage>;

//     interface RandomClass<P> {

//         connect: () => P;

//     };

//     interface RandomType {
//         connect: () => any
//     };

//     class Random implements RandomType {

//         id: number;

//         constructor() {
//             this.id = 123;
//         };

//         connect() {

//             return { "id": 123 };

//         };

//     };

//     let abc: RandomClass<IIUser>;


//     interface hello<T> {
//         hola(initialVal: T, ...args: T[]): T
//     };

//     const cba: hello<string> = {
//         "hola": () => { return "sting" }
//     };



//     function greet<Str extends string>(s: Str) {
//         console.log("Hello, " + s);
//     }

//     greet<"strigsd">("strigsd");


//     class Usuario {

//         public id: number;
//         public username: string;
//         public password: string;

//         constructor(id: number, username: string, password: string) {

//             this.id = id;
//             this.username = username;
//             this.password = password;

//         };

//     };
//     class Mensaje {

//         public id: number;
//         public body: string;

//         constructor(id: number, body: string) {

//             this.id = id;
//             this.body = body;

//         };

//     };

//     class BaseDeDatosUsuario implements GlobalDAO<Usuario> {

//         private uri: string = "http://localhost:3000";
//         private usuarios: Usuario[];

//         constructor() {

//             this.usuarios = [];

//         };

//         getAll() {

//             return this.usuarios;

//         };

//         getOne({ id, username, password }: Partial<Usuario>) {

//             return this.usuarios[0];

//         };

//     };

//     class BaseDeDatosMensaje implements GlobalDAO<Mensaje> {

//         private uri: string = "http://localhost:3000";
//         private mensajes: Mensaje[];

//         constructor() {

//             this.mensajes = [];

//         };

//         getAll() {

//             return this.mensajes;

//         };

//         getOne({ id }: Partial<Mensaje>) {

//             return this.mensajes[0];

//         };

//     };

//     interface GlobalDAO<T> {

//         getAll(): T[]
//         getOne(search: Partial<T>): T

//     };

//     type OptResult = GlobalDAO<Usuario> | GlobalDAO<Mensaje>;

//     type OpcionesDeBaseDeDatos = "Usuario" | "Mensaje";

//     class Controlador {

//         ObtenerBaseDeDatos(opciones: "Usuario"): GlobalDAO<Usuario>;
//         ObtenerBaseDeDatos(opciones: "Mensaje"): GlobalDAO<Mensaje>;

//         ObtenerBaseDeDatos(opciones: OpcionesDeBaseDeDatos): OptResult {


//             switch (opciones) {

//                 case "Usuario":
//                     return new BaseDeDatosUsuario;
//                 case "Mensaje":
//                     return new BaseDeDatosMensaje;

//             };

//         };

//     };

//     const resultado = new Controlador().ObtenerBaseDeDatos("Mensaje").getOne({});
//     resultado;

// })();

// const isValid = idJoiSchema.validate("14d89136-9593-4cf6-a6eb-7430dbce30ca");
// if (!isValid.error) {

//     console.log(isValid.value);

// }else{

//     console.log(isValid.error.details[0].message);

// };


//The text must contain 
//2 lowercase as minimum, 5 maximum
//1 uppercase as minimum, 3 maximum

fetch("http://localhost:27018/", { "headers": {"content-type": "application/json" }, "method": "GET" }).then(async(e) => {

    console.log("response =", e.status);

}).catch((err) => {

    console.log("errorcito:", err);

});