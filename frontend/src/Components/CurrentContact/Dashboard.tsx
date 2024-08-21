import React, { useContext } from "react";

type DashboardOptions = "none" | "view-contact" | "block" | "mute-notifications";

const Dashboard = (): JSX.Element => {

    const [dashboard, setDashboard] = React.useState<DashboardOptions>();

    const setDashboardType = (type: DashboardOptions) => {

        const dashboardBtn = () => {

            console.log("type switched to:", type);

            if (dashboard === type) {

                setDashboard("none");

            } else {

                setDashboard(type);

            };

        };

        return dashboardBtn;

    };

    return (

        <div className={"container-fluid position-fixed top-0"}>

            <button type="button" onClick={() => { setDashboardType("none")() }} className="btn btn-success none-btn">HOME</button>

            <button type="button" onClick={() => { setDashboardType("view-contact")() }} className="btn btn-success view-contact-btn">config</button>

            <button type="button" onClick={() => { console.log("hello world!"); setDashboardType("mute-notifications")() }} className="btn btn-success mute-notifications-btn">contact</button>

            <button type="button" onClick={() => { setDashboardType("block")() }} className="btn btn-success block-btn">search</button>

        </div>
        
    );

};

export default Dashboard;