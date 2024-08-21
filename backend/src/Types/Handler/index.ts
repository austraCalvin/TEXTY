import { NextFunction, Request, Response } from "express";
import QueryString from "qs"

export interface UnauthorizedHandler {
    <
        P = {},
    >
        (
            req: Request<P, any, any, QueryString.ParsedQs, Record<string, any>> & { user?: Express.User },
            res: Response<any, Record<string, any>>,
            next: NextFunction,
        ): void;
};

export interface CustomHandler<
    isAuth extends boolean = false,
    P = {},
    ReqBody = any,
    LocalsObj extends Record<string, any> = Record<string, any>,
> {
    (
        req: Request<P, any, ReqBody, QueryString.ParsedQs, LocalsObj> & (isAuth extends true ? { user: Express.User } : { user?: undefined }),
        res: Response<any, LocalsObj>,
        next: NextFunction,
    ): void;
};

export type CustomRequest<isAuth extends boolean = false, Params = {}, ReqBody = any> = Request<Params, any, ReqBody, QueryString.ParsedQs, Record<string, any>> & (isAuth extends true ? { user: Express.User } : { user?: undefined });