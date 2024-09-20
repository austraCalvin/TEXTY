import * as http from "http";
import express, { Request } from "express";
import cors from "cors";
import { Server } from "socket.io";
import expressSession, { type SessionOptions } from "express-session";
import type { IServerToClientEvents, IClientToServerEvents, IInterServerEvents } from "./Types/SocketEvents";
import path from "path";
import DataBase from "./DAO/DataBase/Config";
import passport from "passport";
import passportStrategy from "passport-local"
import IUser, { IPOSTUser } from "./Types/User/User";
import UserConnectionFactory from "./DAO/Entity/User/UserConnection";
import cookieParser from "cookie-parser";
import webpush from "web-push";
import { backupChatCallback } from "./routescb";
import * as passportCallback from "./passport";
import registrationRouter from "./Routes/Registration";
import recoveryRouter from "./Routes/Recovery";
import OnlyAuthorized from "./Routes/Callback/Auth";
import { CustomRequest } from "./Types/Handler";
import contactRouter from "./Routes/Contact";
import groupRouter from "./Routes/Group";
import notificationRouter from "./Routes/Notification";
// import { promisify } from 'util';

// declare global {

//     namespace Express {

//         interface User extends IPOSTUser {
//             "id": string;
//         }

//     }

// };

declare module "express-session" {
    interface SessionData {
        count: number;
        userId: IUser["id"];
    }
}

const appVapidKeys = {
    "public": "BPKZs4zBSew-sYH3EAt9sdxFRoTUL_rpraR23wG3UtAZg9_1OgGJqyUuVJ493rt9tPquPiSM3D3xK0z_oPUelg0",
    "private": "Us-iMeIfHok02D3yjAgAuA8LKC7k5WT5FxNnznWqO8c"
},
    appPort = process.env.PORT || process.env.app_port || 27018,
    appIP = process.env.IP || process.env.app_ip || "localhost";

webpush.setVapidDetails("mailto: alexandrerivero16@gmail.com", appVapidKeys.public, appVapidKeys.private);

const app = express();

// passport.use("signup", new passportStrategy.Strategy({ "passReqToCallback": true }, passportCallback.signup));

passport.use("login", new passportStrategy.Strategy({ "passReqToCallback": true }, passportCallback.login));

passport.serializeUser<string>(passportCallback.serializeUser);

passport.deserializeUser<string>(passportCallback.deserializeUser);

const sessionConfig: SessionOptions = {
    "name": "chatapp",
    "secret": "diosa",
    "resave": false,
    "rolling": true,
    "saveUninitialized": true,
    "cookie": {
        "maxAge": 10 * 60 * 1000,
        "httpOnly": false,
        "secure": false,
        "sameSite": false,
        "path": "/",
        "domain": "localhost"
    }
};

const customSession = expressSession(sessionConfig);

// app.use(express.urlencoded({ "extended": true }));
app.use(express.static(path.join(__dirname, "/upload")));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("diosa"));
app.use(customSession);
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors(corsConfig));

app.use(cors((req, done) => {

    const { headers: { origin }, method } = req;

    console.log("origin from cors callback --->");
    // console.log("cors origin:", origin);
    // console.log("cors method:", method);
    console.table({ "origin": origin, "url": req.url, "method": method });
    console.log("credentials header:", req.headers["access-control-allow-credentials"]);

    done(null, {
        "origin": true,
        "credentials": true,
        "methods": ["get", "post", "patch", "put", "delete"]
    });

}));

// type CustomRequest<isAuth extends boolean = false, Params = {}, ReqBody = any> = Request<Params, any, ReqBody, QueryString.ParsedQs, Record<string, any>> & (isAuth extends true ? { user: Express.User } : { user?: undefined });

app.use("/registration", registrationRouter);

app.use("/recovery", recoveryRouter);

app.use("/contact", contactRouter);

app.use("/group", groupRouter);

app.use("/notification", notificationRouter);

app.post("/logout", (req, res) => {

    req.logOut((err) => {

        if (err) {

            res.json({ "state": "Fail" });
            return;

        };

        res.json({ "state": "Success" });

    });

});

app.get("/isAuthenticated", (req, res) => {

    const currentSession = req.session;
    const previousCount = req.session.count || 0;

    console.log("checking authentication");

    console.log("session:", req.session);
    console.log("server session-id:", req.session.id);

    currentSession.count = previousCount + 1;
    // currentSession.userId = "random";

    console.log("current user:", !!req.user ? req.user : "none");
    console.log(!!req.isAuthenticated);

    // console.log("credentials header:", req.headers["access-control-allow-credentials"]);

    const userId = req.session.userId;

    console.log("session user-id:", userId ? userId : "none");

    if (req.isAuthenticated()) {

        console.log("the current user is authenticated");
        res.status(200).json({ "state": "Authorized" });

    } else {

        console.log("the current user is NOT authenticated");
        res.status(200).json({ "state": "Unauthorized" });

    };

    console.log("count:", previousCount);

});

app.post("/login", express.json(), passport.authenticate("login"), (req, res) => {

    if (req.isAuthenticated()) {

        console.log("User has been logged in");
        console.log("User:", req.user ? req.user : "none");
        req.session.userId = req.user.id;

        res.status(200).send("Correct");

    } else {

        console.log("User has NOT been logged in");
        res.status(401).send("Incorrect");

    };

});

app.get("/backup/chat/:chatId", OnlyAuthorized, (req, res, next) => {

    const authorizedRequest = req as CustomRequest<true, { "chatId": string }>

    backupChatCallback(authorizedRequest, res, next);

});

app.all("*", (req, res) => {

    req.session;
    console.log("origin:", req.headers.origin);
    console.log("url", req.url);

    res.sendStatus(404);

});

const httpServer = http.createServer({}, app);

const socketIOServer = new Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents>(httpServer, {
    "cors": {
        "origin": ["http://localhost:3000"],
        "methods": ["GET", "POST"],
        "credentials": true
    }
});

socketIOServer.engine.use(customSession);
socketIOServer.engine.use(passport.session());
// socketIOServer.engine.use(cors({ "origin": ["http://localhost:3000"], "credentials": true }));

socketIOServer.on("connection", (userSocket) => {

    const userSession = userSocket.request as Request;

    console.log("SOCKET CONNECTION ----->");
    console.log("user:", userSession.user);
    console.log("session:", userSession.session);

    if (!userSession.user) {

        console.log("socket ---> user is NOT authenticated - user object does NOT exist");
        return;

    };

    if (userSession.isAuthenticated()) {

        console.log("socket ---> user is authenticated");

        UserConnectionFactory.listen(userSession.user.id, userSocket).then((e) => {

            console.log("socket is listening to events");

        }).catch((err) => {

            console.log("UserConnection failed connecting!");
            console.log("Error message:", err);

        });

    } else {

        console.log("socket ---> user is NOT authenticated");

    };

});

DataBase.isOnline().then((success) => {

    console.log(`successfully connected to ${success.dbName}`)

    httpServer.listen(appPort, () => {

        console.log(`server is listening at http://${appIP}:${appPort}`);

    });
    // socketIOServer.listen(httpServer);

}).catch((err) => {

    console.log("connection to database failed - ", err);

});