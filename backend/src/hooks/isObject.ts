/**
 * Object types
 * 
 * - invalid = 0
 * - object = 1
 * - array = 2
 */

export enum ObjectTypes {

    invalid = 0,
    object = 1,
    array = 2,

};

function isObject(param:any): ObjectTypes {

    if (Object.prototype.toString.call(param) === "[object Object]") {

        return 1;

    };

    if (Object.prototype.toString.call(param) === "[object Array]") {

        return 2;

    };

    return 0;

};

export default isObject;