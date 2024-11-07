import React from "react";
import MessageBox from "./MessageBox";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { selectAllMessagesByChat, setMany } from "../../Redux/Reducer/UserSendsMessage";
import { IUserSendsMessage, IUserSentMessage } from "../../Types/Message/UserSendsMessage";
import IUserReceivesMessage from "../../Types/Message/UserReceivesMessage";
import { useGetAllMessagesQuery } from "../../Services/UserSendsMessage";
import { selectContactById } from "../../Redux/Reducer/Chat";
import IChat from "../../Types/Chat";

interface IMessageHistoryProps {

    "chatId": string;

};

interface ILocalUserSendsMessage extends IUserSendsMessage {
    "id": string;
};

const MessageHistory = (props: IMessageHistoryProps): JSX.Element => {

    const chatRecord = useAppSelector(store => selectAllMessagesByChat(store, props.chatId)),

        currentChat = useAppSelector(store => selectContactById(store, props.chatId)) as IChat,

        { data, error, refetch: reBackupChat } = useGetAllMessagesQuery(currentChat.type === "contact" ? currentChat.id : props.chatId),

        dispatch = useAppDispatch();

    console.log(`Messages from chatId=${props.chatId} ${chatRecord ? "has content" : "is empty"}`)

    console.log("useGetAllMessagesQuery - JUST FETCHED");

    React.useEffect(() => {

        if (error) {

            return console.log("CHAT RECOVERY FAILED!");

        };

        if (data && !error) {

            console.log("Chat has been recovered from the server", typeof data, "length:", data.length);

            console.log("BACKUP CHAT - value:", data);

            if (data.length) {

                dispatch(setMany(data));

            };

        };

        if (!data && !error) {

            reBackupChat();

        };

    }, [data]);

    return (<div className="message-board p-2 flex-grow-1 position-relative">

        <div role="button" className="btn-icon position-absolute custom-tooltip">
            <span className="tooltip-text">Recent</span>
            <div>
                <i className="fa-solid fa-arrow-down"></i>
            </div>
        </div>

        <div className="d-flex flex-column position-absolute w-100 h-100 message-stack">
            <div className="flex-filler flex-grow-1">

            </div>
            <div className="py-4">
                {
                    chatRecord
                        ?
                        chatRecord.map((element) => {

                            let sendId: string | undefined;

                            let state: ("sent" | "read" | "delivered" | "pending") | undefined;
                            let messageId: string | undefined;

                            if (!("sendId" in element)) {

                                console.log("ME SENDING A MESSAGE");
                                console.log("send object:", element);

                                const send = element as IUserSendsMessage;

                                if ("sent" in send) {

                                    state = (element.sent ? (element.deliveredDate ? "delivered" : (element.readDate ? "read" : "sent")) : "pending") as ("read" | "sent" | "delivered" | "pending");

                                } else {

                                    state = element.readDate ? "read" : element.deliveredDate ? "delivered" : "sent";

                                };

                                messageId = send.messageId

                            } else {

                                console.log("ME RECEIVING A MESSAGE");
                                console.log("receive object:", element);

                                const receive = element as IUserReceivesMessage;
                                sendId = receive.sendId;

                            };

                            return (<MessageBox
                                key={`message-${element.id}-${element.chatId}`}
                                id={element.id}
                                date={element.date}
                                state={state}
                                messageId={messageId}
                                sendId={sendId}
                                chatId={element.chatId}
                            />)

                        })
                        :
                        <></>
                }
            </div>
        </div>
    </div>);

};

export default MessageHistory;