import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, MutationDefinition, ResultTypeFrom } from "@reduxjs/toolkit/query";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { IPOSTRecovery } from "../../Types/Temp/Recovery";

interface IRequestMutationProps {

    "type": "registration" | "recovery";
    useRequestMutation: UseMutation<MutationDefinition<string | IPOSTRecovery, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "Created" | "Exists" | "No User" | "Bad Request" | "Internal Server Error" }, "registrationAPI" | "recoveryAPI">>

};

const RequestMutation = (props: IRequestMutationProps): JSX.Element => {

    const currentLocation = useLocation();

    const [isSignedup, setSignupState] = React.useState<boolean>(false);
    const [currentEmail, setEmail] = React.useState<string>("");
    const [requestMutation, { data: requestedMutation, error: reqMutError }] = props.useRequestMutation();
    const [isRequest, setRequest] = React.useState<"Created" | "Exists" | "No User" | "Bad Request" | "Internal Server Error" | null>(null);

    const requestFn = React.useCallback(() => {

        if (props.type === "registration") {

            requestMutation(currentEmail);

        } else {

            const splitted = currentLocation.pathname.split("/"),
                lastElement = splitted[splitted.length - 1];

            if (lastElement === "forgotPassword") {

                requestMutation({ "type": "password", "userEmail": currentEmail });

            };

        };

        console.log("Current-location ->", `'${currentLocation.pathname}'`);

        return () => { };

    }, [currentEmail]);

    React.useEffect(() => {

        console.log("requested-mutation --->");

        if (reqMutError) {

            const fetchError = reqMutError as FetchBaseQueryError;

            console.log(`${props.type.toUpperCase()} REQUEST FETCH ERROR - STATUS=${fetchError.status}`);
            return;

        };

        if (!requestedMutation) {

            console.log(`${props.type.toUpperCase()} REQUEST IS UNDEFINED!`);
            return;

        };

        console.log(`${props.type.toUpperCase()} REQUEST FETCH SUCEEDED!`);
        setRequest(requestedMutation.status);

    }, [requestedMutation]);

    React.useEffect(() => {

        if (!(isRequest === "Created")) {

            return;

        };

        console.log("The user has been invited for registration");
        setSignupState(true);

    }, [isRequest]);

    const onEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            return;

        };

        setEmail(currentValue);

    }, []);

    return (<>
        <form className={`${props.type === "recovery" ? "form-recovery" : ""} p-2`}>
            <div className="mb-3">
                {/* isSignedup */}
                <label htmlFor="mutation-request" className="form-label">Email</label>
                <input type="email" className={`form-control ${(["Incorrect", "Bad Request", "Exists"]).includes(isRequest as string) ? "is-invalid" : ""}`} id="mutation-request" aria-describedby="mutation-request-feedback" value={currentEmail} onChange={onEmailChange} />
                <div id="mutation-request-feedback" className="invalid-feedback">

                    {(

                        props.type === "registration"
                            ?
                            (
                                isRequest === "Exists"
                                    ?
                                    <>
                                        The email inserted is already in use
                                    </>
                                    :
                                    isRequest === "Created"
                                        ?
                                        <>
                                            The request has been sent to your email
                                        </>
                                        :
                                        <></>
                            )
                            :
                            props.type === "recovery" && isRequest === "No User"
                                ?
                                <>
                                    The current email is not signed up
                                </>
                                :
                                (
                                    isRequest === "Bad Request"
                                        ?
                                        <>
                                            The field value inserted must be an email
                                        </>
                                        :
                                        <>
                                            Unexpected error has occurred
                                            <br />
                                            Please, refresh the page and try again
                                        </>
                                )
                    )}

                </div>
            </div>
            {
                isRequest === "Internal Server Error"
                    ?
                    <></>
                    :
                    <button className="btn btn-primary" onClick={requestFn}>REQUEST</button>
            }
        </form>
    </>
    );

};

export default RequestMutation;