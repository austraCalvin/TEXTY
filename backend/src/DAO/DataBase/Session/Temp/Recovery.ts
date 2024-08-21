import IRecovery from "../../../../Types/Temp/Recovery";
import { SessionEntityTemplate } from "../Model";

class RecoverySession extends SessionEntityTemplate<IRecovery> {

    protected elements: IRecovery[];
    protected readonly errorOrigin: string;

    constructor() {

        super();

        this.elements = [];
        this.errorOrigin = "Error from Recovery Session instance";

    };

};

export default RecoverySession;