import React from "react";
import Login from "./Login";
import RequestRegistration from "./RequestMutation";
import { useRequestMutation } from "../../Services/Registration";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition, BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import { IPOSTRecovery } from "../../Types/Temp/Recovery";

type IRecoveryRequestMutation = UseMutation<MutationDefinition<string | IPOSTRecovery, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, { "status": "Created" | "No User" | "Exists" | "Bad Request" | "Internal Server Error" }, "recoveryAPI" | "registrationAPI">>;

const Authenticate = (): JSX.Element => {

    const [authAction, setAuthAction] = React.useState<"login" | "signup">("login");

    return (<>
        {authAction === "login"
            ?
            <div className="form-login">

                <Login />

                <a className="" href="#" onClick={() => { setAuthAction("signup") }}>New around here? Sign up</a>
                <a className="" href="/forgotPassword">Forgot password?</a>

            </div>
            :
            <div className="form-login">

                <RequestRegistration type={"registration"} useRequestMutation={useRequestMutation as IRecoveryRequestMutation} />

                <a className="" href="#" onClick={() => { setAuthAction("login") }}>You're already a user? Log in</a>

            </div>
        }

    </>);

};

export default Authenticate;