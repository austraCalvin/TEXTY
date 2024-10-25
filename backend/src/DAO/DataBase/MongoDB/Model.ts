import { getManyModel } from "../../../Types/IDAOMethods";
import mongoose from "mongoose";
import isObject from "../../../hooks/isObject";
import { EntityReturnTypeMany, EntityReturnTypeOne, MongoDbEntity } from "../../../Types/DBEntities";

export abstract class MongoDBEntityTemplate<T extends MongoDbEntity> {

    protected readonly connection: mongoose.Connection;
    protected abstract readonly collection: mongoose.Model<any>;
    protected online: boolean;
    protected abstract readonly errorOrigin: string;

    constructor() {

        this.online = false;
        this.connection = mongoose.connection;

        if (this.connection) {

            const connectionState: mongoose.ConnectionStates = this.connection.readyState;

            if (connectionState === 1) {

                this.online = true;

            } else {

                this.online = false;

            };

            this.connection.on("open", () => {

                this.online = true;

            });

            this.connection.on("reconnected", () => {

                this.online = true;

            });

            this.connection.on("close", () => {

                this.online = false;

            });

            this.connection.on("disconnected", () => {

                this.online = false;

            });

            this.connection.on("error", () => {

                this.online = false;

            });

        };

    };

    async getMany(model: getManyModel<T>, limit: number): Promise<EntityReturnTypeMany<T> | null>;

    async getMany(model: getManyModel<T>): Promise<EntityReturnTypeMany<T> | null>;

    async getMany(): Promise<EntityReturnTypeMany<T> | null>;

    async getMany(model?: getManyModel<T>, limit?: number): Promise<EntityReturnTypeMany<T> | null> {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        let collection: any[] | void;

        const filterQuery: mongoose.FilterQuery<MongoDbEntity> = {};

        for (const prop in model) {

            const currentValue = model[prop as keyof T];

            if (isObject(currentValue) === 2) {

                if ((currentValue as T[keyof T][])[1]) {

                    filterQuery[prop] = { "$in": currentValue };
                    continue;

                };

            };

            if (currentValue === "$null") {

                filterQuery[prop] = { "$not": { "$eq": null } };

            } else {

                filterQuery[prop] = { "$eq": currentValue ? currentValue[0] : null };

            };


        };

        console.log("model:", model);
        console.log("filter-query:", filterQuery);

        if (limit) {

            collection = await this.collection.find(model ? filterQuery : {}).limit(limit).lean().catch((err) => { });

        } else {

            collection = await this.collection.find(model ? filterQuery : {}).lean().catch((err) => {

            });

        };

        if (!collection) {

            return Promise.reject(`${this.errorOrigin} at method getMany - rejected`);

        };

        if (!collection.length) {

            return Promise.resolve(null);

        };

        return Promise.resolve(collection as EntityReturnTypeMany<T>);

    };

    async getOne(model: Partial<T>) {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        const foundElement = await (this.collection.findOne(model).lean() as Promise<any>).catch((err) => { });

        if (foundElement === undefined) {

            return Promise.reject(`${this.errorOrigin} at method getOne - rejected`);

        };

        if (foundElement === null) {

            return Promise.resolve(null);

        };

        return Promise.resolve(foundElement as EntityReturnTypeOne<T>);

    };

    async postMany(models: T[]) {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        const postedArray = await this.collection.insertMany(models).catch((err) => { });

        if (!postedArray) {

            return Promise.reject(`${this.errorOrigin} at method postMany - rejected`);

        };

        if (!postedArray.length) {

            return Promise.reject(`${this.errorOrigin} at method postMany - not inserted`);

        };

        return Promise.resolve(postedArray as EntityReturnTypeMany<T>);

    };

    async postOne(model: T) {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        const postedArray = await this.collection.insertMany([model]).catch((err) => { });

        if (!postedArray) {

            return Promise.reject(`${this.errorOrigin} at method postOne - rejected`);

        };

        if (!postedArray.length) {

            return Promise.reject(`${this.errorOrigin} at method postOne - not inserted`);

        };

        console.log("postedArray:", postedArray);

        return Promise.resolve(postedArray[0] as EntityReturnTypeOne<T>);

    };

    async patchMany(model: Partial<T>[], update: Partial<T>): Promise<boolean> {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        let filterParam: Partial<Record<keyof T, any>> = {};

        if (model[1]) {

            for (const props in model[0]) {

                const property = props as keyof T;

                for (const each of model) {

                    if (!filterParam[property]) {

                        filterParam[property] = {
                            "$in": []
                        };

                    };

                    filterParam[property]["$in"] = [...filterParam[property]["$in"], each[property]];

                };

            };

        } else if (model[0]) {

            filterParam = model[0];

        };

        const patchedElement = await this.collection.updateOne(filterParam, { "$set": update }).catch((err) => { });

        if (!patchedElement) {

            return Promise.reject(`${this.errorOrigin} at method patchOne - rejected`);

        };

        if (!patchedElement.acknowledged) {

            return Promise.reject(`${this.errorOrigin} at method patchOne - not acknowledge`);

        };

        if (patchedElement.modifiedCount !== 1) {

            return Promise.resolve(false);

        };

        return Promise.resolve(true);

    };

    async patchOne(model: Partial<T>, update: Partial<T>): Promise<boolean> {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        const patchedElement = await this.collection.updateOne(model, { "$set": update }).catch((err) => { });

        if (!patchedElement) {

            return Promise.reject(`${this.errorOrigin} at method patchOne - rejected`);

        };

        if (!patchedElement.acknowledged) {

            return Promise.reject(`${this.errorOrigin} at method patchOne - not acknowledge`);

        };

        if (patchedElement.modifiedCount !== 1) {

            return Promise.resolve(false);

        };

        return Promise.resolve(true);

    };

    async deleteOne(modelId: string): Promise<boolean> {

        if (!this.online) {

            return Promise.reject(`${this.errorOrigin} - offline`);

        };

        const deletedElement = await this.collection.deleteOne({ "id": modelId }).catch((err) => { });

        if (!deletedElement) {

            return Promise.reject(`${this.errorOrigin} at method deleteOne - rejected`);

        };

        if (!deletedElement.acknowledged) {

            return Promise.reject(`${this.errorOrigin} at method deleteOne - not acknowledged`);

        };

        if (deletedElement.deletedCount !== 1) {

            return Promise.resolve(false);

        };

        return Promise.resolve(true);

    };

};