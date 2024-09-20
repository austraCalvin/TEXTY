import express, { Router } from "express";
import IUser from "../Types/User/User";
import { CustomRequest } from "../Types/Handler";
import { getContactListHandler, addContactHandler } from "./Callback/Contact";
import OnlyAuthorized from "./Callback/Auth";

const contactRouter = Router();

contactRouter.get("/", OnlyAuthorized, async (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true>;

    getContactListHandler(authorizedRequest, res, next);

});

contactRouter.post("/add", OnlyAuthorized, express.text(), (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, {}, string>;

    addContactHandler(authorizedRequest, res, next);

});

export default contactRouter;