import React from "react";
import { selectCurrentContact, touch } from "../../Redux/Reducer/Chat";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { useParams, Navigate } from "react-router-dom";
// import { useSearchParams, useParams, Navigate } from "react-router-dom";

const NotificationResponse = (): JSX.Element => {

    const dispatch = useAppDispatch();

    const { id } = useParams();
    // const [searchParams, setURLSearchParams] = useSearchParams();

    // const result = ["text"].map((e) => searchParams.get(e));

    // console.log("messageId:", messageId);
    // console.log("message by url:", result);

    // const currentId = id ? id : userId;
    const currentId = id;

    console.log("id for redirect:", currentId);

    if (currentId) {

        dispatch(touch(currentId));

    };

    return (<Navigate to={"/"}></Navigate>);

};

export default NotificationResponse;