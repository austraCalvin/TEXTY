import React from "react";
import { DashboardContext } from "../../Context/Dashboard";
import { SortContext } from "../../Context/SearchInput";
import { LogOutContext } from "../../Context/Logout";

interface ISettingsLi {

    title: string;
    icon: JSX.Element;
    onClickFn: () => void;

};

const SettingsLI = (): JSX.Element => {

    const { setDashboard } = React.useContext(DashboardContext);
    const { sort } = React.useContext(SortContext);
    const { onLogOutClick } = React.useContext(LogOutContext);

    const settingsData: ISettingsLi[] = [
        {
            "title": "Notifications",
            "icon": <svg viewBox="0 0 24 24" height="27" width="27" preserveAspectRatio="xMidYMid meet" className="" version="1.1"
                x="0px" y="0px" enableBackground="new 0 0 24 24">
                <path fill="currentColor"
                    d="M12,21.7c0.9,0,1.7-0.8,1.7-1.7h-3.4C10.3,20.9,11.1,21.7,12,21.7z M17.6,16.5v-4.7 c0-2.7-1.8-4.8-4.3-5.4V5.8c0-0.7-0.6-1.3-1.3-1.3s-1.3,0.6-1.3,1.3v0.6C8.2,7,6.4,9.1,6.4,11.8v4.7l-1.7,1.7v0.9h14.6v-0.9 L17.6,16.5z">
                </path>
            </svg>,
            "onClickFn": setDashboard("notifications")
        },
        {
            "title": "Privacy",
            "icon": <svg viewBox="0 0 28 35" height="23" width="23" preserveAspectRatio="xMidYMid meet" className="" version="1.1">
                <path
                    d="M14,1.10204082 C18.5689011,1.10204082 22.2727273,4.80586698 22.2727273,9.37476809 L22.272,12.1790408 L22.3564837,12.181606 C24.9401306,12.294858 27,14.4253101 27,17.0368705 L27,29.4665309 C27,32.1506346 24.824104,34.3265306 22.1400003,34.3265306 L5.85999974,34.3265306 C3.175896,34.3265306 1,32.1506346 1,29.4665309 L1,17.0368705 C1,14.3970988 3.10461313,12.2488858 5.72742704,12.178644 L5.72727273,9.37476809 C5.72727273,4.80586698 9.43109889,1.10204082 14,1.10204082 Z M14,19.5600907 C12.0418995,19.5600907 10.4545455,21.2128808 10.4545455,23.2517007 C10.4545455,25.2905206 12.0418995,26.9433107 14,26.9433107 C15.9581005,26.9433107 17.5454545,25.2905206 17.5454545,23.2517007 C17.5454545,21.2128808 15.9581005,19.5600907 14,19.5600907 Z M14,4.79365079 C11.4617216,4.79365079 9.39069048,6.79417418 9.27759175,9.30453585 L9.27272727,9.52092352 L9.272,12.1760408 L18.727,12.1760408 L18.7272727,9.52092352 C18.7272727,6.91012289 16.6108006,4.79365079 14,4.79365079 Z"
                    fill="currentColor"></path>
            </svg>,
            "onClickFn": () => { }
        },
        {
            "title": "Log out",
            "icon": <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1"
                x="0px" y="0px" enableBackground="new 0 0 24 24">
                <path fill="currentColor"
                    d="M16.6,8.1l1.2-1.2l5.1,5.1l-5.1,5.1l-1.2-1.2l3-3H8.7v-1.8h10.9L16.6,8.1z M3.8,19.9h9.1 c1,0,1.8-0.8,1.8-1.8v-1.4h-1.8v1.4H3.8V5.8h9.1v1.4h1.8V5.8c0-1-0.8-1.8-1.8-1.8H3.8C2.8,4,2,4.8,2,5.8v12.4 C2,19.1,2.8,19.9,3.8,19.9z">
                </path>
            </svg>,
            "onClickFn": onLogOutClick
        }

    ];

    let sortedCollection: ISettingsLi[] = [];

    if (sort) {

        sortedCollection = settingsData.filter((e) => {

            return e.title.includes(sort);

        }).sort((a, b) => {

            return a.title.localeCompare(b.title);

        });

    };

    return (<>

        {
            (sort
                ?
                (sortedCollection)
                :
                settingsData
            ).map((e, index) => {

                return <div key={`settingsLi-${index}`} style={e.title === "Log out" ? { "color": "#DC3545" } : {}} className="settings-li" onClick={e.onClickFn}>
                    <div role="button" className="settings-icon">
                        {e.icon}
                    </div>

                    <div className="li-info">
                        <div className="info-header">
                            <div className="li-name">
                                <p>{e.title}</p>
                            </div>
                        </div>
                    </div>
                </div>;

            })
        }

    </>);

};

export default SettingsLI;