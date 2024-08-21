import React from "react";
import AddContact from "../Chats/addContact";
import ContactList from "../Chats/ChatList";
import CreateGroup from "../Chats/createGroup";
import { Dropdown } from "react-bootstrap";
import { useIsEnabledQuery, useSwitchNotifyMutation, useEnableMutation } from "../../Services/Notification";

type EnabledType = {
    notify: boolean;
    push: boolean;
    email: boolean;
};

interface INotificationLi {

    title: string;
    ref: React.RefObject<HTMLDivElement>;
    description: string;
    isLoading: boolean;
    isChecked: boolean;
    onClickFn: (e: React.MouseEvent<HTMLDivElement>) => void;

};

const NotificationLI = (): JSX.Element => {

    const notifyToggle = React.useRef<HTMLDivElement>(null),
        pushToggle = React.useRef<HTMLDivElement>(null),
        emailToggle = React.useRef<HTMLDivElement>(null);

    const { data: isEnabled, error: isEnabledError, refetch: refetchIsEnabled, isLoading: isEnabledLoading } = useIsEnabledQuery(),

        [switchNotify, { data: switchSuccess, error: switchError, isLoading: isSwitchNotifyLoading }] = useSwitchNotifyMutation(),

        [enableNotification, { data: isEnable, error: enableError, isLoading: isEnableLoading }] = useEnableMutation();

    React.useEffect(() => {

        if (!isEnabled || isEnabledError) {

            return;

        };

        console.log("isEnabled -", isEnabled);

    }, [isEnabled]);

    React.useEffect(() => {

        if (switchError || enableError) {

            console.log("something is up!");
            console.log(switchError ? switchError : enableError);

        };

    }, [switchSuccess, isEnable]);

    React.useEffect(() => {

        if (!isEnabledError || !isEnabled) {

            return;

        };

        // const localArray = [notifyToggle, pushToggle, emailToggle];

        if (!notifyToggle.current || !pushToggle.current || !emailToggle.current) {

            return;

        };

        if (isEnabled.notify) {

            pushToggle.current.classList.remove("disabled");
            emailToggle.current.classList.remove("disabled");

        } else {

            pushToggle.current.classList.add("disabled");
            emailToggle.current.classList.add("disabled");

        };

    }, [isEnabled]);

    const onNotifyBtn = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {

        if (!isEnabled || isEnabledError) {
            return;
        };

        switchNotify(!isEnabled.notify).unwrap().then((res) => {

            refetchIsEnabled();

        }).catch((err) => {

            console.log("onNotify error");
            console.log(err);

        });

    }, [isEnabled]);

    const onPushBtn = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {

        if (!isEnabled || isEnabledError) {
            return;
        };

        if (!isEnabled.push) {

            console.log("setting push enabled to on");
            console.log(`previous=${isEnabled.push} - current=${!isEnabled.push}`);

            window.navigator.serviceWorker.getRegistrations().then((val) => {

                if (val.length > 1) {

                    console.log(`SERVICE WORKER - registrations -`, val);

                } else if (val.length) {

                    console.log(`SERVICE WORKER - registration -`, val);

                };


            }).catch((err) => {

                console.log("Error from service-worker at getRegistrations");
                console.log(err);

            });

            window.navigator.serviceWorker.getRegistration().then(async (registration) => {

                console.log("getRegistration - then executed");

                if (!registration) {

                    console.log(`Error from service-worker at getRegistration - registration is undefined'`);
                    return;

                };

                //before subscription (create and read)
                const notificationPermission = await window.Notification.requestPermission().catch((err) => {

                    console.log(err);

                });

                if (notificationPermission === undefined) {

                    console.log(`Error from Notification at requestPermission - permission is undefined`);
                    return;

                };

                if (notificationPermission === "denied") {

                    console.log(`Notification permission has been denied`);
                    return;

                };
                //before subscription (create and read)

                const previousSubscription = await registration.pushManager.getSubscription().catch((err) => {

                    console.log(err);

                });

                if (previousSubscription === undefined) {

                    console.log(`Error from pushManager at getSubscription - previousSubscription is undefined`);
                    return;

                };

                let currentSubscription: PushSubscription;

                if (previousSubscription) {

                    currentSubscription = previousSubscription;

                } else {

                    const newSubscription = await registration.pushManager.subscribe({
                        "applicationServerKey": "BPKZs4zBSew-sYH3EAt9sdxFRoTUL_rpraR23wG3UtAZg9_1OgGJqyUuVJ493rt9tPquPiSM3D3xK0z_oPUelg0",
                        "userVisibleOnly": true
                    }).catch((err) => {

                        console.log(err);

                    });

                    if (newSubscription === undefined) {

                        console.log(`Error from pushManager at subscribe`);
                        return;

                    };

                    console.log(`¡PUSH MANAGER HAS BEEN SUBSCRIBED!`);
                    currentSubscription = newSubscription;

                };

                const postSubscription = await enableNotification({ "push": true, "pushSubscription": currentSubscription }).unwrap().catch((err) => {

                    console.log(err);

                });

                if (!postSubscription) {

                    console.log(`onPush error`);
                    return;

                };

                refetchIsEnabled();

                console.log(`POSTED SUBSCRIPTION - state=${postSubscription.state}`);
                return;

            }).catch((err) => {

                console.log("getRegistration - catch executed");

            });

        } else {

            console.log("setting push enabled to off");
            console.log(`previous=${isEnabled.push} - current=${!isEnabled.push}`);

            enableNotification({ "push": !isEnabled.push }).unwrap().then((res) => {

                refetchIsEnabled();

            }).catch((err) => {

                console.log("onPush error");
                console.log(err);

            });

        };

    }, [isEnabled]);

    const onEmailBtn = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {

        if (!isEnabled || isEnabledError) {
            return;
        };

        enableNotification({ "email": !isEnabled.email }).unwrap().then((res) => {

            refetchIsEnabled();

        }).catch((err) => {

            console.log("onEmail error");
            console.log(err);

        });

    }, [isEnabled]);

    const notificationData: INotificationLi[] = React.useMemo(() => {

        return !isEnabledError
            ?
            [
                {
                    "title": "Message notifications",
                    "ref": notifyToggle,
                    "description": "Show notifications for new messages",
                    "isLoading": isSwitchNotifyLoading,
                    "isChecked": (!isEnabledError && isEnabled) ? isEnabled.notify : false,
                    "onClickFn": onNotifyBtn
                },
                {
                    "title": "Push notifications",
                    "ref": pushToggle,
                    "description": "Show notifications through WebPush",
                    "isLoading": isEnableLoading,
                    "isChecked": (!isEnabledError && isEnabled) ? isEnabled.push : false,
                    "onClickFn": onPushBtn
                },
                {
                    "title": "Email notifications",
                    "ref": emailToggle,
                    "description": "Show notifications through email",
                    "isLoading": isEnableLoading,
                    "isChecked": (!isEnabledError && isEnabled) ? isEnabled.email : false,
                    "onClickFn": onEmailBtn
                }
            ]
            :
            [];

    }, [isEnabled, isEnableLoading, isEnabledError, isSwitchNotifyLoading]);

    return (<>
        {
            !isEnabledLoading
                ?
                <>

                    {

                        notificationData.map((e, index) => {

                            return (<div key={`notificationLi-${index}`} ref={e.ref} className="notifications-li" onClick={e.onClickFn}>
                                <label role="button" className="li-info" htmlFor={`flexCheckChecked${index}`}>
                                    <div className="info-header">
                                        <div className="li-title">
                                            <p>{e.title}</p>
                                        </div>
                                    </div>
                                    <div className="info-footer">
                                        <div className="li-description">
                                            <p>{e.description}</p>
                                        </div>
                                    </div>
                                </label>

                                {
                                    e.isLoading
                                        ?
                                        <div className="loading spinner-border"></div>
                                        :
                                        <input role="button" className="form-check-input border-0"
                                            type="checkbox" value="" id={`flexCheckChecked${index}`} checked={e.isChecked} onChange={() => { }} />
                                }

                            </div>);

                        })

                    }

                </>
                :
                <div style={{ "height": "100px", "width": "100px" }} className="position-absolute top-50 start-50 translate-middle">

                    <div className="spinner-border text-primary h-100 w-100"></div>

                </div>
        }

    </>);

};

export default NotificationLI;