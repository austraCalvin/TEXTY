import IUserContactsUser from "../../../../Types/User/UserContactsUser";
import { SessionEntityTemplate } from "../Model";

// class UserContactsUser {

//     private user: IUserConnection;
//     private contacts: Omit<IUserContactsUser, "userId">[];
//     private target: IUser["id"][];

//     constructor(user: IUserConnection) {

//         this.user = user;
//         this.contacts = [];
//         this.target = [];

//         ModelFactory.dataBase(databaseChose).collection("user-contacts-user").getMany({ "userId": user.id }).then((userContacts) => {

//             this.contacts = userContacts;

//         }).catch((err) => { });

//     };

//     to(contacts: IUser["id"]): this;
//     to(contacts: IUser["id"][]): this;
//     to(contacts: IUser["id"] | IUser["id"][]): this {

//         return this;

//     };

//     async send(userSends: IPOSTUserSendsMessage, message: IPlainTextMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendsMessage, message: IFileAttachedMessagePending): Promise<IUserSendsMessage>;
//     async send(userSends: IPOSTUserSendsMessage, message: IMessagePending): Promise<IUserSendsMessage> {

//         if (message.file) {

//             return await this.user.send(userSends, message);

//         };

//         return await this.user.send(userSends, message);

//     };

// };

class UserContactsUserModel extends SessionEntityTemplate<IUserContactsUser> {

    protected elements: IUserContactsUser[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from UserContactsUser Session instance";

    };

};

export default UserContactsUserModel;