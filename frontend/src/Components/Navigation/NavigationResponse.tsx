import React from "react";
import ContactList from "../Chats/ChatList";
import NotificationLI from "./NotificationLI";
import SettingsLI from "./SettingsLI";
import { DashboardContext } from "../../Context/Dashboard";
import NewContact from "./NewContact";

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
                    <ContactList />
        }

    </>);

};

export default NavigationResponse;