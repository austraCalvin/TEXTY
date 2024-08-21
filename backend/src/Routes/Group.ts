import express, { Router } from "express";
import { CustomRequest } from "../Types/Handler";
import { postGroupHandler, getJoinListHandler, getGroupListHandler } from "../routescb";
import OnlyAuthorized from "./Callback/Auth";

const groupRouter = Router();

groupRouter.post("/", OnlyAuthorized, express.json(), (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, {}, { "name": string, "description": string, "invitations": string[] }>;

    postGroupHandler(authorizedRequest, res, next);

});

groupRouter.get("/:id", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, { "id": string }>;

    getJoinListHandler(authorizedRequest, res, next);

});

groupRouter.get("/", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true>;

    getGroupListHandler(authorizedRequest, res, next);

});

export default groupRouter;