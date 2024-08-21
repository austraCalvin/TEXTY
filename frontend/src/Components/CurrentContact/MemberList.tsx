import React from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import {  selectAllMembers } from "../../Redux/Reducer/Chat";

const MemberList = (props: { "id": string, "type": "contact" | "group" }): JSX.Element => {

    const chatMembers = useAppSelector((store) => selectAllMembers(store, props.id));

    return (
        <ul className={"list-group"}>

            {
                chatMembers && props.type === "group"
                    ?
                    chatMembers.map((member, index) => {

                        return <li key={`chat-member-item-${index}`} id={member.id} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center`}>

                            <div className="contact-description">

                                <div className="user-name">{member.name}</div>

                                {
                                    member.admin === true
                                        ?
                                        <div className="user-status">group admin</div>
                                        :
                                        member.admin === false
                                            ?
                                            ""
                                            :
                                            ""
                                }



                            </div>

                        </li>

                    })
                    :
                    <></>
            }

        </ul>
    );

};

export default MemberList;