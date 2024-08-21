import React from "react";
import { clientSocket } from "../..";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { add as addMessage, selectMessageById } from "../../Redux/Reducer/Message";
import { updateOne, selectSMSById } from "../../Redux/Reducer/UserSendsMessage";
import { selectContactById, selectContactByUserId } from "../../Redux/Reducer/Chat";
import IMessage, { IPartialMessage } from "../../Types/Message/Message";
import IChat from "../../Types/Chat";
import { selectCurrentChatMember } from "../../Redux/Reducer/Chat";

// type IMessageBoxProps = {

//     "id": string;
//     "body": string;
//     "date": string;
//     "sender"?: undefined;
//     "state": ("pending" | "sent" | "delivered" | "read");
//     "messageId": string;
//     "sendId"?: undefined;

// } | {

//     "id": string;
//     "body": string;
//     "date": string;
//     "sender": string;
//     "state"?: ("pending" | "sent" | "delivered" | "read");
//     "messageId"?: undefined;
//     "sendId": string;

// };

type GetMessageResponseType = {
    "exist": true,
    "data": { "id": string, "body": string }
} |
{
    "exist": false,
    "data": { "id": string, "body": string }
};

type IMessageBoxProps = {

    "id": string;
    "date": string;
    "state"?: ("pending" | "sent" | "delivered" | "read");
    "messageId"?: string;
    "sendId"?: string;
    "chatId": string;

};

const MessageBox = (props: IMessageBoxProps): JSX.Element => {

    const chat = useAppSelector(store => selectContactById(store, props.chatId));
    const bodyElement = React.useRef<HTMLSpanElement>(null);

    let sendMessageId: string = "null";

    if (!props.sendId) {

        if (/[a-z][0-9][\-]/.test(props.id)) {

            sendMessageId = props.messageId as string;

        } else {

            sendMessageId = props.date;

        };

    } else {

        sendMessageId = props.messageId as string;

    };

    console.log(`MESSAGE BOX - id to look for - ${sendMessageId}`);

    const currentMessage = useAppSelector(store => selectMessageById(store, sendMessageId));

    const parsedDate = new Date(props.date);

    const sentDate = {
        "hours": parsedDate.getHours(),
        "minutes": parsedDate.getMinutes(),
        "seconds": parsedDate.getSeconds()
    };
    const sentDateFormat = (`${sentDate.hours}:${sentDate.minutes < 10 ? `0${sentDate.minutes}` : sentDate.minutes}`),

        [message, setMessage] = React.useState<Pick<IMessage, "id" | "body">>(),
        [senderId, setSenderId] = React.useState<string>();
    const dispatch = useAppDispatch();

    const currentChatMember = useAppSelector(store => selectCurrentChatMember(store, props.chatId, senderId ? senderId : ""));

    React.useEffect(() => {

        if (!senderId) {

            return;

        };

        console.log(`SENDER-ID - ${senderId}`);

    }, [senderId]);

    React.useEffect(() => {

        if (!chat) {

            return;

        };

        if (!props.sendId) {

            return;

        };

        if (chat.type === "contact") {

            setSenderId(props.chatId);
            return;

        };

        clientSocket.emit("sender-id", props.sendId, (senderId) => {

            setSenderId(senderId)

        });

    }, []);

    React.useEffect(() => {

        const localPromise: Promise<GetMessageResponseType> = new Promise((success, danger) => {

            console.log("STORED-MESSAGE:", currentMessage ? "true" : "false");

            if (currentMessage) {

                return success({ "exist": true, "data": currentMessage });

            };

            if (props.sendId) {

                //RECEIVE MESSAGE

                if (!props.messageId) {

                    clientSocket.emit("send-data", props.sendId, (messageId) => {

                        dispatch(updateOne({ "id": props.id, "changes": { messageId } }));

                        clientSocket.emit("message-content", messageId, (messageContent) => {

                            console.log(`RECEIVE MESSAGE --- success`);
                            success({ "exist": false, "data": { ...messageContent } });

                        });

                    });

                };

            } else {

                //SEND MESSAGE

            };

            clientSocket.emit("message-content", props.messageId as string, (messageContent) => {

                console.log(`SEND MESSAGE --- success`);
                success({ "exist": false, "data": { ...messageContent } });

            });

        });

        localPromise.then((success) => {

            if (!success.exist) {

                console.log("MESSAGE BODY SET TO THE LOCAL DB");
                dispatch(addMessage(success.data));
                setMessage({ ...success.data });


            };

            console.log("MESSAGE BODY SET TO THE STATE");

            setMessage({ ...success.data });

        }).catch((err) => {

            console.log("Request for message content failed");

        });

    }, []);

    React.useEffect(() => {

        if (!message || !bodyElement.current) {

            return;

        };

        bodyElement.current.innerText = decodeURIComponent(message.body.replace(/\+/g, " "));

    }, [message]);

    return (
        message &&
            chat &&
            currentChatMember !== undefined
            ?
            <div className={`message-container-${props.sendId ? "received" : "sent"}`}>
                <div className="message-content position-relative">
                    {
                        props.sendId
                            ?
                            !(chat.type === "contact")
                                ?
                                <div className="message-sender">

                                    <p>{currentChatMember ? currentChatMember.name : "Deleted User"}</p>

                                </div>
                                :
                                <></>
                            :
                            <></>
                    }

                    <div className="message-body">

                        <span ref={bodyElement} className="copyable-text">

                        </span>
                        <span className="text-filler"></span>

                    </div>

                    <div className="message-status">
                        <div className="message-date">
                            {sentDateFormat}
                        </div>
                        {
                            !props.sendId
                                ?
                                <div className={`message-state ${props.state ? `state-${props.state}` : ""}`}>
                                    <i className="fa-solid fa-check"></i>
                                    <i className="fa-solid fa-check"></i>
                                    <i className="fa-regular fa-clock"></i>
                                </div>
                                :
                                <></>
                        }

                    </div>

                    <div className="message-menu btn-group dropup">

                        <div role="button" className="menu-icon" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <svg viewBox="0 0 18 18" height="18" width="18"
                                preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px"
                                enable-background="new 0 0 18 18">
                                <title>down-context</title>
                                <path fill="currentColor"
                                    d="M3.3,4.6L9,10.3l5.7-5.7l1.6,1.6L9,13.4L1.7,6.2L3.3,4.6z"></path>
                            </svg>
                        </div>

                        <ul className="dropdown-menu">
                            <li role="button" className="dropdown-item" >Reply</li>
                            <li role="button" className="dropdown-item" >Forward</li>
                            <li role="button" className="dropdown-item" >Delete</li>
                        </ul>

                    </div>

                </div>

            </div>
            :
            <></>
    );

};

export default MessageBox;