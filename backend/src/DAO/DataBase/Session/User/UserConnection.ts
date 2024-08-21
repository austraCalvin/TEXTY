import IUserConnection from "../../../../Types/User/UserConnection";
import { SessionEntityTemplate } from "../Model";

class UserConnectionModel extends SessionEntityTemplate<IUserConnection> {

    protected elements: IUserConnection[];
    protected readonly errorOrigin: string;

    constructor() {

        console.log("UserConnection class has been created");

        super();

        this.elements = [];
        this.errorOrigin = "Error from UserConnection Session instance";

    };

};

export default UserConnectionModel;