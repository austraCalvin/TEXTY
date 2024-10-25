import React from "react";
import { selectCurrentContact } from "../../Redux/Reducer/Chat";
import { useAppSelector } from "../../Redux/Hooks";
import { selectAllMessagesByChat } from "../../Redux/Reducer/UserSendsMessage";
import { IUserSendsMessage } from "../../Types/Message/UserSendsMessage";
import { selectMessageById } from "../../Redux/Reducer/Message";

interface ContactProps {

    "chatId": string;
    "chatType": "contact" | "group";
    "chatName": string;
    "switchChat": (e: React.MouseEvent<HTMLDivElement>) => void;
    "active": boolean;

};

interface ILocalUserSendsMessage extends IUserSendsMessage {
    "id": string;
};

const Chat = (props: ContactProps): JSX.Element => {

    const currentContact = useAppSelector(selectCurrentContact);

    const { chatId, chatType, chatName, switchChat } = props;

    React.useEffect(() => {

        if (currentContact) {

            return;

        };

        const chatList = document.querySelector(".chat-list") as HTMLUListElement;

        if (!chatList) {

            return;

        };

        if (!chatList.children.length) {

            return;

        };

        console.log("RE-ARRANGEMENT OF CONTACT ITEMS");

        chatList.childNodes.forEach((each) => {

            const currentChatElement = (each as HTMLElement);

            currentChatElement.classList.add("list-group-item-action");
            currentChatElement.classList.remove("active");

        });

    }, [currentContact]);

    ///
    console.log(`Chat-Record request - chatType=${chatType} - chatId=${chatId} -`);

    const chatRecord = useAppSelector(store => selectAllMessagesByChat(store, chatId)),

        lastMessage = chatRecord[chatRecord.length - 1] as ({ "id": string, "sendId"?: string, "messageId"?: string, "date": string, "deliveredDate"?: string, "readDate"?: string }) | undefined;

    ///

    let messageId: string = "null";

    if (lastMessage && !lastMessage.sendId) {

        if (/[a-z]/.test(lastMessage.id)) {

            messageId = lastMessage.messageId as string;

        } else {

            messageId = lastMessage.date as string;

        };

    };

    console.log("CONTACT - MESSAGE OBJECT - ", lastMessage);

    messageId = lastMessage ? (lastMessage.messageId ? lastMessage.messageId : lastMessage.date) : "null";

    console.log("CONTACT - MESSAGE BODY PREVIEW - ", messageId);

    const lastMessageContent = useAppSelector(store => selectMessageById(store, messageId));

    const previewDate = lastMessage ? new Date(lastMessage.date) : undefined;

    console.log("CONTACT - MESSAGE PREVIEW - ", chatRecord);

    const messageDate = previewDate ? (`${previewDate.getHours()}:${previewDate.getMinutes() < 10 ? `0${previewDate.getMinutes()}` : previewDate.getMinutes()}`) : "";

    const decodedMessage = decodeURIComponent((lastMessageContent ? lastMessageContent.body : "").replace(/\+/g, " "));
    const messageSplit = decodedMessage.split("");
    messageSplit.length = 20;
    const convertedMessage = messageSplit.join("");

    return (chatRecord
        ?
        <div className={`catalog-li ${props.active ? "current" : ""}`} onClick={props.active ? () => { } : switchChat}>
            <div className="chat-avatar btn-icon">
                <img className="d-block" src="./img/female_avatar.svg" alt="" width="50" height="50" />
            </div>
            <div className="li-info">
                <div className="info-header">
                    <div className="li-name">
                        <p>{chatName}</p>
                    </div>
                    <div className="message-date">
                        <p>{messageDate}</p>
                    </div>
                </div>
                <div className="info-footer">

                    <div className="last-message">
                        <p>{convertedMessage}...</p>
                    </div>

                    <div className={`message-state state-${lastMessage ? (!lastMessage.sendId ? (lastMessage.readDate ? "read" : lastMessage.deliveredDate ? "delivered" : "sent") : "") : ""}`}>
                        <i className="fa-solid fa-check"></i>
                        <i className="fa-solid fa-check"></i>
                        <i className="fa-regular fa-clock"></i>
                    </div>

                </div>
            </div>
        </div>
        :
        <></>
    );

};

export default Chat;