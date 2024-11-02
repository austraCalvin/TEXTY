import React from "react";
import { useParams, Navigate } from "react-router";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/query";
import ConfirmRegistration from "./Registration/Confirm";
import ConfirmRecovery from "./Recovery/Confirm";
import { UseMutation, UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";

interface IRequestMutationProps {

    "type": "registration" | "recovery";

    useCheckQuery: UseQuery<QueryDefinition<string, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "OK" | "Not Found" | "Internal Server Error" }, "registrationAPI" | "recoveryAPI">>;

    useValidateMutation: UseMutation<MutationDefinition<{ "id": string, "code": number }, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "OK" | "Authorized" | "Unauthorized" | "Bad Request" | "Not Found" | "Internal Server Error" }, "registrationAPI" | "recoveryAPI">>

};

const Validate = (props: IRequestMutationProps): JSX.Element => {

    const currentParams = useParams() as { "id": string };

    const { data: registration, error: regError, refetch: reCheckReg } = props.useCheckQuery(currentParams.id);
    const [validateRegistration, { data: validatedRegistration, error: valRegError }] = props.useValidateMutation();

    const [isReg, setReg] = React.useState<"OK" | "Authorized" | "Unauthorized" | "Bad Request" | "Not Found" | "Internal Server Error" | null>(null);
    const [inputValue, setInputValue] = React.useState<number | undefined>(undefined);

    const onInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        if (!(/^\d+$/.test(e.currentTarget.value))) {

            console.log(`Input for registration-code is invalid`);
            return;

        };

        setInputValue(Number(e.currentTarget.value));

    }, []);

    const validateCodeFn = React.useCallback(() => {

        if (!inputValue) {

            return;

        };

        validateRegistration({ "id": currentParams.id, "code": inputValue });

    }, [inputValue]);

    React.useEffect(() => {

        if (regError) {

            const fetchError = regError as FetchBaseQueryError;

            console.log(`${props.type.toUpperCase()} FETCH ERROR - STATUS=${fetchError.status}`);

            if (fetchError.status === "PARSING_ERROR") {

                console.log(`${props.type.toUpperCase()} HAS BEEN REFETCH!`);
                reCheckReg();

            };

            return;

        };

        if (!registration) {

            console.log(`${props.type.toUpperCase()} HAS BEEN REFETCH!`);
            reCheckReg();
            return;

        };

        console.log(`${props.type.toUpperCase()} FETCH SUCEEDED!`);
        setReg(registration.status);

    }, [registration]);

    React.useEffect(() => {

        if (valRegError) {

            const fetchError = valRegError as FetchBaseQueryError;

            console.log(`REGISTRATION CONFIRM FETCH ERROR - STATUS=${fetchError.status}`);
            return;

        };

        if (!validatedRegistration) {

            console.log("REGISTRATION CONFIRM IS UNDEFINED!");
            return;

        };

        console.log("REGISTRATION CONFIRM FETCH SUCEEDED!");
        setReg(validatedRegistration.status);

    }, [validatedRegistration]);

    return (<div className="form-recovery">
        {
            !(isReg === "Not Found")
                ?
                <>
                    {/* <header>texty</header> */}

                        {
                            isReg === "Authorized"
                                ?
                                (
                                    props.type === "registration"
                                        ?
                                        <ConfirmRegistration id={currentParams.id} code={inputValue as number} />
                                        :
                                        props.type === "recovery"
                                            ?
                                            < ConfirmRecovery id={currentParams.id} code={inputValue as number} />
                                            :
                                            <></>
                                )
                                :
                                !(isReg === null)
                                    ?
                                    <>
                                        <div className="mb-2">
                                            <label htmlFor="registration-code" className="form-label">Code</label>
                                            <input type="number" className={`form-control ${(["Unauthorized", "Bad Request"]).includes(isReg) ? "is-invalid" : ""}`} id="registration-code" aria-describedby="registration-code-feedback" value={inputValue} onChange={onInputChange} />
                                            <div id="registration-code-feedback" className="invalid-feedback">
                                                {
                                                    isReg === "Unauthorized"
                                                        ?
                                                        <>
                                                            The code inserted is incorrect
                                                        </>
                                                        :
                                                        isReg === "Bad Request"
                                                            ?
                                                            <>
                                                                The code inserted must be a number
                                                            </>
                                                            :
                                                            <>
                                                                Unexpected error has occurred
                                                                <br />
                                                                Please, refresh the page and try again
                                                            </>

                                                }

                                            </div>
                                        </div>
                                        <button className="btn btn-success" onClick={validateCodeFn}>SEND</button>
                                    </>
                                    :
                                    <div style={{ "width": "10rem", "height": "10rem" }} className={`spinner-border text-success d-block mx-auto`} role="status"></div>
                        }

                </>
                :
                <Navigate to={"/"} />
        }
    </div>);

};

export default Validate;