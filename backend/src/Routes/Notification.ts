import express, { Router } from "express";
import IUser from "../Types/User/User";
import { CustomRequest } from "../Types/Handler";
import OnlyAuthorized from "./Callback/Auth";
import { isNotificationEnabledHandler, switchNotifyHandler, enableNotificationHandler } from "./Callback/Notification";

const notificationRouter = Router();

notificationRouter.get("/", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true>;

    isNotificationEnabledHandler(authorizedRequest, res, next);

});

notificationRouter.get("/switch/:action", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, {"action": "on" | "off"}>;

    switchNotifyHandler(authorizedRequest, res, next);

});

// notificationRouter.post("/webpush", OnlyAuthorized, express.text(), (req, res, next) => {

//     const authorizedRequest = req as CustomRequest<true>;

//     postPushSubscriptionHandler(authorizedRequest, res, next);

// });

// notificationRouter.delete("/:type", OnlyAuthorized, express.text(), (req, res, next) => {

//     const authorizedRequest = req as CustomRequest<true, {"type": "push" | "email"}>;

//     deletePushSubscriptionHandler(authorizedRequest, res, next);

// });

notificationRouter.post("/", OnlyAuthorized, express.text(), (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true>;

    enableNotificationHandler(authorizedRequest, res, next);

});

export default notificationRouter;