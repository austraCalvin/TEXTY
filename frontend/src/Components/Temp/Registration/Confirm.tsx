import React from "react";
import { useNavigate, Navigate } from "react-router";
import { useCheckUsernameMutation, useConfirmMutation } from "../../../Services/Registration";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { IPOSTUser, ISignupUser } from "../../../Types/User/User";
import PasswordAlert from "./PasswordAlert";

interface IConfirmProps {

    "id": string;
    "code": number;

};

const Confirm = (props: IConfirmProps): JSX.Element => {

    const [confirmRegistration, { data: confirmedRegistration, error: confRegError }] = useConfirmMutation();

    const [checkUsernameMutation, { data: checkedUsername, error: checkedUsernameError, isLoading: isCheckUsernameLoading, reset: resetUsernameChecked }] = useCheckUsernameMutation();

    const [isReg, setReg] = React.useState<"Created" | "Unauthorized" | "Bad Request" | "Not Found" | "Internal Server Error" | null>(null);

    const [isUsername, setUsername] = React.useState<"valid" | "invalid" | undefined>();

    const [user, setUser] = React.useState<ISignupUser>({}),
        [userError, setUserError] = React.useState<{ [K in keyof Required<ISignupUser & { "repeat_password": string }>]: boolean }>({ "name": false, "username": false, "password": false, "repeat_password": false });

    const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>();

    const navigateFn = useNavigate();

    React.useEffect(() => {

        if (checkedUsernameError || !checkedUsername) {

            return;

        };

        console.log("checkedUsername.status:", checkedUsername.status);

        if (checkedUsername.status === "OK") {

            setUsername("valid");

        } else if (checkedUsername.status === "Bad Request") {

            setUsername("invalid");

        };

    }, [checkedUsername, checkedUsernameError]);

    React.useEffect(() => {

        console.log("user-data:", { ...user, "repeat_password": confirmPassword });

        // ${(user.password !== undefined && confirmPassword !== undefined) ? (user.password !== confirmPassword ? "is-invalid" : "") : ""}

        if (user.password !== undefined && confirmPassword !== undefined) {

            if (user.password !== confirmPassword) {

                setUserError({ ...userError, "repeat_password": true });

            } else {

                setUserError({ ...userError, "repeat_password": false });

            };

        };

    }, [user, confirmPassword]);

    React.useEffect(() => {

        console.log("userError:", userError);

    }, [userError]);

    const OKFn = React.useCallback(() => {

        navigateFn("/");

    }, []);

    const confirmFn = React.useCallback(() => {

        if (
            userError.name ||
            userError.username ||
            userError.password ||
            !confirmPassword
        ) {

            return;

        };

        if (user.password !== confirmPassword) {

            return;

        };

        confirmRegistration({ "id": props.id, ...user as Required<ISignupUser>, "code": props.code });

    }, [user, confirmPassword, userError]);

    React.useEffect(() => {

        if (confRegError) {

            const fetchError = confRegError as FetchBaseQueryError;

            console.log(`REGISTRATION CONFIRM FETCH ERROR - STATUS=${fetchError.status}`);
            return;

        };

        if (!confirmedRegistration) {

            console.log("REGISTRATION CONFIRM IS UNDEFINED!");
            return;

        };

        console.log("REGISTRATION CONFIRM FETCH SUCEEDED!");
        setReg(confirmedRegistration.status);

        if (confirmedRegistration.status === "Bad Request") {

            console.log("Registration - Bad Request:", confirmedRegistration.error)

            const currentError = confirmedRegistration.error as ({
                field?: keyof IPOSTUser;
                message: string;
            });

            setUserError({
                ...userError, [currentError.field as (keyof IPOSTUser)]: true
            })

        };

    }, [confirmedRegistration]);

    const onNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "name": true });
            return;

        };

        setUser({ ...user, "name": currentValue });

        if ((/\w{3,}/.test(currentValue))) {

            setUserError({ ...userError, "name": false });
            return;

        };

    }, [user, userError]);

    const onNameBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(/\w{3,}/.test(currentValue))) {

            setUserError({ ...userError, "name": true });
            return;

        };

    }, [userError]);

    const CheckUsernameTimeout = React.useMemo(() => {

        class OnUsernameCheck {

            private static timeout?: NodeJS.Timeout;
            private static ms: number = 1000;

            private constructor() { };

            static start(val: string) {

                if (val.length < 3) {

                    return;

                };

                if (this.timeout) {

                    this.clear();

                };

                this.timeout = setTimeout(() => {

                    console.log("hello world");
                    checkUsernameMutation(val);

                }, this.ms);

            }

            static clear() {

                clearTimeout(this.timeout);

            }

        };

        return OnUsernameCheck;

    }, []);

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "username": true })
            return;

        };

        setUser({ ...user, "username": currentValue });

        if ((/\w{3,}/.test(currentValue))) {

            setUserError({ ...userError, "username": false });
            CheckUsernameTimeout.start(currentValue);

        }else{

            CheckUsernameTimeout.clear();

        };

        if (checkedUsername) {

            resetUsernameChecked();
            setUsername(undefined);

        };

    }, [user, userError, checkedUsername]);

    const onUsernameBlur = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(/\w{3,}/.test(currentValue))) {

            setUserError({ ...userError, "username": true });
            return;

        };

    }, [userError]);

    const onPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "password": true });
            return;

        };

        setUser({ ...user, "password": currentValue });

        if ((/^(?=(?:.*[0-9]){5})(?=(?:.*[a-z]){2})(?=(?:.*[A-Z]){1})(?=(?:.*[_.*\-]){1})[0-9a-zA-Z_.*\-]{9,}$/.test(currentValue))) {

            setUserError({ ...userError, "password": false });
            return;

        };

    }, [user, userError]);

    const onPasswordBlur = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(/^(?=(?:.*[0-9]){5})(?=(?:.*[a-z]){2})(?=(?:.*[A-Z]){1})(?=(?:.*[_.*\-]){1})[0-9a-zA-Z_.*\-]{9,}$/.test(currentValue))) {

            setUserError({ ...userError, "password": true });
            return;

        };

    }, [userError]);

    const onConfirmPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            return;

        };

        setConfirmPassword(currentValue);

    }, []);

    const usernameInputElement = (
        <input type="text" name="username" className={`form-control ${!isCheckUsernameLoading ? (userError.username ? "is-invalid" : isUsername ? (isUsername === "valid" ? "is-valid" : "is-invalid") : "") : ""}`} id="user-username"
            placeholder="Username" value={user.username} onChange={onUsernameChange} onBlur={onUsernameBlur} aria-describedby={isCheckUsernameLoading ? "user-username-help" : "user-username-feedback"} />
    );

    const usernameInputGroupElement = (<>
        {
            isCheckUsernameLoading
                ?
                <>

                    <div className={`input-group`}>

                        {usernameInputElement}

                        <span className="input-group-text">

                            <div className="spinner-border text-primary d-block spinner-border-sm"></div>

                        </span>

                    </div>

                    <div id="user-username-help" className="form-text">
                        Checking for a coincidence...
                    </div>

                </>

                :
                <>
                    {usernameInputElement}

                    <div id="user-username-feedback" className={`${!userError.username ? (isUsername ? isUsername : "invalid") : "invalid"}-feedback`}>

                        {
                            isReg === "Bad Request"
                                ?
                                (
                                    confirmedRegistration?.error?.field === "username"
                                        ?
                                        confirmedRegistration.error.message
                                        :
                                        <></>
                                )
                                :
                                !userError.username
                                    ?
                                    (
                                        isUsername
                                            ?
                                            (
                                                isUsername === "valid"
                                                    ?
                                                    <>The username is valid</>
                                                    :
                                                    <>The username is already in use</>
                                            )
                                            :
                                            <></>
                                    )
                                    :
                                    <>The username field must have at least 3 characters</>
                        }

                    </div>
                </>
        }
    </>);

    const formChildren = (<>

        {
            !(isReg === "Created")
                ?
                <>
                    <div aria-describedby="registration-confirm-feedback">

                        <div className={`mb-3`}>
                            <label htmlFor="user-name" className="form-label">name</label>
                            <input type="text" name="name" className={`form-control ${userError.name ? "is-invalid" : ""}`} id="user-name"
                                placeholder="Name" onChange={onNameChange} onBlur={onNameBlur} aria-describedby="user-name-feedback" />
                            <div id="user-name-feedback" className="invalid-feedback">

                                The name field must have at least 3 characters

                            </div>
                        </div>
                        <div className={`mb-3`}>

                            <label htmlFor="user-username" className="form-label">username</label>

                            {usernameInputGroupElement}

                        </div>
                        <div className="mb-3">
                            <label htmlFor="user-password" className="form-label">password</label>
                            <input type="password" name="password" className={`form-control ${userError.password ? "is-invalid" : ""}`} id="user-password"
                                placeholder="Password" onChange={onPasswordChange} onBlur={onPasswordBlur} />
                        </div>

                        <PasswordAlert error={userError.password} />

                        <div className="mb-3 ">

                            <label htmlFor="confirm-password" className="form-label">repeat password</label>

                            <input type="password" name="password" className={`form-control ${userError.repeat_password ? "is-invalid" : ""}`} id="confirm-password"
                                aria-describedby="confirm-password-feedback"
                                placeholder="Password"
                                onChange={onConfirmPasswordChange} />

                            <div id="confirm-password-feedback" className="invalid-feedback">

                                The two fields are to be the same password

                            </div>

                        </div>


                    </div>

                    <div id="registration-confirm-feedback" className="invalid-feedback">
                        {
                            isReg === "Unauthorized"
                                ?
                                <>
                                    The code inserted is incorrect
                                </>
                                :
                                isReg === "Bad Request"
                                    ?
                                    (
                                        confirmedRegistration
                                            ?
                                            (
                                                confirmedRegistration.error?.field === "email"
                                                    ?
                                                    confirmedRegistration.error.message
                                                    :
                                                    <></>
                                            )
                                            :
                                            <></>
                                    )
                                    :
                                    <>
                                        Unexpected error has occurred
                                        <br />
                                        Please, refresh the page and try again
                                    </>
                        }
                    </div>

                    {
                        isReg === "Internal Server Error"
                            ?
                            <></>
                            :

                            <button type="button" className="btn btn-primary d-block mx-auto" onClick={confirmFn}>Sign up</button>
                    }

                </>
                :
                <>
                    <p>Registration has been confirmed</p>

                    <button type="button" className="btn btn-success" onClick={OKFn}>OK</button>
                </>
        }

    </>);

    return (<>

        {
            !(isReg === "Not Found")
                ?
                <>

                    <div className="app-logo">

                        <img className="d-block" src="../../img/stick_and_react_logo.svg" alt="" width="300" height="300" />

                    </div>

                    <div className="app-title">

                        <h1 className="text-center">
                            Welcome to
                            <br />
                            Texty
                        </h1>

                    </div>

                    <form className="p-2 w-50">

                        {formChildren}

                    </form>

                </>
                :
                <>
                    <p>This registration request does not exist</p>

                    <button type="button" className="btn btn-success" onClick={OKFn}>OK</button>
                </>
        }
    </>);

};

export default Confirm;