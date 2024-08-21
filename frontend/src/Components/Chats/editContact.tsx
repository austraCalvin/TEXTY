import React, { useLayoutEffect, useRef, createRef, ChangeEvent } from "react";
import Contact from "./Chat";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import IContact from "../../Types/User/UserContactsUser";
import { add as addContact, edit, selectAllContacts } from "../../Redux/Reducer/Chat";
import { useEditContactMutation } from "../../Services/Contact";
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

interface EditContactFormProps {

    "contactId": IContact["id"];

};

const EditContactForm = (props: EditContactFormProps): JSX.Element => {

    const contactListRaw = useAppSelector(selectAllContacts),
        contactList: IContact[] = Object.values(contactListRaw) as IContact[],

        dispatch = useAppDispatch(),

        [editContact, editedContact] = useEditContactMutation(),
        [customname, setInputValue] = React.useState<IContact["name"]>("");

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {

        if (!(Object.prototype.toString.call(e.currentTarget.value) === "[object String]")) {

            console.log(`input for editing contact is invalid`);
            return;

        };

        setInputValue(e.currentTarget.value);

    };

    const onEditContact = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

        if (!(e.currentTarget === e.target)) {
            console.log("currentTarget is not the same as target");
        };

        const currentCustomname:string = customname;

        editContact({ "id": props.contactId, customname }).then((addedContact) => {

            const { data, error } = addedContact as APIResponseOption;

            if (error) {

                return Promise.reject(error);

            };

            //
            console.log("MATCH --->");
            console.log("data:", data);
            console.log("edited-contact:", editedContact);
            console.log("MATCH --->");

            //

            dispatch(edit({
                "id": props.contactId, "chatId": props.contactId, "changes": {
                    "name": currentCustomname
                }
            }));

        }).catch((err) => {

            console.log(`Error in EditContact Form at RTKQuery API named postContact - error has value = ${!!err}`);

        });

    }, [customname]);

    return (<form>
        <div className="mb-3">
            <label htmlFor="contact-customname" className="form-label">custom name</label>
            <input value={customname} onChange={onInputChange} type="text" className="form-control" id="contact-customname" />
        </div>
        <button onClick={onEditContact} type="button" className="btn btn-primary d-block mx-auto">ADD</button>
    </form>);

};

export default EditContactForm;