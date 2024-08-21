import IUser from "../Types/User/User";
import isObject, { ObjectTypes } from "./isObject";

function filterProps<T, K extends keyof T = keyof T>(value: T, propsIn: Array<K>): Pick<T, K> {

    const valueChecked: ObjectTypes = isObject(value);
    const propsInChecked: ObjectTypes = isObject(propsIn);

    if (valueChecked !== 1) {

        throw new TypeError("Error in filterProps function - value param is not valid JSON object");

    };

    // if (propsInChecked !== 2) {

    //     throw new TypeError("Error in filterProps function - propsIn param is not valid JSON array");

    // };

    const selectedProps = JSON.stringify(value, propsIn as string[]),
        filteredObject: T = JSON.parse(selectedProps);

    return filteredObject;

};

// const result = filterProps<IUser>({ "id": "ab", "username": "sdf", "password": "asd", "email": "dfgdfg", "created": new Date(), "lastOnline": new Date() }, ["id"]);

// console.log("result:", result);

export default filterProps;