import { PushSubscription } from "web-push";
import UserConnectionFactory from "../../DAO/Entity/User/UserConnection";
import { CustomHandler } from "../../Types/Handler";
import UserFactory from "../../DAO/Entity/User/User";
import UserConfigFactory from "../../DAO/Entity/User/Configuration";
import { userConfigJoiSchema } from "../../hooks/JoiSchema";
import Joi from "joi";

export const isNotificationEnabledHandler: CustomHandler<true, {}> = async (req, res, next) => {
    // { "notify": boolean, "push": boolean, "email": boolean }
    console.log("checkPushSubscriptionHandler began working...");

    const userData = req.user as Express.User;

    const currentUser = await UserFactory.findById(userData.id).catch((err) => {

        console.log(err);

    });

    if (!currentUser) {

        res.json({ "state": "Internal Server Error" });
        return;

    };

    const currentConfig = await currentUser.lookup().catch((err) => {

        console.log(err);

    });

    if (!currentConfig) {

        res.json({ "state": "Internal Server Error" });
        return;

    };

    res.json({ "notify": currentConfig.notify, "push": currentConfig.push, "email": currentConfig.email });

};

export const switchNotifyHandler: CustomHandler<true, { "action": "on" | "off" }> = async (req, res, next) => {

    const userData = req.user as Express.User;

    const currentAction = req.params.action;

    if (!(currentAction === "on" || currentAction === "off")) {

        return;

    };

    const currentUser = await UserFactory.findById(userData.id).catch((err) => {

        console.log(err);

    });

    if (!currentUser) {

        res.json({ "state": "Internal Server Error" });
        return;

    };

    if (!currentUser.configId) {

        const postedConfig = await UserConfigFactory.postOne({ "notify": currentAction === "on" ? true : false }).catch((err) => {

            console.log(err);

        });

        if (!postedConfig) {

            res.json({ "state": "Internal Server Error" });
            return;

        };

        const patchedUser = await UserFactory.patchOne(userData.id, {"configId": postedConfig.id}).catch((err) => {

            console.log(err);

        });

        if (!patchedUser) {

            res.json({ "state": "Internal Server Error" });
            return;

        };

    } else {

        const patchedConfig = await UserConfigFactory.patchOne(currentUser.configId, { "notify": currentAction === "on" ? true : false }).catch((err) => {

            console.log(err);

        });

        if (patchedConfig === undefined) {

            res.json({ "state": "Internal Server Error" });
            return;

        };

        if (patchedConfig === false) {

            res.json({ "state": "Fail" });
            return;

        };

    };

    res.json({ "state": "Success" });

};

type IEnableNotification = { "push": false, "email": boolean, "pushSubscription"?: undefined } | { "push": true, "email": boolean, "pushSubscription": PushSubscription };

export const enableNotificationHandler: CustomHandler<true, {}, IEnableNotification> = async (req, res, next) => {

    console.log("enableNotificationHandler began working...");

    const userData = req.user as Express.User;

    const tailoredSchema: Joi.Schema<{ "push": true, "email": boolean }> = userConfigJoiSchema.tailor("patch");
    const isValid = tailoredSchema.validate(req.body, { "stripUnknown": true });

    if (isValid.error) {

        return Promise.reject(`Error from enableNotificationHandler - joi validation: ${isValid.error.details[0].message}`);

    };

    const enable = isValid.value;

    const currentUser = await UserFactory.findById(userData.id).catch((err) => {

        console.log(err);

    });

    if (!currentUser) {

        res.json({ "state": "Internal Server Error" });
        return;

    };

    if (!currentUser.configId) {

        const postedConfig = await UserConfigFactory.postOne(enable).catch((err) => {

            console.log(err);

        });

        if (!postedConfig) {

            res.json({ "state": "Internal Server Error" });
            return;

        };

        const patchedUser = await UserFactory.patchOne(userData.id, {"configId": postedConfig.id}).catch((err) => {

            console.log(err);

        });

        if (!patchedUser) {

            res.json({ "state": "Internal Server Error" });
            return;

        };

    } else {

        const patchedConfig = await UserConfigFactory.patchOne(currentUser.configId, enable).catch((err) => {

            console.log(err);

        });

        if (patchedConfig === undefined) {

            res.json({ "state": "Internal Server Error" });
            return;

        };

        if (patchedConfig === false) {

            res.json({ "state": "Fail" });
            return;

        };

    };

    const currentConn = await UserConnectionFactory.findById(currentUser.id).catch((err) => {

        console.log(err);

    });

    if (!currentConn) {

        res.json({ "state": "Internal Server Error" });
        return;

    };

    console.log("req.body:", req.body);
    if (req.body.push) {

        currentConn.subscribe(req.body.pushSubscription);

    } else {

        currentConn.unsubscribe();

    };

    res.json({ "state": "Success" });

};