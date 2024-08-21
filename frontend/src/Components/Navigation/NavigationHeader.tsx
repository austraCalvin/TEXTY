import React from "react";
import { InstallPromoContext } from "../../Context/InstallPromo";
import { DashboardContext } from "../../Context/Dashboard";
import { useLogOutMutation } from "../../Services/Authentication";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Hooks";
import { logOut as LocallogOut } from "../../Redux/Reducer/Authentication";

const NavigationHeader = (): JSX.Element => {

    const { dashboard, setDashboard } = React.useContext(DashboardContext);
    const { isUserChoice } = React.useContext(InstallPromoContext);
    const [DBlogOut, { data: logOutState, error: logOutError }] = useLogOutMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onLogOutClick = React.useCallback(() => {

        DBlogOut().unwrap().then((success) => {

            console.log("LogOut succeeded - state:", success);
            dispatch(LocallogOut());
            navigate("/login");

        }).catch((err) => {

            console.log("LogOut failed - error:", err);

        });

    }, []);

    React.useEffect(() => {

        if (logOutError || !logOutState) {

            console.log("Logout action failed");
            return;

        };

        console.log("Logout action succeeded");

    }, [logOutState]);

    return (<>

        {
            dashboard === "settings"
                ?
                <header className="position-relative d-flex align-items-center">
                    <div role="button" className="navigate-up btn-icon position-relative custom-tooltip" onClick={setDashboard("none")}>
                        <span className="tooltip-text">Navigate up</span>
                        <div>
                            <i className="fa-solid fa-arrow-left"></i>
                        </div>
                    </div>

                    <div className="current-page-name flex-grow-1">

                        <h1>Settings</h1>

                    </div>
                </header>
                :
                dashboard === "notifications"
                    ?
                    <header className="position-relative d-flex align-items-center">
                        <div role="button" className="navigate-up btn-icon position-relative custom-tooltip" onClick={setDashboard("none")}>
                            <span className="tooltip-text">Navigate up</span>
                            <div>
                                <i className="fa-solid fa-arrow-left"></i>
                            </div>
                        </div>

                        <div className="current-page-name flex-grow-1">

                            <h1>Notifications</h1>

                        </div>
                    </header>
                    :
                    dashboard === "newcontact"
                        ?
                        <header className="position-relative d-flex align-items-center">
                            <div role="button" className="navigate-up btn-icon position-relative custom-tooltip" onClick={setDashboard("none")}>
                                <span className="tooltip-text">Navigate up</span>
                                <div>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </div>
                            </div>

                            <div className="current-page-name flex-grow-1">

                                <h1>New contact</h1>

                            </div>
                        </header>
                        :
                        <header className="position-relative d-flex align-items-center">

                            {/* <div role="button" className="navigate-up btn-icon position-relative custom-tooltip" onClick={setDashboard("none")}>
                                <span className="tooltip-text">Navigate up</span>
                                <div>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </div>
                            </div> */}

                            <div className="current-page-name flex-grow-1">

                                <h1>Chats</h1>

                            </div>

                            <div className="chats-controllers d-flex flex-row btn-icon-flex">

                                <div role="button" className="btn-icon position-relative custom-tooltip chats-new">
                                    <span className="tooltip-text">New chat</span>
                                    <div>
                                        <i className="fa-solid fa-comment-medical"></i>
                                    </div>
                                </div>

                                <div className="btn-group">
                                    <div role="button" className="btn-icon position-relative custom-tooltip chats-menu"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="tooltip-text">Menu</span>
                                        <div>
                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                        </div>
                                    </div>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                                        <li role="button" className="dropdown-item" onClick={setDashboard("newcontact")}>New contact</li>
                                        <li role="button" className="dropdown-item" >New group</li>
                                        <li role="button" className="dropdown-item" onClick={onLogOutClick} >Log out</li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li role="button" className="dropdown-item" onClick={isUserChoice}>Get Texty for Desktop</li>
                                    </ul>
                                </div>

                            </div>

                        </header>
        }

    </>);

};

export default NavigationHeader;