import React from "react";
import { InstallPromoContext } from "../../Context/InstallPromo";
import { DashboardContext } from "../../Context/Dashboard";
import Settings from "./Search/Settings";
import NotificationSearch from "./Search/Notification";
import NewContact from "./Search/NewContact";
import Chats from "./Search/Chats";

const NavigationSearch = (): JSX.Element => {

    const { dashboard } = React.useContext(DashboardContext);
    const { isUserChoice } = React.useContext(InstallPromoContext);

    return (<>

        {
            dashboard === "settings"
                ?
                <Settings />
                :
                dashboard === "notifications"
                    ?
                    <NotificationSearch />
                    :
                    dashboard === "newcontact"
                        ?
                        <NewContact />
                        :
                        <Chats />
        }

    </>);

};

export default NavigationSearch;