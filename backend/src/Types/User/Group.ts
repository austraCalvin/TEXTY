interface IGroup {

    "id": string;
    "name": string;
    "description": string;
    "configurable": boolean;
    "messages": boolean;
    "joinable": boolean;
    "approve": boolean;

};

export type IPartialGroup = Partial<IGroup>;

export interface IPOSTGroup {

    "name": IGroup["name"];
    "description": IGroup["description"];
    "configurable"?: IGroup["configurable"];
    "messages"?: IGroup["messages"];
    "joinable"?: IGroup["joinable"];
    "approve"?: IGroup["approve"];

};

export interface IEDITGroup {

    "id": IGroup["id"];
    "name": IGroup["name"];
    "description": IGroup["description"];
    "configurable"?: IGroup["configurable"];
    "messages"?: IGroup["messages"];
    "joinable"?: IGroup["joinable"];
    "approve"?: IGroup["approve"];

};

export type IGroupKeys = Array<keyof IGroup>;

export default IGroup;