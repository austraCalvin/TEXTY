import Joi from "joi";
import UserFactory from "../../DAO/Entity/User/User";
import UserContactsUserFactory from "../../DAO/Entity/User/UserContactsUser";
import { CustomHandler } from "../../Types/Handler";

export const addContactHandler: CustomHandler<true, {}, string> = async (req, res, next) => {

    const isValid = Joi.string().min(3).validate(req.body);

    if (isValid.error) {

        console.log(`Error from addContactHandlerCallback - joi validation: ${isValid.error.details[0].message}`);
        console.log("username field:", req.body);

        res.json({ "status": "Bad Request", "message": "The field must be a string and have at least three characters" });
        return;

    };

    const username = isValid.value;

    const currentUser = (req as Express.AuthenticatedRequest).user;

    if (currentUser.username === username) {

        res.json({ "status": "Bad Request", "message": "You can't add yourself as a contact" });
        return;

    };

    const contactUser = await UserFactory.findByUsername(username).catch((err) => {

        console.log(err);

    });

    if (!contactUser) {

        res.json({ "status": "Not Found", "message": "This username does not exist" });
        return;

    };

    const isContact = await UserContactsUserFactory.findByUserIds(currentUser.id, contactUser.id).catch((err) => {

        console.log(err);

    });

    if (isContact === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (isContact) {

        res.json({ "status": "Exists", "message": "This user has already been added to your contact list" });
        return;

    };

    const postedContact = await UserContactsUserFactory.postOne({ "userId": currentUser.id, "contactId": contactUser.id, "name": contactUser.name }).catch((err) => {

        console.log(err);

    });

    if (!postedContact) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    res.json({ "status": "Created", "data": {...JSON.parse(JSON.stringify(postedContact)), "chatId": postedContact.contactId} });

};

export const getContactListHandler: CustomHandler<true> = async (req, res, next) => {

    const currentUser = req.user as Express.User;

    const contactList = await UserContactsUserFactory.find({ "userId": [currentUser.id] }).catch((err) => {

        console.log(err);

    });

    if (contactList === undefined) {

        return;

    };

    if (contactList === null) {

        res.json([]);
        return;

    };

    console.log(`getContactListHandler - contactList has value=${contactList[0] ? "yes" : "no"}`);
    console.log("array:", contactList);

    if (contactList.length === 0) {

        res.json([]);
        return;

    };

    res.json(contactList.map((val) => ({
        "id": val.id,
        "userId": val.contactId,
        "type": "contact",
        "name": val.name,
        "description": ""
    })));

};

export const getContactHandler: CustomHandler<true, {"id": string}> = async (req, res, next) => {

    const contactUser = await UserFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (contactUser === undefined) {

        res.json({"status": "Internal Server Error"});
        return;
        
    };

    if (contactUser === null) {

        res.json({"status": "Not Found"});
        return;

    };

    res.json(contactUser)

};