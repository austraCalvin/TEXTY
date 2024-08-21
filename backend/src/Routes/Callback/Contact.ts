import UserFactory from "../../DAO/Entity/User/User";
import UserContactsUserFactory from "../../DAO/Entity/User/UserContactsUser";
import { CustomHandler } from "../../Types/Handler";

export const addContactHandler: CustomHandler<true, { "username": string }> = async (req, res, next) => {

    const currentUser = (req as Express.AuthenticatedRequest).user;

    console.log("user is allowed to do");

    const { username } = req.params;

    const contactUser = await UserFactory.findByUsername(username).catch((err) => {

        console.log(err);

    });

    if (!contactUser) {

        return;

    };

    console.log("checking param:", username);

    const postedContact = await UserContactsUserFactory.postOne({ "userId": currentUser.id, "contactId": contactUser.id, "name": username }).catch((err) => {

        console.log(err);

    });

    if (!postedContact) {

        return;

    };

    res.json(postedContact);

};

export const getContactListHandler: CustomHandler<true> = async (req, res, next) => {

    console.log("getContactListHandler began working...");

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