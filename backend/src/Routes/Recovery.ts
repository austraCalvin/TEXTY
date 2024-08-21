import express, { Router } from "express";
import IUser from "../Types/User/User";
import { CustomRequest } from "../Types/Handler";
import { IPOSTRecovery } from "../Types/Temp/Recovery";
import { requestRecoveryCallback, checkRecoveryCallback, validateRecoveryCodeCallback, confirmRecoveryCallback, cancelRecoveryCallback } from "./Callback/Recovery";

const recoveryRouter = Router();

recoveryRouter.post("/", express.text(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, {}, IPOSTRecovery>;

    requestRecoveryCallback(unAuthorizedRequest, res, next);

});

recoveryRouter.get("/:id", (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }>;

    checkRecoveryCallback(unAuthorizedRequest, res, next);

});

recoveryRouter.post("/:id", express.text(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }, string>;

    validateRecoveryCodeCallback(unAuthorizedRequest, res, next);

});

recoveryRouter.post("/confirm/:id", express.json(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }, { "password": IUser["password"], "code": number }>;

    confirmRecoveryCallback(unAuthorizedRequest, res, next);

});

recoveryRouter.get("/cancel/:id", (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }>;

    cancelRecoveryCallback(unAuthorizedRequest, res, next);

});

export default recoveryRouter;