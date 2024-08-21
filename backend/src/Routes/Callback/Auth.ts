import { UnauthorizedHandler } from "../../Types/Handler";

const OnlyAuthorized: UnauthorizedHandler = (req, res, next) => {

    if (!req.isAuthenticated()) {

        console.log(`${req.url.split("/")[1].toUpperCase()} - User is not authorized`);
        //status = 401
        // return res.status(200).json({ "state": "Unauthorized" });
        return;

    };

    next();

};

export default OnlyAuthorized;