import React, { createContext, useState } from "react";

interface ISortContext {

    "inputRef": React.RefObject<HTMLInputElement> | undefined;
    "sort": string;
    "isFocused": boolean;
    "inputOnFocus": (e: React.FocusEvent<HTMLInputElement>) => void;
    "inputOnBlur": () => void;
    "inputOnChange": (e: React.ChangeEvent<HTMLInputElement>) => void;
    "inputOnBack": (e: React.MouseEvent<HTMLButtonElement>) => void;
    "inputOnClose": (e: React.MouseEvent<HTMLButtonElement>) => void;

};

export const SortContext = createContext<ISortContext>({
    "inputRef": undefined,
    "sort": "",
    "isFocused": false,
    "inputOnFocus": (e: React.FocusEvent<HTMLInputElement>) => { },
    "inputOnBlur": () => { },
    "inputOnChange": () => { },
    "inputOnBack": (e: React.MouseEvent<HTMLButtonElement>) => { },
    "inputOnClose": (e: React.MouseEvent<HTMLButtonElement>) => { }
});

interface ICSortContextProps {

    "children": React.ReactNode;

};

const CSortContext = (props: ICSortContextProps) => {

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [sort, setSort] = useState<ISortContext["sort"]>("");
    const [isFocused, setFocused] = React.useState<ISortContext["isFocused"]>(false);

    const inputOnChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(e.currentTarget.value) === "[object String]")) {

            return;

        };

        setSort(currentValue);

    }, []);

    const inputOnFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {

        setFocused(true);

    }, []);

    const inputOnBlur = React.useCallback(() => {

        setFocused(false);

    }, []);

    const inputOnBack = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

        setFocused(false);
        setSort("");

    }, []);

    const inputOnClose = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

        inputRef.current?.focus();
        setSort("");

    }, []);

    return (<SortContext.Provider value={{
        inputRef,
        sort,
        isFocused,
        inputOnChange,
        inputOnFocus,
        inputOnBlur,
        inputOnBack,
        inputOnClose
    }}>

        {props.children}

    </SortContext.Provider>)

};

export default CSortContext;