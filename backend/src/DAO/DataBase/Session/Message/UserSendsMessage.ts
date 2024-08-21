import IUserSendsMessage from "../../../../Types/Message/UserSendsMessage"
import { SessionEntityTemplate } from "../Model";

class UserSendsMessageModel extends SessionEntityTemplate<IUserSendsMessage> {

    protected elements: IUserSendsMessage[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from UserSendsMessage Session instance";

    };

};

export default UserSendsMessageModel;