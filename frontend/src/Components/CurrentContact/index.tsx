import React from "react";
import IContact from "../../Types/User/UserContactsUser";
import MemberList from "./MemberList";
import IChat, { CurrentChatOptional } from "../../Types/Chat";
import { selectContactById, selectCurrentContact, untouch } from "../../Redux/Reducer/Chat";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { useGetJoinsQuery } from "../../Services/Group";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { add as addMember } from "../../Redux/Reducer/Chat";

type CurrentContactFormProps = {

    "chatId": IChat["id"];

};

type ICurrentChat = { "chatType": "contact" | "group", "chatName": string, "online": boolean, "lastOnline"?: string };

const CurrentContact = (props: CurrentContactFormProps): JSX.Element => {

    const currentData = useAppSelector(store => selectContactById(store, props.chatId)) as IChat | null;

    const currentContact = useAppSelector(selectCurrentContact) as CurrentChatOptional;

    let { chatType, chatName, online, lastOnline }: ICurrentChat = { chatType: "contact", "chatName": "unknown", "online": false, "lastOnline": undefined };

    if (currentData) {

        chatType = currentData.type;
        chatName = currentData.name;
        online = chatType === "contact" ? (Object.prototype.toString.call(currentContact.online) === "[object Boolean]" ? (currentContact.online as boolean) : false) : false;
        lastOnline = chatType === "contact" ? currentContact.lastOnline : undefined;

    };

    const { data: currentJoins, error: joinsFetchError, refetch: refetchJoins, } = useGetJoinsQuery(chatType === "group" ? props.chatId : "none");

    React.useEffect(() => {

        if (joinsFetchError) {

            const fetchError = joinsFetchError as FetchBaseQueryError;

            console.log(`AUTHENTICATION FETCH ERROR - STATUS=${fetchError.status}`);

            if (fetchError.status !== "PARSING_ERROR") {

                return;

            };

        };

        if (currentJoins) {

            console.log("JOINS HAVE BEEN FETCHED");
            currentJoins.forEach((each) => {

                dispatch(addMember({ ...each, "name": each.username, "description": "hello world", "chatId": currentContact.id }));

            });

            console.log("JOINS ARRAY", currentJoins);

            return;

        };

        console.log("JOINS HAVE BEEN RE-FETCHED");

        refetchJoins();

    }, [currentJoins]);


    console.log("CURRENT CONTACT -", `type='${chatType}' id='${props.chatId}'`);

    const [viewMemberList, setViewMemberList] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();

    const setViewMemberListFn = React.useCallback((on: boolean) => {

        return () => {

            setViewMemberList(on);

        };

    }, []);

    const lastOnlineFn = React.useCallback((param: Date) => {

        console.log("lastOnlineFn began working...");

        if (!param) {

            console.log("lastOnlineFn stopped working...");
            return;

        };

        console.log(`ORGINAL - type of lastOnline = ${typeof param} - ${param}`);

        let lastOnline: Date;

        if (Object.prototype.toString.call(param) === "[object String]") {

            lastOnline = new Date(param);

        } else {

            lastOnline = param;

        };

        console.log(`CONVERTED - type of lastOnline = ${typeof lastOnline} - ${lastOnline}`);

        const lastOnlineTime = lastOnline.getTime(),
            currentTime = Date.now(),
            apart = (currentTime - lastOnlineTime) / 1000;

        let result: string = "unknown";

        if (apart <= 61) {

            result = "just now";

        } else if ((apart / 60) <= 59) {

            result = (`${Math.floor(apart / 60)} mins`);

        } else if (((apart / 60) / 60) <= 23) {

            result = (`${Math.floor((apart / 60) / 60)} hours`);

        } else if ((((apart / 24) / 60) / 60) <= 27) {

            result = (`${Math.floor(((apart / 24) / 60) / 60)} days`);

        } else if (((((apart / 30) / 24) / 60) / 60) <= 12) {

            result = (`${Math.floor(((((apart / 30) / 24) / 60) / 60))} months`);


        };

        return result;

    }, []);

    return (<header className="position-relative d-flex align-items-center justify-content-between current-chat">

            <div role="button" className="btn-icon position-relative custom-tooltip current-chat-profile">
                <span className="tooltip-text">Profile details</span>
                <div>
                    <i className="fa-solid fa-user"></i>
                </div>
            </div>

            <div role="button"
                className="current-chat-preview flex-grow-1 d-flex flex-column justify-content-center position-relative">

                <div className="current-chat-name">
                    <p>{chatName}</p>
                </div>

                <div className="current-chat-state">
                    <p>{online ? "online" : lastOnline ? lastOnlineFn(new Date(lastOnline) as Date) : chatType === "group" ? "" : "offline"}</p>
                </div>

            </div>

            <div className="current-chat-controllers d-flex flex-row btn-icon-flex">

                <div role="button" className="btn-icon position-relative custom-tooltip search-controller">
                    <span className="tooltip-text">Search</span>
                    <div>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>

                <div className="btn-group">
                    <div role="button" className="btn-icon position-relative custom-tooltip menu-controller"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="tooltip-text">Menu</span>
                        <div>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                        <li role="button" className="dropdown-item" >Contact info</li>
                        <li role="button" className="dropdown-item" onClick={()=>{ dispatch(untouch()) }} >Close chat</li>
                        <li role="button" className="dropdown-item" >Mute notifications</li>
                        <li role="button" className="dropdown-item" >Block</li>
                    </ul>
                </div>
            </div>
        </header>);

};

export default CurrentContact;