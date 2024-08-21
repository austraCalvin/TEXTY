import React from "react";
import { useNavigate, Navigate } from "react-router";
import { useConfirmMutation } from "../../../Services/Recovery";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// import { useSearchParams } from "react-router-dom";

interface IConfirmProps {

    "id": string;
    "code": number;

};

const Confirm = (props: IConfirmProps): JSX.Element => {

    const [confirmRecovery, { data: confirmedRecovery, error: confRegError }] = useConfirmMutation();
    const [currentStatus, setStatus] = React.useState<"Patched" | "Bad Request" | "Internal Server Error" | "Not Found" | "Unauthorized" | null>(null);

    const [password, setPassword] = React.useState<string | undefined>();
    const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>();

    const navigateFn = useNavigate();

    const OKFn = React.useCallback(() => {

        navigateFn("/");

    }, []);

    const confirmFn = React.useCallback(() => {

        confirmRecovery({ "id": props.id, password, "code": props.code });

    }, [password, confirmPassword]);

    React.useEffect(() => {

        if (confRegError) {

            const fetchError = confRegError as FetchBaseQueryError;

            console.log(`RECOVERY CONFIRM FETCH ERROR - STATUS=${fetchError.status}`);
            return;

        };

        if (!confirmedRecovery) {

            console.log("RECOVERY CONFIRM IS UNDEFINED!");
            return;

        };

        console.log("RECOVERY CONFIRM FETCH SUCEEDED!");
        console.log(confirmedRecovery.status);
        setStatus(confirmedRecovery.status);

    }, [confirmedRecovery]);

    const onPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            return;

        };

        console.log(`Password just changed - typeof='${typeof currentValue}'`);
        setPassword(currentValue);

    }, []);

    const onConfirmPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            return;

        };

        setConfirmPassword(currentValue);

    }, []);


    return (!(currentStatus === "Not Found")
        ?
        <>
            <main>
                {
                    !(currentStatus === "Patched")
                        ?
                        <>
                            <div className={`${currentStatus === "Unauthorized" ? "is-invalid" : ""}`} aria-describedby="confirm-password-feedback">

                                <div className="mb-3"
                                    aria-describedby="recovery-confirm-feedback">
                                    <label htmlFor="user-password" className="form-label">password</label>
                                    <input type="password" className="form-control" id="user-password" value={password} onChange={onPasswordChange} />
                                </div>

                                <div className={`mb-3 ${(password !== undefined && confirmPassword !== undefined) ? (password !== confirmPassword ? "is-invalid" : "") : ""}`} aria-describedby="confirm-password-feedback">
                                    <label htmlFor="confirm-password" className="form-label">repeat password</label>
                                    <input type="password" className="form-control" id="confirm-password" value={confirmPassword} onChange={onConfirmPasswordChange} />
                                </div>

                                <div id="confirm-password-feedback" className="invalid-feedback">

                                    The two fields are to be the same password

                                </div>

                            </div>

                            <div id="recovery-confirm-feedback" className="invalid-feedback">
                                {
                                    currentStatus === "Unauthorized"
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
                                currentStatus === "Internal Server Error"
                                    ?
                                    <></>
                                    :
                                    <button type="button" className="btn btn-primary d-block mx-auto" onClick={confirmFn}>RECOVER</button>
                            }

                        </>
                        :
                        <>
                            <p>Recovery has been confirmed</p>

                            <button className="btn btn-success" onClick={OKFn}>OK</button>
                        </>
                }
            </main>

        </>
        :
        <Navigate to={"/"} />
    );

};

export default Confirm;