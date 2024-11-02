import express, { Router } from "express";
import { checkRegistrationCallback, requestRegistrationCallback, validateRegistrationCodeCallback, confirmRegistrationCallback, cancelRegistrationCallback, checkRegistrationUsernameCallback } from "./Callback/Registration"
import { IPOSTUser } from "../Types/User/User";
import { CustomRequest } from "../Types/Handler";

const registrationRouter = Router();

registrationRouter.post("/", express.text(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, {}, string>;

    requestRegistrationCallback(unAuthorizedRequest, res, next);

});

registrationRouter.get("/:id", (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }>;

    checkRegistrationCallback(unAuthorizedRequest, res, next);

});

registrationRouter.post("/:id", express.text(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }, string>;

    validateRegistrationCodeCallback(unAuthorizedRequest, res, next);

});

registrationRouter.post("/confirm/:id", express.json(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }, Omit<IPOSTUser, "email"> & { "code": number }>;

    confirmRegistrationCallback(unAuthorizedRequest, res, next);

});

registrationRouter.get("/cancel/:id", (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, { "id": string }>;

    cancelRegistrationCallback(unAuthorizedRequest, res, next);

});

registrationRouter.post("/username/:username", express.text(), (req, res, next) => {

    const unAuthorizedRequest = req as CustomRequest<false, {}, string>;

    checkRegistrationUsernameCallback(unAuthorizedRequest, res, next);

});

export default registrationRouter;