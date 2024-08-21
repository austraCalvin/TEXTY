import mongoose from "mongoose";
import isObject from "./isObject";

function getFilterQueryForMany(model: any) {

    const filterQuery: mongoose.FilterQuery<any> = {};

    for (const prop in model) {

        const currentValue = model[prop as keyof typeof model];

        if (isObject(currentValue) === 2) {

            filterQuery[prop] = { "$in": currentValue };

        };

        filterQuery[prop] = currentValue;

    };

    return filterQuery;

};

export default getFilterQueryForMany;