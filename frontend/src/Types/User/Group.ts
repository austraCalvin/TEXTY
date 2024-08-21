interface IGroup {

    "id": string;
    "type": "group";
    "name": string;
    "description": string;
    // "configurable": boolean;
    // "messages": boolean;
    // "joinable": boolean;
    // "approve": boolean;

};

export interface IPOSTEDGroup {

    "id": IGroup["id"];
    "type": "group";
    "name": IGroup["name"];
    "description"?: IGroup["description"];

};

export type IPartialGroup = Partial<IGroup>;

export interface IPOSTGroup {

    "type": "group";
    "name": IGroup["name"];
    "description"?: IGroup["description"];
    // "configurable"?: IGroup["configurable"];
    // "messages"?: IGroup["messages"];
    // "joinable"?: IGroup["joinable"];
    // "approve"?: IGroup["approve"];

};

export interface IEDITGroup {

    "id": IGroup["id"];
    "type": "group";
    "name"?: IGroup["name"];
    "description"?: IGroup["description"];
    // "configurable"?: IGroup["configurable"];
    // "messages"?: IGroup["messages"];
    // "joinable"?: IGroup["joinable"];
    // "approve"?: IGroup["approve"];

};

export type IGroupKeys = Array<keyof IGroup>;

export default IGroup;