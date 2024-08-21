function isJSONString(param: string): boolean {

    try {

        JSON.parse(param);
        return true;

    } catch (err) {

        return false;

    };

};

export default isJSONString;