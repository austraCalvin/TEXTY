import Joi from "joi";
import RegistrationFactory from "../../DAO/Entity/Temp/Registration";
import UserFactory from "../../DAO/Entity/User/User";
import { CustomHandler } from "../../Types/Handler";
import { IPOSTUser } from "../../Types/User/User";
import transport from "../../nodemailer";

export const requestRegistrationCallback: CustomHandler<false, {}, string> = async (req, res, next) => {

    const isValid = Joi.string().email().validate(req.body);

    if (isValid.error) {

        console.log(`Error from requestRegistrationCallback - joi validation: ${isValid.error.details[0].message}`);
        console.log("email field:", req.body);

        res.json({ "status": "Bad Request" });
        return;

    };

    const insertedEmail = isValid.value;

    const userExists = await UserFactory.findByEmail(insertedEmail).catch((err) => {

        console.log(err);

    });

    if (userExists === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (userExists) {

        res.json({ "status": "Exists" });
        return;

    };

    const newRegistration = await RegistrationFactory.postOne({ "email": insertedEmail }).catch((err) => {

        console.log(err);

    });

    if (newRegistration === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    res.json({ "status": "Created" });

    transport.sendMail({
        "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
        "to": newRegistration.email,
        "subject": "Confirm registration",
        "html": `<a href="http://localhost:3000/registration/confirm/${newRegistration.id}">confirm</a>
    REGISTRATION CODE
    <h2>${newRegistration.code}</h2>
    <br/>
    <br/>
    <a href="http://localhost:3000/registration/cancel/${newRegistration.id}">cancel</a>
    `
    });

};
export const checkRegistrationCallback: CustomHandler<false, { "id": string }> = async (req, res, next) => {

    const registrationExists = await RegistrationFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (registrationExists === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (registrationExists) {

        res.json({ "status": "OK" });
        return;

    };

    res.json({ "status": "Not Found", "message": "The registration does not exist" });

};

export const validateRegistrationCodeCallback: CustomHandler<false, { "id": string }, string> = async (req, res, next) => {

    const registrationPending = await RegistrationFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (registrationPending === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (registrationPending === null) {

        //status = 204
        res.json({ "status": "Not Found" });
        return;

    };

    if (!(/^\d+$/.test(req.body))) {

        res.json({ "status": "Bad Request" });
        return;

    };

    const insertedCode = Number(req.body);

    if (!(insertedCode === registrationPending.code)) {

        res.json({ "status": "Unauthorized" });

        const currentRegistrationCode = Math.round(Math.random() * 100000000);

        const updatedRegistration = await RegistrationFactory.patchOne(req.params.id, currentRegistrationCode).catch((err) => {

            console.log(err);

        });

        if (updatedRegistration === undefined) {

            console.log("Error from confirmRegistrationCallback at RegistrationFactory.patchOne - rejected");
            return;

        };

        if (updatedRegistration === false) {

            console.log("Error from confirmRegistrationCallback at RegistrationFactory.patchOne - NOT acknowledged");
            return;

        };

        if (updatedRegistration === true) {

            transport.sendMail({
                "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
                "to": registrationPending.email,
                "subject": "Registration code just changed",
                "html": `
                <h1>CURRENT REGISTRATION CODE</h1>
                <p>${currentRegistrationCode}</p>
                `
            })

        };

        return;

    };

    res.json({ "status": "Authorized" });

};

export const confirmRegistrationCallback: CustomHandler<false, { "id": string }, Omit<IPOSTUser, "email"> & { "code": number }> = async (req, res, next) => {

    console.log("whatever:", req.body);

    const registrationPending = await RegistrationFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (registrationPending === undefined) {

        res.status(500).json({ "status": "Internal Server Error" });
        return;

    };

    if (registrationPending === null) {

        res.json({ "status": "Not Found" });
        return;

    };

    const userExists = await UserFactory.findByUsernameAndEmail(req.body.username, registrationPending.email).catch((err) => {

        console.log(err);

    });

    if (userExists === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (userExists) {

        if (userExists.username || userExists.email) {

            const fieldUsed = userExists.username ? "username" : userExists.email ? "email" : "";

            res.json({ "status": "Bad Request", "message": `${fieldUsed} is already in use` });
            // return done(`${errorOrigin} - ${fieldUsed} is already in use`, false);

        } else if (userExists.username && userExists.email) {


            res.json({ "status": "Bad Request", "message": `username and email are already in use` });
            // return done(`${errorOrigin} - username and email are already in use`, false);


        };

        return;

    };

    const signupUser = await UserFactory.postOne({ "username": req.body.username, "password": req.body.password, "email": registrationPending.email, "name": req.body.name }).catch((err) => {

        console.log(err);

    });

    if (signupUser === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    //status = 201
    res.json({ "status": "Created" });
    // done(null, signupUser);

    transport.sendMail({
        "from": { "address": "alexandrerivero16@gmail.com", "name": "texty" },
        "to": { "address": signupUser.email, "name": signupUser.username },
        "subject": "Registration",
        "html": `
        Your user account has been registered successfully
        `
    });

    //registrationSuccededAndDeleted
    const registrationDeleted = await RegistrationFactory.deleteOne(registrationPending.id).catch((err) => {

        console.log(err);

    });

    if (registrationDeleted === undefined) {

        //status 500
        console.log("Error from confirmRegistrationCallback at registrationDeleted");
        return;

    };

    if (registrationDeleted) {

        console.log("The registration object could not be deleted");
        return;

    };

};

export const cancelRegistrationCallback: CustomHandler<false, { "id": string }> = async (req, res, next) => {

    const registrationPending = await RegistrationFactory.deleteOne(req.params.id).catch((err) => {

        console.log(err);

    });

    if (registrationPending === undefined) {

        //status = 500
        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (registrationPending) {

        //status = 201
        res.json({ "status": "Success" });

    } else {

        //status = 200
        res.json({ "status": "Fail" });

    };

};