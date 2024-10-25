import React from "react";
import ContactList from "../Chats/ChatList";
import NotificationLI from "./NotificationLI";
import SettingsLI from "./SettingsLI";
import { DashboardContext } from "../../Context/Dashboard";
import NewContact from "./NewContact";
import RequestList from "./RequestList";

const NavigationResponse = (): JSX.Element => {

    const { dashboard } = React.useContext(DashboardContext);

    return (<>
        {
            dashboard === "settings"
                ?
                <SettingsLI />
                :
                dashboard === "notifications"
                    ?
                    <NotificationLI />
                                    :
                dashboard === "newcontact"
                ?
                <NewContact/>
                :
                dashboard === "requests"
                ?
                <RequestList/>
                    :
                    <ContactList />
        }

    </>);

};

export default NavigationResponse;