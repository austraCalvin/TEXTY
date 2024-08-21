import mongoose, { ConnectionStates } from "mongoose";
import { ServiceDataBaseOptions, DataBaseOptions, ICollection } from "../../Types/DataBase";
import { IDAOMethods } from "../../Types/IDAOMethods";
import IUserConnection from "../../Types/User/UserConnection";
import ModelFactory, { SessionStorageModel } from "./Model";
import IFile from "../../Types/Message/File";

abstract class DataBase {

    private static finished: boolean = true;
    private static online: boolean = false;
    private static strategy: ServiceDataBaseOptions = this.useDb("mongodb");
    public static dbName?: DataBaseOptions;
    private static asPromise: Promise<typeof DataBase>;

    static isOnline(): Promise<typeof DataBase> {

        if (!this.asPromise) {

            if (this.online) {

                return Promise.resolve(this);

            };

            return Promise.reject("offline");

        };

        return this.asPromise;

    };

    static useDb(dbName: DataBaseOptions): typeof DataBase {

        if (typeof dbName !== "string") {

            throw new TypeError("name parameter must be a string");

        };

        if (!(this.finished)) {

            console.log("unfinished promise");
            return this;

        };

        const localPromise: Promise<typeof DataBase> = new Promise((success, danger) => {

            switch (dbName) {

                case "mongodb":

                    if (dbName === this.dbName) {

                        return success(this);

                    };

                    this.strategy = ModelFactory.dataBase("mongodb");
                    const connection = mongoose.connection;

                    const connectionState: ConnectionStates = connection.readyState;

                    if (connectionState === 1) {

                        this.online = true;
                        success(this);

                    } else {

                        this.online = false;

                    };

                    connection.on("open", () => {

                        console.log(`dbName='${dbName}' - event='open'`);
                        this.online = true;
                        success(this);

                    });

                    connection.on("reconnected", () => {

                        console.log(`dbName='${dbName}' - event='reconnected'`);
                        this.online = true;

                    });

                    connection.on("close", () => {

                        console.log(`dbName='${dbName}' - event='closed'`);
                        this.online = false;

                    });

                    connection.on("disconnected", () => {

                        console.log(`dbName='${dbName}' - event='disconnected'`);
                        this.online = false;

                    });

                    connection.on("error", () => {

                        console.log(`dbName='${dbName}' - event='error'`);
                        this.online = false;
                        danger(`dbName='${dbName}' - error`);

                    });

                    break;
                case "session-storage":

                    if (dbName === this.dbName) {

                        return success(this);

                    };

                    this.strategy = ModelFactory.dataBase("session-storage");
                    this.online = true;
                    success(this);
                    break;

            };

        });

        this.finished = false;

        // localPromise.finally(() => {

        //     this.finished = true;

        // });

        // localPromise.catch((err) => {

        //     console.log("pre-made error message");

        // })

        // localPromise.catch((err) => {

        //     console.log("pre-made error message");

        // }).finally(() => {

        //     this.finished = true;

        // });

        this.dbName = dbName;

        this.asPromise = localPromise;

        this.collection = this.strategy.collection.bind({});

        return this;

    };

    static collection: ICollection = this.strategy.collection.bind({});

};

export abstract class SessionStorageDB {

    private static db: SessionStorageModel = ModelFactory.dataBase("session-storage");

    static collection: ICollection & {
        (name: "userConnections"): IDAOMethods<IUserConnection>;
        (name: "files-content"): IDAOMethods<IFile>;
    }
        = this.db.collection.bind({});

};

export default DataBase;