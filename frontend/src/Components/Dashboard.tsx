import React, { useContext } from "react";
import { DashboardContext, DashboardOptions } from "../Context/Dashboard";

const Dashboard = (): JSX.Element => {

    const { dashboard, setDashboard } = useContext(DashboardContext);

    //<span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
    return (<>

        <header className="d-flex flex-column position-relative main-header justify-content-between">

            <div className="btn-icon-flex">

                <div role="button" className={`btn-icon position-relative custom-tooltip ${dashboard === "chats" || dashboard === "none" ? "active" : ""}`} onClick={setDashboard("chats")}>
                    <span className="tooltip-text">Chats</span>
                    <div>
                        <i className="fa-solid fa-comment"></i>
                    </div>
                </div>
                <div role="button" className="btn-icon position-relative custom-tooltip">
                    <span className="tooltip-text">Requests</span>
                    <div>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    {/* <span className="position-absolute z-1 top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        99+
                    </span> */}
                </div>

            </div>

            <div className="btn-icon-flex">

                <div role="button" className={`btn-icon position-relative custom-tooltip ${dashboard === "settings" ? "active" : ""}`} onClick={setDashboard("settings")}>
                    <span className="tooltip-text">Settings</span>
                    <div>
                        <i className="fa-solid fa-gear"></i>
                    </div>
                </div>
                <div role="button" className="btn-icon position-relative custom-tooltip">
                    <span className="tooltip-text">Profile</span>
                    <div>
                        <i className="fa-solid fa-user"></i>
                    </div>
                </div>

            </div>

        </header>

    </>);

};

export default Dashboard;