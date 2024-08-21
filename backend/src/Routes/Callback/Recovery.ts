import Joi from "joi";
import RegistrationFactory from "../../DAO/Entity/Temp/Registration";
import UserFactory from "../../DAO/Entity/User/User";
import { CustomHandler } from "../../Types/Handler";
import IUser, { IPOSTUser } from "../../Types/User/User";
import transport from "../../nodemailer";
import RecoveryFactory from "../../DAO/Entity/Temp/Recovery";
import { IPOSTRecovery } from "../../Types/Temp/Recovery";
import { recoveryJoiSchema } from "../../hooks/JoiSchema";

export const requestRecoveryCallback: CustomHandler<false, {}, IPOSTRecovery> = async (req, res, next) => {

    const isValid = recoveryJoiSchema.validate(req.body);

    if (isValid.error) {

        console.log(`Error from requestRecoveryCallback - joi validation: ${isValid.error.details[0].message}`);
        console.log("email field:", req.body);

        res.json({ "status": "Bad Request" });
        return;

    };

    const userExists = await UserFactory.findByEmail(isValid.value.userEmail).catch((err) => {

        console.log(err);

    });

    if (userExists === undefined) {

        res.status(500).json({ "status": "Internal Server Error" });
        return;

    };

    if (!userExists) {

        res.json({ "status": "No User" });
        return;

    };

    const newRecovery = await RecoveryFactory.postOne({ "userEmail": userExists.email, "type": isValid.value.type }).catch((err) => {

        console.log(err);

    });

    if (newRecovery === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    res.json({ "status": "Created" });

    transport.sendMail({
        "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
        "to": newRecovery.userEmail,
        "subject": "Password recovery",
        "html": `<a href="http://localhost:3000/recovery/confirm/${newRecovery.id}">confirm</a>
    RECOVERY CODE
    <h2>${newRecovery.code}</h2>
    <br/>
    <br/>
    <a href="http://localhost:3000/recovery/cancel/${newRecovery.id}">cancel</a>
    `
    });

};
export const checkRecoveryCallback: CustomHandler<false, { "id": string }> = async (req, res, next) => {

    console.log(`checkRecoveryCallback - recoveryId=${req.params.id}`);

    const RecoveryExists = await RecoveryFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (RecoveryExists === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    //RecoveryExists ? 200 : 204

    res.json({ "status": RecoveryExists ? "OK" : "Not Found" });

};

export const validateRecoveryCodeCallback: CustomHandler<false, { "id": string }, string> = async (req, res, next) => {

    const recoveryPending = await RecoveryFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (recoveryPending === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (recoveryPending === null) {

        // status 204
        res.json({ "status": "Not Found" });
        return;

    };

    if (!(/^\d+$/.test(req.body))) {

        res.json({ "status": "Bad Request" });
        return;

    };

    const insertedCode = Number(req.body);

    if (!(insertedCode === recoveryPending.code)) {

        res.json({ "status": "Unauthorized" });

        const currentRecoveryCode = Math.round(Math.random() * 100000000);

        const updatedRecovery = await RecoveryFactory.patchOne(req.params.id, currentRecoveryCode).catch((err) => {

            console.log(err);

        });

        if (updatedRecovery === undefined) {

            console.log("Error from confirmRecoveryCallback at RecoveryFactory.patchOne - rejected");
            return;

        };

        if (updatedRecovery === false) {

            console.log("Error from confirmRecoveryCallback at RecoveryFactory.patchOne - NOT acknowledged");
            return;

        };

        if (updatedRecovery === true) {

            transport.sendMail({
                "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
                "to": recoveryPending.userEmail,
                "subject": "Recovery code just changed",
                "html": `
                <h1>CURRENT RECOVERY CODE</h1>
                <p>${currentRecoveryCode}</p>
                `
            })

        };

        return;

    };

    res.json({ "status": "Authorized" });

};

export const confirmRecoveryCallback: CustomHandler<false, { "id": string }, Partial<IPOSTUser> & { "code": number }> = async (req, res, next) => {

    const recoveryPending = await RecoveryFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (recoveryPending === undefined) {

        //status 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (recoveryPending === null) {

        res.json({ "status": "Not Found" });
        return;

    };

    const currentType = recoveryPending.type,
        currentField = req.body[currentType];

    if (!currentField) {

        res.json({ "status": "Bad Request" });
        return;

    };

    const userExists = await UserFactory.findByEmail(recoveryPending.userEmail).catch((err) => {

        console.log(err);

    });

    if (userExists === undefined) {

        //status 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (!userExists) {

        res.json({ "status": "Not Found" });
        return;

    };

    const recoveredUser = await UserFactory.patchOne(userExists.id, { [currentType]: currentField }).catch((err) => {

        console.log(err);

    });

    if (recoveredUser === undefined) {

        //status 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    //status 200
    res.json({ "status": "Patched" });

    transport.sendMail({
        "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
        "to": { "address": userExists.email, "name": userExists.username },
        "subject": `Your ${currentType} just changed`,
        "html": `
        Your user ${currentType} has been changed successfully
        `
    });

    const recoveryDeleted = await RecoveryFactory.deleteOne(recoveryPending.id).catch((err) => {

        console.log(err);

    });

    if (recoveryDeleted === undefined) {

        //status 500
        console.log("Error from confirmRecoveryCallback at recoveryDeleted");
        return;

    };

    if (!recoveryDeleted) {

        console.log("The recovery object could not be deleted");
        return;

    };

};

export const cancelRecoveryCallback: CustomHandler<false, { "id": string }> = async (req, res, next) => {

    const recoveryPending = await RecoveryFactory.deleteOne(req.params.id).catch((err) => {

        console.log(err);

    });

    if (recoveryPending === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (recoveryPending) {

        //status = 201
        res.json({ "status": "Success" });

    } else {

        //status = 200
        res.status(200).json({ "status": "Fail" });

    };

};