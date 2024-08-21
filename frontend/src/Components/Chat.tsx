import React from "react";
import CurrentContact from "./CurrentContact";
import { useAppDispatch, useAppSelector } from "../Redux/Hooks";
import { selectCurrentContact, selectContactById, selectCurrentContactId, intouch } from "../Redux/Reducer/Chat";
import MessageHistory from "./Messages/History";
import Input from "./Messages/Input";
import { clientSocket } from "..";
import { IContactOnline } from "../Types/SocketEvents";
import IUser from "../Types/User/User";

const Chat = (): JSX.Element => {

    const currentContactId = useAppSelector(selectCurrentContactId);

    const currentContact = useAppSelector(selectCurrentContact),

        currentData = useAppSelector(store => selectContactById(store, currentContact ? currentContact.id : "")),

        dispatch = useAppDispatch();

    React.useEffect(() => {

        if (!currentContact) {

            return;

        };

        console.log("currentContactId -", currentContact.id);
        console.log("currentData:", currentData ? currentData.name : "none");

    }, [currentContact]);

    const userOnline = React.useCallback((contactId: IUser["id"], data: IContactOnline) => {

        console.log("userOnline triggered!");
        console.log("contactId:", contactId, "currentContactId:", currentContact ? currentContact.id : "");
        console.log("data:", data);

        const { online, lastOnline } = data;

        if (currentContact) {

            if (currentContact.id === contactId) {

                console.log(`ContactUser to listen id='${contactId}' - online='${online ? "yes" : "no"} - ${!online ? `lastOnline='${lastOnline}'` : ""}'`);

                if (online) {

                    dispatch(intouch({ online }));

                }
                else {

                    dispatch(intouch({ online, lastOnline }));

                };


            };

        } else {

            console.log("CurrentContact does NOT exist --->");

        };

    }, [currentContact]);

    React.useEffect(() => {

        console.log(`currentContact has changed! - id=${currentContact ? currentContact.id : "null"}`);

        console.log("Events added in order to listen to the contact user");
        clientSocket.on("contact-online", userOnline);

        return () => { };

    }, [currentContactId]);

    return (<>
        {
            currentContact
                ?
                <>
                    <CurrentContact
                        chatId={currentContact.id} />

                    <MessageHistory chatId={currentContact.id} />
                    <Input />
                </>
                :
                <></>
        }


    </>);

};

export default Chat;