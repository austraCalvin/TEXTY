import IConfiguration from "../../../../Types/User/Configuration";
import { SessionEntityTemplate } from "../Model";

class UserConfigurationModel extends SessionEntityTemplate<IConfiguration> {

    protected elements: IConfiguration[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from UserConfiguration Session instance";

    };

};

export default UserConfigurationModel;