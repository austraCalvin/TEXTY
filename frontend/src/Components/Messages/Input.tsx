import React from "react";
import { clientSocket } from "../..";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { selectCurrentContact, selectContactById } from "../../Redux/Reducer/Chat";
import { add as addSendMessage, sent } from "../../Redux/Reducer/UserSendsMessage";
import { add as addMessage, edit as editMessage } from "../../Redux/Reducer/Message";

const Input = (): JSX.Element => {

    const dispatch = useAppDispatch();
    const currentChat = useAppSelector(selectCurrentContact),
        currentChatData = useAppSelector(store => selectContactById(store, currentChat ? currentChat.id : ""));

    const [message, setMessage] = React.useState<string>("");

    const inputDivRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {

        if (!currentChat || !currentChatData) {

            return;

        };

        console.log("CURRENT CHAT -", `id=${currentChat.id} - type=${currentChatData.type}`)

    }, [currentChat]);

    const onMessageSubmit = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {

        if (!currentChat || !currentChatData) {

            return;

        };

        interface ICurrrentMessageDate {
            "toString": string;
            "toUTCString": string;
        };

        interface ICurrentMessage {
            "body": string,
            "date": ICurrrentMessageDate
        };

        if (!inputDivRef.current) {

            console.log("inputdiv is empty");
            return;

        };

        console.log("inputdiv text length:", inputDivRef.current.innerText.length);

        const sentDate = new Date();

        const convertedInnerText = encodeURIComponent(inputDivRef.current.innerText).replace(/'/g, "%27").replace(/"/g, "%22");

        inputDivRef.current.innerText = "";

        const currentMessage: ICurrentMessage = {
            "body": convertedInnerText,
            "date": {
                "toString": sentDate.toString(),
                "toUTCString": sentDate.toUTCString()
            }
        };

        dispatch(addSendMessage({ "id": currentMessage.date.toString, "chatType": currentChatData.type, "chatId": currentChat.id, "date": currentMessage.date.toString, "messageId": currentMessage.date.toString }));

        dispatch(addMessage({
            "id": currentMessage.date.toString,
            "body": currentMessage.body
        }));

        console.log("message to be sent:", currentMessage.body);
        console.log("chat-id:", currentChat.id);

        clientSocket.emit("message-pending",
            {
                "date": currentMessage.date.toUTCString,
                "chatId": currentChat.id,
                "chatType": currentChatData.type
            },
            {
                "body": currentMessage.body

            }, async (sendObject) => {

                if (!sendObject) {

                    return;

                };

                console.log(`localId='${currentMessage.date.toString}' - dbId='${new Date(sendObject.date).toString()}'`)

                dispatch(sent({
                    "previousId": new Date(sendObject.date).toString(),
                    "messageId": sendObject.messageId,
                    "id": sendObject.id,
                    "userId": sendObject.userId
                }));

                dispatch(editMessage({
                    "id": new Date(sendObject.date).toString(),
                    "changes": {
                        "id": sendObject.messageId
                    }
                }));

            });

    }, [currentChat, currentChatData]);

    return (<footer className="chat-input position-relative w-100">

        <div className="input-flex d-flex align-items-center justify-content-between">

            <div className="input-div flex-grow-1 rounded">
                <div ref={inputDivRef} role="textbox" className="text-box" aria-placeholder="Type a message" contentEditable="true"
                    spellCheck="true">
                </div>
            </div>
            <div role="button" className="btn-icon position-relative custom-tooltip align-self-end" onClick={onMessageSubmit}>
                <span className="tooltip-text">Send</span>
                <div>
                    <i className="fa-solid fa-paper-plane"></i>
                </div>
            </div>

        </div>

    </footer>);

};

export default Input;