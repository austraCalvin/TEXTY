import IContact from "./User/UserContactsUser";

interface IChat {

    "id": string;
    "userId"?: string;
    "type": "contact" | "group";
    "name": string;
    "description"?: string;
    "admin"?: boolean;
    "members": IChatMember[]

};

export interface IPOSTEDChat {

    "id": string;
    "userId"?: string;
    "type": "contact" | "group";
    "name": string;
    "description"?: string;

};

export interface IChatMember {

    "id": string;
    "name": string;
    "description"?: string;
    "admin"?: boolean;

}

export interface CurrentChatOptional {
    "id": IContact["id"];
    "online"?: boolean;
    "lastOnline"?: string;
};

export default IChat;