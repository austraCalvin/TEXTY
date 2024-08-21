import React, { useLayoutEffect, useRef, createRef, ChangeEvent } from "react";
import Contact from "./Chat";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import IContact from "../../Types/User/UserContactsUser";
import { join as addContact, selectAllContacts } from "../../Redux/Reducer/Chat";
import { useAddContactMutation } from "../../Services/Contact";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { SerializedError } from "@reduxjs/toolkit/dist/createAsyncThunk";

interface IAddContact {

    "username": string;
    "customname": string;

};

type APIResponseOption = {
    "data": IContact;
    "error"?: undefined;

} |
{
    "data"?: undefined;
    "error": FetchBaseQueryError | SerializedError;

};

const AddContact = (): JSX.Element => {

    const contactListRaw = useAppSelector(selectAllContacts),
        contactList: IContact[] = Object.values(contactListRaw) as IContact[],

        dispatch = useAppDispatch(),
        [postContact, postedContact] = useAddContactMutation(),

        [inputValue, setInputValue] = React.useState<IAddContact>({ "username": "", "customname": "" });

    const onInputChange = (inputName: "username" | "customname") => {

        return (e: ChangeEvent<HTMLInputElement>) => {

            if (!(Object.prototype.toString.call(e.currentTarget.value) === "[object String]")) {

                console.log(`input for contact-${inputName} is invalid`);
                return;

            };

            setInputValue({
                ...inputValue,
                [inputName]: e.currentTarget.value
            });

        };

    };

    const onAddContact = (e: React.MouseEvent<HTMLButtonElement>) => {

        console.log("Adding contact...");

        if (!(e.currentTarget === e.target)) {
            console.log("currentTarget is not the same as target");
        };

        postContact({ "user": inputValue.username }).then((addedContact) => {

            const { data, error } = addedContact as APIResponseOption;

            if (error) {

                return Promise.reject(error);

            };

            console.log("Contact just added...");
            dispatch(addContact({ ...data, "chatId": data.id }));

        }).catch((err) => {

            console.log(`Error in AddContact Form at RTKQuery API named postContact - error has value = ${!!err}`);

        });

    };

    return (<form>
        <div className="mb-3">
            <label htmlFor="contact-username" className="form-label">username</label>
            <input value={inputValue.username} onChange={onInputChange("username")} type="text" className="form-control" id="add-contact-username" />
        </div>
        <div className="mb-3">
            <label htmlFor="contact-customname" className="form-label">custom name</label>
            <input value={inputValue.customname} onChange={onInputChange("customname")} type="text" className="form-control" id="add-contact-customname" />
        </div>
        <button onClick={onAddContact} type="button" className="btn btn-primary d-block mx-auto">ADD</button>
    </form>);

};

export default AddContact;