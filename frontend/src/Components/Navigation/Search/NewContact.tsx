import React from "react";
import { SortContext } from "../../../Context/SearchInput";
import { useAddContactMutation } from "../../../Services/Contact";
import { useAppDispatch } from "../../../Redux/Hooks";
import { join as addContact } from "../../../Redux/Reducer/Chat";
import IContact from "../../../Types/User/UserContactsUser";

const NewContact = (): JSX.Element => {

    const { sort: search, inputOnChange, inputOnFocus, inputOnBlur } = React.useContext(SortContext);
    const [postContact, postedContact] = useAddContactMutation();

    const [isStatus, setStatus] = React.useState<"Loading" | "Created" | "Internal Server Error" | "Exists" | "Bad Request" | "Not Found">();
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const inputRef = React.useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    const onClickFn = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

        if (postedContact.error) {

            return;

        };

        setStatus("Loading");
        postContact(search);

    }, [search]);

    React.useEffect(() => {

        if (postedContact.error) {

            setErrorMessage("The contact could not be added");
            return;

        };

    }, [postedContact]);

    React.useEffect(() => {

        if (postedContact.error || !postedContact.data) {

            return;

        };

        if (postedContact.data.status === "Created") {

            const currentAddedContact = postedContact.data.data as IContact;

            setStatus(postedContact.data.status);
            setErrorMessage("");
            dispatch(addContact({ ...currentAddedContact, "chatId": currentAddedContact.id }));
            return;

        } else {

            setStatus(postedContact.data.status);
            setErrorMessage(postedContact.data.message);

        };

    }, [postedContact]);

    return (<div className="input-group search-input has-validation">

        <span className="input-group-text">@</span>

        <input ref={inputRef} type="text" className={`form-control ${isStatus ? (isStatus === "Created" ? "is-valid" : errorMessage ? "is-invalid" : "") : ""}`} aria-label="Search" placeholder="Search" onChange={inputOnChange} onFocus={inputOnFocus} onBlur={inputOnBlur} aria-describedby="newcontact-feedback" />

        <button type="button" className={`btn d-flex justify-content-center align-items-center`} onClick={onClickFn}>

            {
                isStatus === "Loading"
                    ?
                    <div className="spinner-border d-block"></div>
                    :
                    "Send Request"
            }

        </button>

        <div id="newcontact-feedback" className={`${errorMessage ? "in" : ""}valid-feedback`}>
            {
                isStatus === "Created"
                    ?
                    "The contact has been added"
                    :
                    errorMessage
            }
        </div>
    </div>);

};

export default NewContact;