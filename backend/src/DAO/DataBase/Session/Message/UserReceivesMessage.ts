import { IDAOMethods } from "../../../../Types/IDAOMethods";
import IUserReceivesMessage from "../../../../Types/Message/UserReceivesMessage";
import { SessionEntityTemplate } from "../Model";

class UserReceivesMessageModel extends SessionEntityTemplate<IUserReceivesMessage>{

    protected elements: IUserReceivesMessage[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from UserReceivesMessage Session instance";

    };

};

export default UserReceivesMessageModel;