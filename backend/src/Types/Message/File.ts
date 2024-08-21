import IMessage from "./Message";

interface IFile {

    "id": string;
    "type": string;
    "name": string;
    "ext": string;
    "size": number;
    "content": Buffer;

};

export type IFileKeys = Array<keyof IFile>;

//whatsapp image name IMG-20240121-WA0011.jpeg

//name
//type
//size
//lastModified

export type IPartialFile = Partial<IFile>;

export type IPOSTFile = Omit<IFile, "id">;

export type IFileData = Omit<IFile, "content">;

export type IPartialFileData = Partial<IFileData>;

export default IFile;