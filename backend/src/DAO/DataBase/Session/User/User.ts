import IUser from "../../../../Types/User/User";
import { SessionEntityTemplate } from "../Model";

class UserModel extends SessionEntityTemplate<IUser> {

    protected elements: IUser[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from User Session instance";

    };

};

export default UserModel;