import React from "react";
import { useNavigate, Navigate } from "react-router";
import { useConfirmMutation } from "../../../Services/Registration";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ISignupUser } from "../../../Types/User/User";

interface IConfirmProps {

    "id": string;
    "code": number;

};

const Confirm = (props: IConfirmProps): JSX.Element => {

    const [confirmRegistration, { data: confirmedRegistration, error: confRegError }] = useConfirmMutation();
    const [isReg, setReg] = React.useState<"Created" | "Unauthorized" | "Not Found" | "Internal Server Error" | null>(null);

    const [user, setUser] = React.useState<ISignupUser>({}),
        [userError, setUserError] = React.useState<{ [K in keyof Required<ISignupUser>]: { "isError": true, "error": string } | { "isError": false, "error"?: undefined } }>({ "name": { "isError": false }, "username": { "isError": false }, "password": { "isError": false } });

    const navigateFn = useNavigate();

    React.useEffect(() => {

        console.log("user-data:", user);

    }, [user]);

    React.useEffect(() => {

        console.log("userError:", userError);

    }, [userError]);

    const OKFn = React.useCallback(() => {

        navigateFn("/");

    }, []);

    const confirmFn = React.useCallback(() => {

        if (
            userError.name.isError &&
            userError.username.isError &&
            userError.password.isError
        ) {

            return;

        };

        confirmRegistration({ "id": props.id, ...user as Required<ISignupUser>, "code": props.code });

    }, [user]);

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

    }, [confirmedRegistration]);

    const onNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "name": { "isError": true, "error": "Name field does not meet the criteria - this field is not a valid string" } })
            return;

        };

        // if (!(/\w+/.test(currentValue))) {

        //     setUserError({ ...userError, "name": { "isError": true, "error": "Name field does not meet the criteria - this field must only contain characters" } });
        //     return;

        // };

        setUser({ ...user, "name": currentValue });

    }, [user]);

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "username": { "isError": true, "error": "Username field does not meet the criteria - this field is not a valid string" } })
            return;

        };

        // if (!(/[a-zA-Z0-9]/.test(currentValue))) {

        //     setUserError({ ...userError, "username": { "isError": true, "error": "Username field does not meet the criteria - this field must only contain letters and numbers" } });
        //     return;

        // };

        setUser({ ...user, "username": currentValue });

    }, [user]);

    const onPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            setUserError({ ...userError, "password": { "isError": true, "error": "Password field does not meet the criteria - this field is not a valid string" } })
            return;

        };

        // if (!(/^(?=(?:.*[a-z]){2})(?!.*[a-z]{4})(?=(?:.*[A-Z]){2})(?!.*[A-Z]{3})(?=(?:.*[0-9]){3})(?!.*[0-9]{4})(?=(?:.*[_.*\-]){1})(?!.*[_.*\-]{2})[a-zA-Z0-9_.*\-]{8,}$/.test(currentValue))) {

        //     setUserError({
        //         ...userError, "password": {
        //             "isError": true,
        //             "error": (`Password field does not meet the criteria - 
        //         this field must contain:
        //         2 minimum & 4 maximum lowercase alphabetic characters
        //         2 minimum & 3 maximum uppercase alphabetic characters
        //         3 minimum & 4 maximum numbers
        //         1 minimum & 2 maximum punctuation character
        //         Password must be of length of 8 or more characters
        //         `)
        //         }
        //     });
        // };

        setUser({ ...user, "password": currentValue });

    }, [user]);

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

                                        <div className="mb-3">
                                            <label htmlFor="user-name" className="form-label">Name</label>
                                            <input type="text" name="name" className="form-control" id="user-name"
                                                placeholder="Name" onChange={onNameChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="user-username" className="form-label">Username</label>
                                            <input type="text" name="username" className="form-control" id="user-username"
                                                placeholder="Username" onChange={onUsernameChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="user-password" className="form-label">Password</label>
                                            <input type="password" name="password" className="form-control" id="user-password"
                                                placeholder="Password" onChange={onPasswordChange} />
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
                <Navigate to={"/"} />}
    </>);

};

export default Confirm;