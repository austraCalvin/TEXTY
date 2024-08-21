import isJSONString from "./isJSONString";

/**
 * 
 * The function checks if `string` is a valid JavaScript Object Notation (JSON) string, if so, converts `string` into an object or array and if not, returns null.
 * 
 * @param string The string to convert.
 * @returns The JSON string converted into an object or null.
 */

function JSONParse(string: string): any {

    if (isJSONString(string)) {

        return JSON.parse(string);

    };

    return null;

};

export default JSONParse;