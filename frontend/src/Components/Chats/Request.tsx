import React from "react";
import { clientSocket } from "../..";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { join as addContact } from "../../Redux/Reducer/Chat";
import { remove as removeMessageRequest } from "../../Redux/Reducer/MessageRequest";
import { useAcceptMutation, useDeclineMutation } from "../../Services/MessageRequest";

type IRequestState = "Accepted" | "Declined" | "Fail" | "Not Found" | "Internal Server Error";

const Request = (props: { "id": string, "userId": string }): JSX.Element => {

    const dispatch = useAppDispatch();

    const [requestState, setRequestState] = React.useState<IRequestState>();

    const [acceptRequest, { data: acceptState, error: acceptError }] = useAcceptMutation();
    const [declineRequest, { data: declineState, error: declineError }] = useDeclineMutation();

    const [contactData, setContactData] = React.useState<{ "name": string, "description": string }>();

    React.useEffect(() => {

        console.log("checking contact-data");

        if (contactData) {

            console.log("contact-data:", contactData);
            return;

        };

        clientSocket.emit("contact-data", props.userId, (contactData) => {

            console.log("contact-data:", contactData);
            setContactData(contactData);

        });

    }, [contactData]);

    React.useEffect(() => {

        if (acceptError || declineError) {

            return;

        };

        if (!acceptState && !declineState) {

            return;

        };

        if (acceptState) {

            if (acceptState.status === "Success") {

                dispatch(addContact({ ...acceptState.data, "chatId": acceptState.data.userId, "description": "random", "type": "contact" }))

                dispatch(removeMessageRequest(props.id));

            };

        } else if (declineState) {

            if (declineState.status === "Success") {

                dispatch(removeMessageRequest(props.id));

            };

        };

        setRequestState(acceptState ? (acceptState.status === "Success" ? "Accepted" : acceptState.status) : declineState ? (declineState.status === "Success" ? "Declined" : declineState.status) : "Fail");

    }, [acceptState, declineState]);

    React.useEffect(() => {

        console.log("request state:", requestState);

    }, [requestState]);


    const onRequestClickFn = (e: React.MouseEvent<HTMLDivElement>) => {

        const targetElement = e.target as HTMLElement;

        const requestId = e.currentTarget.id;

        console.log("requestId:", requestId);
        console.log("target clicked:", targetElement.classList);

        console.log("className:", targetElement.className);

        if (targetElement.classList.contains("btn-outline-success")) {

            acceptRequest(requestId);

        } else if (targetElement.classList.contains("btn-outline-danger")) {

            declineRequest(requestId);

        } else if (targetElement.parentElement) {

            const parentElement = targetElement.parentElement;

            console.log("parent element classList:", parentElement.classList)

            if (parentElement.classList.contains("btn-outline-success")) {

                acceptRequest(requestId);

            } else if(parentElement.classList.contains("btn-outline-danger")) {

                declineRequest(requestId);

            };

        };

    };

    return (
        <div id={props.id} className="request-li" onClick={onRequestClickFn}>
            <div role="button" className="chat-avatar btn-icon">
                <img className="d-block" src="./img/female_avatar.svg" alt="" width="50" height="50" />
            </div>

            <div className="li-info">
                <div className="info-header">
                    <div className="li-name">
                        <p>
                            {
                                contactData
                                    ?
                                    contactData.name
                                    :
                                    ""
                            }
                        </p>
                    </div>
                </div>
                <div className="info-footer">

                    <div className="btn-group">

                        <button type="button" className="btn btn-outline-danger">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <button type="button" className="btn btn-outline-success">
                            <i className="fa-solid fa-check"></i>
                        </button>

                    </div>

                </div>
            </div>

        </div>
    );

};

export default Request;