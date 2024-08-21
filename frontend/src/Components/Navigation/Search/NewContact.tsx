import React from "react";
import { SortContext } from "../../../Context/SearchInput";
import { useAddContactMutation } from "../../../Services/Contact";
import { useAppDispatch } from "../../../Redux/Hooks";
import { join as addContact } from "../../../Redux/Reducer/Chat";
import IContact from "../../../Types/User/UserContactsUser";

const NewContact = (): JSX.Element => {

    const { sort: search, inputOnChange, inputOnFocus, inputOnBlur } = React.useContext(SortContext);
    const [postContact, postedContact] = useAddContactMutation();

    const [isStatus, setStatus] = React.useState<"loading" | "success" | "error">();

    const inputRef = React.useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    const onClickFn = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

        if (postedContact.error) {

            return;

        };

        setStatus("loading");

        postContact({ "user": search }).unwrap().then((res) => {

            if (!inputRef.current) {

                return;

            };

            inputRef.current.value = "";
            setStatus("success");

        }).catch((err) => {

            setStatus("error");
            console.log("err:", err);

        });

    }, [search]);

    React.useEffect(() => {

        if (postedContact.error || !postedContact.data) {

            return;

        };

        const currentAddedContact = postedContact.data as IContact;

        dispatch(addContact({ ...currentAddedContact, "chatId": currentAddedContact.id }));

    }, [postedContact]);

    return (<>

        <span className="input-group-text">@</span>

        <input ref={inputRef} type="text" className={`form-control ${isStatus ? (isStatus === "success" ? "is-valid" : isStatus === "error" ? "is-invalid" : "") : ""}`} aria-label="Search" placeholder="Search" onChange={inputOnChange} onFocus={inputOnFocus} onBlur={inputOnBlur} />

        <div className={`${isStatus === "error" ? "in" : ""}valid-feedback`}>

            {
                isStatus === "error"
                    ?
                    "The contact could not be added"
                    :
                    "The contact has been added"
            }

        </div>

        <button type="button" className={`btn d-flex justify-content-center align-items-center ${!search || isStatus === "error" ? "disabled" : ""}`} onClick={onClickFn}>

            {
            isStatus === "loading"
            ?
            <div className="spinner-border"></div>
            :
            "Send Request"
            }

        </button>


    </>);

};

export default NewContact;