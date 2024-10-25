import React from "react";
import Contact from "./Chat";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import { selectAllContactIds, selectAllContacts, selectCurrentContact, touch } from "../../Redux/Reducer/Chat";
import IChat from "../../Types/Chat";
import { clientSocket } from "../..";

const ContactList = (): JSX.Element => {

    const contactListIds = useAppSelector(selectAllContactIds);
    const contactListRaw = useAppSelector(selectAllContacts);
    const currentContact = useAppSelector(selectCurrentContact);
    const dispatch = useAppDispatch();

    console.log(`contact list current length: ${contactListIds}`);
    const contactList: IChat[] = Object.values(contactListRaw) as IChat[];

    console.log("Veronica -", contactList);
    
    return (<>
        {
            contactListIds.map((contactId, index) => {

                const currentChat = contactListRaw[contactId] as IChat;

                // const currentChatId = currentChat.type === "contact" ? (currentChat.userId as string) : currentChat.id;

                const currentChatId = currentChat.type === "contact" ? (contactId as string) : currentChat.id;

                const switchChat = (e: React.MouseEvent<HTMLDivElement>) => {

                    console.log("Switch contact working...");
                    // const selectedContactId = e.currentTarget.id;
                    const selectedContactId = currentChatId;

                    console.log(`SwitchContact - previousContactId=${currentContact ? currentContact.id : "null"} - nextContactId=${selectedContactId}`);

                    if (currentContact && (currentContact.id === selectedContactId)) {

                        return;

                    };

                    let previousContactHTMLElement: HTMLElement | null = null;

                    if (currentContact) {

                        console.log(`SwitchContact - about to untouch current contact`);

                        console.log("Current contact untouch in order to touch a different one");
                        previousContactHTMLElement = document.getElementById(currentContact.id) as HTMLElement;
                        // dispatch(untouch());

                    };

                    console.log(`SwitchContact - about to touch new contact`);
                    clientSocket.emit("contact-online", selectedContactId);
                    //OBSERVATION
                    dispatch(touch(selectedContactId));

                    if (previousContactHTMLElement) {

                        console.log("previous HTML modified");

                        previousContactHTMLElement.classList.add("list-group-item-action");
                        previousContactHTMLElement.classList.remove("active");

                    };

                    console.log(`currentContactId=${selectedContactId} --- previousContact.id=${currentContact ? currentContact.id : ""}`);

                    e.currentTarget.classList.remove("list-group-item-action");
                    e.currentTarget.classList.add("active");

                };

                return <Contact key={`chatId-${currentChatId}`} chatId={currentChatId} chatType={currentChat.type} chatName={currentChat.name} switchChat={switchChat} active={currentContact ? (currentContact.id === currentChatId ? true : false) : false} />

            })

        }

    </>);

};

export default ContactList;