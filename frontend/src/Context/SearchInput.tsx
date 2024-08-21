import React, { createContext, useState } from "react";

interface ISortContext {

    "sort": string;
    "isFocused": boolean;
    "inputOnFocus": ()=>void;
    "inputOnBlur": ()=>void;
    "inputOnChange": (e: React.ChangeEvent<HTMLInputElement>) => void;

};

export const SortContext = createContext<ISortContext>({
    "sort": "",
    "isFocused": false,
    "inputOnFocus": ()=>{},
    "inputOnBlur": ()=>{},
    "inputOnChange": ()=>{}
});

interface ICSortContextProps {

    "children": React.ReactNode;

};

const CSortContext = (props: ICSortContextProps) => {

    const [sort, setSort] = useState<ISortContext["sort"]>("");
    const [isFocused, setFocused] = React.useState<ISortContext["isFocused"]>(false);

    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(e.currentTarget.value) === "[object String]")) {

            return;

        };

        setSort(currentValue);

    };

    const inputOnFocus = React.useCallback(() => {

        setFocused(true);

    }, []);

    const inputOnBlur = React.useCallback(() => {

        setFocused(false);

    }, []);

    return (<SortContext.Provider value={{
        sort,
        isFocused,
        inputOnChange,
        inputOnFocus,
        inputOnBlur
    }}>

        {props.children}

    </SortContext.Provider>)

};

export default CSortContext;