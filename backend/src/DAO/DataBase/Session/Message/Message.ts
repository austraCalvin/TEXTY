import IMessage from "../../../../Types/Message/Message"
import { SessionEntityTemplate } from "../Model";

class MessageModel extends SessionEntityTemplate<IMessage>{

    protected elements: IMessage[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from Message Session instance";

    };

};

export default MessageModel;