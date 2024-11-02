import React from "react";
import CDashboardContext, { DashboardContext } from "../Context/Dashboard";
import Dashboard from "./Dashboard";
import { useAppDispatch } from "../Redux/Hooks";
import { setAll } from "../Redux/Reducer/Chat";
import { init as setAllMessageRequests } from "../Redux/Reducer/MessageRequest";
import { useGetAllQuery as useGetAllContactsQuery } from "../Services/Contact";
import Chat from "./Chat";
import { useGetAllQuery as useGetAllGroupsQuery } from "../Services/Group";
import { useGetAllQuery as useGetAllMessageRequestsQuery } from "../Services/MessageRequest";
import IChat from "../Types/Chat";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import NavigationResponse from "./Navigation/NavigationResponse";
import NavigationHeader from "./Navigation/NavigationHeader";
import { InstallPromoContext } from "../Context/InstallPromo";
import NavigationSearch from "./Navigation/NavigationSearch";
import CSortContext from "../Context/SearchInput";
import CLogOutContext from "../Context/Logout";

type IReq = { "isLoading": boolean, "success": boolean, "isError": boolean };

const ChatApp = (): JSX.Element => {

    const { installPromo, isUserChoice } = React.useContext(InstallPromoContext);

    const [req, setReq] = React.useState<IReq>({ "isLoading": true, "success": false, "isError": false });

    const { data: contactListData, error: contactListError, refetch: refetchContactList } = useGetAllContactsQuery();
    const { data: groupListData, error: groupListError, refetch: refetchGroupList } = useGetAllGroupsQuery();
    const { data: messageRequestListData, error: messageRequestListError, refetch: refetchMessageRequestList } = useGetAllMessageRequestsQuery();

    const dispatch = useAppDispatch();

    React.useEffect(() => {

        if (req.isError) {

            return;

        };

        if (!contactListData || !groupListData) {

            console.log(`${!contactListData ? "CONTACT" : "GROUP"} IS NULL`);
            return;

        };

        if (contactListError || groupListError) {

            console.log(`${!contactListError ? "CONTACT" : "GROUP"} FETCH FAILED`);
            setReq({ ...req, "isLoading": false, "isError": true });
            return;

        };

        const chatList: Omit<IChat, "members">[] = [];

        if (contactListData && groupListData) {

            console.log(`BOTH CHAT LISTS ARE VALID`);
            console.log("contactListData -", contactListData ? contactListData : "does not exist", `- typeof='${typeof contactListData} - alternative=${Object.prototype.toString.call(contactListData)}'`);
            console.log("groupListData -", groupListData ? groupListData : "does not exist", `- typeof='${typeof groupListData} - alternative=${Object.prototype.toString.call(groupListData)}'`);

            chatList.push(...contactListData, ...groupListData);

        };

        console.log(`CHAT LIST IS VALID`);
        console.log(chatList);

        dispatch(setAll((chatList).map((val) => {

            return { ...val, "members": val.type === "contact" ? [val] : [] };

        })));
        setReq({ ...req, "isLoading": false, "success": true });

    }, [contactListData, groupListData]);

    React.useEffect(() => {

        if (groupListError) {

            const fetchError = groupListError as FetchBaseQueryError;

            console.log(`GROUP LIST FETCH ERROR - STATUS=${fetchError.status}`);

            if (fetchError.status === "PARSING_ERROR") {

                console.log("GROUP LIST DATA HAS BEEN REFETCH AFTER PARSING ERROR!");
                refetchGroupList();

            };

            return;

        };

        if (!groupListData) {

            console.log("GROUP LIST DATA HAS BEEN REFETCH!");
            refetchGroupList();
            return;

        };

    }, [groupListData]);

    React.useEffect(() => {

        if (contactListError) {

            const fetchError = contactListError as FetchBaseQueryError;

            console.log(`CONTACT LIST FETCH ERROR - STATUS=${fetchError.status}`);

            if (fetchError.status === "PARSING_ERROR") {

                console.log("CONTACT LIST DATA HAS BEEN REFETCH AFTER PARSING ERROR!");
                refetchContactList();

            };

            return;

        };

        if (!contactListData) {

            console.log("CONTACT LIST DATA HAS BEEN REFETCH!");
            refetchContactList();
            return;

        };

        if (contactListData) {

            console.log("CONTACT LIST DATA HAS BEEN REFETCH!");
            refetchContactList();
            return;

        };

    }, [contactListData]);

    React.useEffect(() => {

        if (messageRequestListError) {

            const fetchError = messageRequestListError as FetchBaseQueryError;

            console.log(`MESSAGE REQUEST LIST FETCH ERROR - STATUS=${fetchError.status}`);

            if (fetchError.status === "PARSING_ERROR") {

                console.log("MESSAGE REQUEST LIST DATA HAS BEEN REFETCH AFTER PARSING ERROR!");
                refetchMessageRequestList();

            };

            return;

        };

        if (!messageRequestListData) {

            console.log("MESSAGE REQUEST LIST DATA HAS BEEN REFETCH!");
            refetchMessageRequestList();
            return;

        };

        if (messageRequestListData) {

            console.log("MESSAGE REQUEST LIST DATA HAS BEEN SET!");
            if (Array.isArray(messageRequestListData)) {

                if (messageRequestListData.length) {

                    dispatch(setAllMessageRequests(messageRequestListData));

                };

            };

            return;

        };

    }, [messageRequestListData]);

    return (<div className="app d-flex flex-row h-100 w-100 position-absolute z-n1">

        <CDashboardContext>

            <Dashboard />

            <div className="d-flex flex-column position-relative navigation-block">

                <CLogOutContext>

                    < NavigationHeader />

                    <div className="navigation-body">

                        <div role="button"
                            className="install-promo w-100 border border-0 border-top d-flex flex-row justify-content-center align-items-center" onClick={isUserChoice}>

                            <div className="promo-logo">
                                <img className="d-block" src="./img/react_logo.ico" alt="" width="50" height="50" />
                            </div>

                            <div className="promo-text ms-2">
                                Get Texty for Desktop
                            </div>

                        </div>

                        <CSortContext>
                            <div className="list-search position-relative">

                                <NavigationSearch />

                            </div>

                            <div className="navigation-response flex-grow-1">

                                <NavigationResponse />

                            </div>
                        </CSortContext>

                    </div>

                </CLogOutContext>

            </div>

            <div className="d-flex flex-column position-relative flex-grow-1 chat-board">

                {
                    !req.isLoading ?
                        (
                            !req.isError
                                ?
                                <Chat />
                                :
                                <h1>Something went wrong</h1>
                        )
                        :
                        <div style={{ "width": "100px", "height": "100px" }} className="position-absolute top-50 start-50 translate-middle">

                            <div className="spinner-border text-primary h-100 w-100"></div>

                        </div>
                }

            </div>

        </CDashboardContext>

    </div>);

};

export default ChatApp;