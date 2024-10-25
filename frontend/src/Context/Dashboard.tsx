import React, { createContext, useState } from "react";

export type DashboardOptions = "none" | "chats" | "settings" | "notifications" | "newcontact" | "requests";

// interface IDashboardContext {

//     "dashboard": DashboardOptions;
//     "setDashboard": React.Dispatch<React.SetStateAction<DashboardOptions>>;

// };
interface IDashboardContext {

    "dashboard": DashboardOptions;
    "setDashboard": (type: DashboardOptions) => () => void;

};

export const DashboardContext = createContext<IDashboardContext>({
    "dashboard": "none",
    "setDashboard": (e) => { console.log("dashboard changed to", e); return () => { } }
});

interface ICDashboardContextProps {

    "children": React.ReactNode;

};

const CDashboardContext = (props: ICDashboardContextProps) => {

    const [dashboard, setDashboard] = useState<IDashboardContext["dashboard"]>("none");

    const setDashboardType = React.useCallback((type: DashboardOptions) => {

        const dashboardBtn = () => {

            console.log("type switched to:", type);

            if (dashboard === type) {

                setDashboard("none");

            } else {

                setDashboard(type);

            };

        };

        return dashboardBtn;

    }, [dashboard]);

    return (<DashboardContext.Provider value={{
        dashboard,
        setDashboard: setDashboardType
    }}>

        {props.children}

    </DashboardContext.Provider>)

};

export default CDashboardContext;