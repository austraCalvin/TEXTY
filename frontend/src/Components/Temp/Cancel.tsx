import React, { useContext } from "react";
import { useNavigate } from "react-router";
// import { useCancelQuery } from "../../../Services/Registration";
import { useParams } from "react-router-dom";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, QueryDefinition } from "@reduxjs/toolkit/query";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";

type CancelQuery = UseQuery<QueryDefinition<string, BaseQueryFn<string | FetchArgs, {}, FetchBaseQueryError, {}, FetchBaseQueryMeta>, never, {"status": "Success" | "Fail"}>>;

const Cancel = ({type, useCancelQuery }: { "type": "registration" | "recovery", "useCancelQuery": CancelQuery }): JSX.Element => {

    const currentParams = useParams() as { "id": string },
        { data, error, refetch } = useCancelQuery(currentParams.id),
        navigate = useNavigate();

    const OKfn = () => {

        navigate("/");

    };

    React.useEffect(() => {

        if (error) {

            const fetchError = error as FetchBaseQueryError;

            console.log(`CANCELLATION FETCH ERROR - STATUS=${fetchError.status}`);

            if (fetchError.status === "PARSING_ERROR") {

                console.log("CANCELLATION HAS BEEN REFETCH!");
                refetch();

            };

            return;

        };

        if (!data) {

            console.log("CANCELLATION HAS BEEN REFETCH!");
            refetch();
            return;

        };

        console.log("CANCELLATION FETCH SUCEEDED!", `outcome=${data.status}`);

    }, [data]);

    return (<>

        <header>texty</header>

        <main>
            <div>
                Thanks for letting us know
                <br />
                We're always looking out for your security on Facebook. Learn more about what you can do to help keep your account secure
            </div>
        </main>

        <button className="btn btn-success" onClick={OKfn}>OK</button>

        <footer>Still having problems?</footer>

    </>);

};

export default Cancel;