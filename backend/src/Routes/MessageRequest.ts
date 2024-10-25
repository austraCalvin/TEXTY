import express, { Router } from "express";
import { CustomRequest } from "../Types/Handler";
import OnlyAuthorized from "./Callback/Auth";
import { getMessageRequestHandler, getMessageRequestListHandler, acceptMessageRequestHandler, declineMessageRequestHandler } from "./Callback/MessageRequest";

const messageRequestRouter = Router();

messageRequestRouter.get("/", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true>;

    getMessageRequestListHandler(authorizedRequest, res, next);

});

messageRequestRouter.get("/:id", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, {"id": string}>;

    getMessageRequestHandler(authorizedRequest, res, next);

});

messageRequestRouter.post("/accept", OnlyAuthorized, express.text(), async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, {}, string>;

    acceptMessageRequestHandler(authorizedRequest, res, next);

});

messageRequestRouter.post("/decline", OnlyAuthorized, express.text(), async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, {}, string>;

    declineMessageRequestHandler(authorizedRequest, res, next);

});

export default messageRequestRouter;