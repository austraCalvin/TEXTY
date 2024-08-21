import React, { useLayoutEffect, useRef, createRef, ChangeEvent } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import IGroup, { IPOSTEDGroup } from "../../Types/User/Group";
import { join as addGroup, selectAllContactIds, selectAllContacts } from "../../Redux/Reducer/Chat";
import { useCreateGroupMutation } from "../../Services/Group";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { SerializedError } from "@reduxjs/toolkit/dist/createAsyncThunk";
import IContact from "../../Types/User/UserContactsUser";
import IChat from "../../Types/Chat";

// "id": string;
// "name": string;
// "description": string;
// "configurable": boolean;
// "messages": boolean;
// "joinable": boolean;
// "approve": boolean;

interface IAddGroup {

    "name": string;
    "description": string;

};

type APIResponseOption = {
    "data": IPOSTEDGroup & {
        "join": {
            "name": string;
            "description"?: string | undefined;
            "admin": boolean;
        };
    };
    "error"?: undefined;

} |
{
    "data"?: undefined;
    "error": FetchBaseQueryError | SerializedError;

};

const CreateGroup = (): JSX.Element => {

    const [membersAdded, continueForm] = React.useState<boolean>(false);

    const contactsToJoin = React.useRef<HTMLFormElement>(null);

    const contactListRaw = useAppSelector(selectAllContacts),
        contactList: IChat[] = Object.values(contactListRaw) as IChat[],

        dispatch = useAppDispatch(),
        [postGroup, postedGroup] = useCreateGroupMutation(),

        [inputValue, setInputValue] = React.useState<IAddGroup>({ "name": "", "description": "" });

    const [membersChecked, setMembersChecked] = React.useState<Record<string, boolean>>(JSON.parse(JSON.stringify(Object.create(contactListRaw).__proto__ as Record<string, boolean>)));

    React.useEffect(() => {

        console.log("MEMBERS CHECKED -", membersChecked)

    }, [membersChecked]);

    React.useEffect(() => {

        const { data, error } = postedGroup;

        if (!data || error) {

            if (error) {

                console.log(`Error in CreateGroup Form at RTKQuery API named postGroup - error has value = ${!!error}`);

            };

            return;

        };

        console.log("Group just created...");
        dispatch(addGroup({ "id": data.id, "type": "group", "name": data.name, "description": data.description ? data.description : "hello world", "chatId": data.id, "admin": data.admin }));

    }, [postedGroup]);

    const addMember = React.useCallback((e: React.MouseEvent<HTMLFormElement>) => {

        // e.preventDefault();

        // const targetChecked = e.currentTarget as HTMLElement;
        const targetChecked = e.target as HTMLInputElement;

        if (targetChecked.tagName === "INPUT") {

            const memberId = targetChecked.id;

            if (!(memberId in membersChecked)) {

                return;

            };

            console.log("ID PASSED =", memberId);

            if (membersChecked[memberId] === true) {

                setMembersChecked({ ...membersChecked, [memberId]: false });

            } else {

                setMembersChecked({ ...membersChecked, [memberId]: true });

            };

        };

    }, [membersChecked]);

    const addMembers = React.useCallback((nextForm: boolean = false) => {

        return () => {

            continueForm(nextForm);

        };

    }, []);

    const onInputChange = (inputName: "name" | "description") => {

        return (e: ChangeEvent<HTMLInputElement>) => {

            if (!(Object.prototype.toString.call(e.currentTarget.value) === "[object String]")) {

                console.log(`input for group-${inputName} is invalid`);
                return;

            };

            setInputValue({
                ...inputValue,
                [inputName]: e.currentTarget.value
            });

        };

    };

    const onCreateGroup = (e: React.MouseEvent<HTMLButtonElement>) => {

        console.log("Creating group...");

        if (!(e.currentTarget === e.target)) {
            console.log("currentTarget is not the same as target");
        };

        const invitations = Object.keys(Object.fromEntries(Object.entries(membersChecked).filter((val) => val[1] === true)));

        postGroup({ "name": inputValue.name, "description": inputValue.description, invitations });

        addMembers(false);

    };

    return (<>
        {
            !membersAdded
                ?
                <form ref={contactsToJoin} onClick={addMember}>
                    {
                        contactList.filter((val) => val.type === "contact").map((e, index) => {

                            return <div key={`group-join-${index}`} className="form-check">
                                <input id={e.id} className="form-check-input" type="checkbox" />
                                <label className="form-check-label" htmlFor={e.id}>
                                    {e.name}
                                </label>
                            </div>

                        })
                    }
                    <button type="button" className="btn btn-primary" onClick={addMembers(true)}>continue</button>
                </form>
                :
                <form>

                    <div className="mb-3">
                        <label htmlFor="group-name" className="form-label">name</label>
                        <input value={inputValue.name} onChange={onInputChange("name")} type="text" className="form-control" id="group-name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="group-description" className="form-label">description</label>
                        <input value={inputValue.description} onChange={onInputChange("description")} type="text" className="form-control" id="group-description" />
                    </div>
                    <button onClick={onCreateGroup} type="button" className="btn btn-primary d-block mx-auto">create</button>
                </form>
        }
    </>);

};

export default CreateGroup;