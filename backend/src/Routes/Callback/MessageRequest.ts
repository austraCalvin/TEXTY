import { CustomHandler } from "../../Types/Handler";
import UserFactory from "../../DAO/Entity/User/User";
import MessageRequestFactory from "../../DAO/Entity/Message/Request";
import UserContactsUserFactory from "../../DAO/Entity/User/UserContactsUser";
import UserConnectionFactory from "../../DAO/Entity/User/UserConnection";

export const getMessageRequestListHandler: CustomHandler<true, {}> = async (req, res, next) => {

    console.log("getMessageRequestListHandler began working...");

    const userData = req.user as Express.User;

    const currentUser = await UserFactory.findById(userData.id).catch((err) => {

        console.log(err);

    });

    if (!currentUser) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    const messageRequests = await MessageRequestFactory.find({ "contactId": [currentUser.id] }).catch((err) => {

        console.log(err);

    });

    if (messageRequests === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (messageRequests === null) {

        res.json([]);
        return;

    };

    console.log("message-requests:", messageRequests);
    console.log("message-requests:", JSON.parse(JSON.stringify(messageRequests)))

    res.json(messageRequests.map((element, index) => {

        if (userData.id === element.contactId) {

            return { ...element, "contactId": undefined }

        } else {

            return { ...element, "userId": undefined }

        };

    }));

};

export const getMessageRequestHandler: CustomHandler<true, { "id": string }> = async (req, res, next) => {

    const messageRequest = await MessageRequestFactory.findById(req.params.id).catch((err) => {

        console.log(err);

    });

    if (messageRequest === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (messageRequest === null) {

        res.json({ "status": "Not Found" });
        return;

    };

    res.json(messageRequest);

};

export const acceptMessageRequestHandler: CustomHandler<true, {}, string> = async (req, res, next) => {

    const messageRequest = await MessageRequestFactory.findById(req.body).catch((err) => {

        console.log(err);

    });

    if (messageRequest === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (messageRequest === null) {

        res.json({ "status": "Not Found", "message": "The message request does not exist" });
        return;

    };

    // const userData = req.user as Express.User;

    const currentUser = await UserFactory.findById(messageRequest.contactId).catch((err) => {

        console.log(err);

    });

    const contactUser = await UserFactory.findById(messageRequest.userId).catch((err) => {

        console.log(err);

    });

    if (!currentUser || !contactUser) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    const userContactsUser = await UserContactsUserFactory.postOne({ "userId": messageRequest.contactId, "contactId": messageRequest.userId, "name": contactUser.name ? contactUser.name : contactUser.username }).catch((err) => {

        console.log(err);

    });

    if (!userContactsUser) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    const deletedMessageRequest = await MessageRequestFactory.deleteOne(messageRequest.id).catch((err) => {

        console.log(err);

    });

    if (deletedMessageRequest === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (deletedMessageRequest === false) {

        res.json({ "status": "Fail", "message": "The message request could not be deleted" });
        return;

    };

    res.json({ "status": "Success", "data": { "id": userContactsUser.id, "userId": userContactsUser.contactId, "type": "contact", "name": userContactsUser.name, "description": "random" } });

};

export const declineMessageRequestHandler: CustomHandler<true, {}, string> = async (req, res, next) => {

    const messageRequest = await MessageRequestFactory.findById(req.body).catch((err) => {

        console.log(err);

    });

    if (messageRequest === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (messageRequest === null) {

        res.json({ "status": "Not Found", "message": "The message request does not exist" });
        return;

    };

    const isDeleted = await MessageRequestFactory.deleteOne(req.body).catch((err) => {

        console.log(err);

    });

    if (isDeleted === undefined) {

        res.json({ "status": "Internal Server Error" });
        return;

    };

    if (isDeleted) {

        res.json({ "status": "Success" });

        const userConnections = await UserConnectionFactory.find([messageRequest.userId, messageRequest.contactId]).catch((err) => {

            console.log(err);

        });

        if (!userConnections) {

            res.json({ "status": "Internal Server Error" });
            return;

        };

        userConnections.forEach((e) => {

            if (e.online) {

                e.conn?.emit("drop-message-request", messageRequest.id);

            };

        });

    } else {

        res.json({ "status": "Fail", "message": "The message request could not be deleted" });

    };

    return;

};