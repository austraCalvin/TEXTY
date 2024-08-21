import {IPOSTUser} from "./Types/User/User";

declare global {

    namespace Express {

        interface User extends IPOSTUser {
            "id": string;
        }

    }

};

declare module "express-session" {
    interface SessionData {
        count: number;
    }
};