import React from "react";
import { useNavigate, Navigate } from "react-router";
import { useConfirmMutation } from "../../../Services/Registration";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { IPOSTUser, ISignupUser } from "../../../Types/User/User";
import PasswordAlert from "./PasswordAlert";

interface IConfirmProps {

    "id": string;
    "code": number;

};

const Confirm = (props: IConfirmProps): JSX.Element => {

    const [confirmRegistration, { data: confirmedRegistration, error: confRegError }] = useConfirmMutation();
    const [isReg, setReg] = React.useState<"Created" | "Unauthorized" | "Bad Request" | "Not Found" | "Internal Server Error" | null>(null);

    const [user, setUser] = React.useState<ISignupUser>({}),
        [userError, setUserError] = React.useState<{ [K in keyof Required<ISignupUser & { "repeat_password": string }>]: boolean }>({ "name": false, "username": false, "password": false, "repeat_password": false });

    const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>();

    const navigateFn = useNavigate();

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

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "username": true })
            return;

        };

        setUser({ ...user, "username": currentValue });

        if ((/\w{3,}/.test(currentValue))) {

            setUserError({ ...userError, "username": false });
            return;

        };

    }, [user, userError]);

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

    return (<>

        {
            !(isReg === "Not Found")
                ?
                <div className="h-100 w-100 position-absolute z-n1 form-login d-flex flex-column align-items-center">

                    <div className="app-logo">

                        <img className="d-block" src="./img/stick_and_react_logo.svg" alt="" width="300" height="300" />

                    </div>

                    <div className="app-title">

                        <h1 className="text-center">
                            Welcome to
                            <br />
                            Texty
                        </h1>

                    </div>

                    <form className="p-2 w-50">
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
                                            <input type="text" name="username" className={`form-control ${userError.username ? "is-invalid" : ""}`} id="user-username"
                                                placeholder="Username" onChange={onUsernameChange} onBlur={onUsernameBlur} aria-describedby="user-username-feedback" />
                                            <div id="user-username-feedback" className="invalid-feedback">

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
                                                        <>The username field must have at least 3 characters</>
                                                }

                                            </div>
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
                    </form>

                </div>
                :
                <>
                    <p>This registration request does not exist</p>

                    <button type="button" className="btn btn-success" onClick={OKFn}>OK</button>
                </>
        }
    </>);

};

export default Confirm;