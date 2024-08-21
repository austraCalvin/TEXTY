import IRegistration from "../../../../Types/Temp/Registration";
import { SessionEntityTemplate } from "../Model";

class RegistrationModel extends SessionEntityTemplate<IRegistration> {

    protected elements: IRegistration[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from Registration Session instance";

    };

};

export default RegistrationModel;