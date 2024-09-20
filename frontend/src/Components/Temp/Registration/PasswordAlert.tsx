import React from "react";
import { useNavigate, Navigate } from "react-router";
import { useConfirmMutation } from "../../../Services/Registration";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ISignupUser } from "../../../Types/User/User";

interface IAlertProps {

    "error": boolean;

};

const PasswordAlert = (props: IAlertProps): JSX.Element => {

    const [isShow, setShow] = React.useState<boolean>(true);

    const onCloseBtn = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();

        setShow(false);

    }, []);

    return (
        <div className={`alert ${props.error ? "alert-danger" : "alert-info alert-dismissible"} ${props.error ? "d-block" : !props.error ? (isShow ? "" : "d-none") : ""}`} role="alert">

            <strong>The password must have at least 9 characters:</strong>

            <ul>
                <li>Minimum 6 numbers</li>
                <li>Minimum 2 lowercase letters</li>
                <li>Minimum 1 uppercase letters</li>
                <li>Minimum 1 special sign {"(./*_-)"}</li>
            </ul>

            {
                props.error
                    ?
                    <></>
                    :
                    <button type="button" className="btn-close" aria-label="Close" onClick={onCloseBtn}></button>
            }

        </div>
    );

};

export default PasswordAlert;