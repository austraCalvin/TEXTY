import IUser from "./User/User";

export type getManyModel<T, K extends keyof T = keyof T> = { [P in K]?: T[P][] | "$null" | "$max" };

export interface IDAOMethods<T> {

    getMany(model: getManyModel<T>, limit: number): Promise<T[] | null>;
    getMany(model: getManyModel<T>): Promise<T[] | null>;
    getMany(): Promise<T[] | null>
    getOne(model: Partial<T>): Promise<T | null>
    postMany: (model: T[]) => Promise<T[]>
    postOne(model: T): Promise<T>
    // putMany?: (model: T[]) => Promise<T[]>
    // putOne?: (model: T) => Promise<T>
    patchMany: (model: Partial<T>[], update: Partial<T>) => Promise<boolean>
    patchOne: (model: Partial<T>, update: Partial<T>) => Promise<boolean>
    // deleteMany?: (model: T[]) => Promise<void>
    deleteOne(id: number | string): Promise<boolean>

};

// type AndFilterQuery<T = any> = (model: {[keyof K in T]: T[K][]}) => void;

export type ICollectionMethod = <T>(options: T) => IDAOMethods<T>;