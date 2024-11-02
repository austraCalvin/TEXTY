import React from "react";
import { useAppDispatch } from "../Redux/Hooks";
import { logOut as LocallogOut } from "../Redux/Reducer/Authentication";
import { useNavigate } from "react-router-dom";
import { useLogOutMutation } from "../Services/Authentication";

interface ILogOutContext {

    "onLogOutClick": () => void;

};

export const LogOutContext = React.createContext<ILogOutContext>({

    "onLogOutClick": () => { }

});

interface ICLogOutContextProps {

    "children": React.ReactNode;

};

const LogOut = (props: ICLogOutContextProps): JSX.Element => {

    const [DBlogOut, { data: logOutState, error: logOutError }] = useLogOutMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onLogOutClick = React.useCallback(() => {

        console.log("logout button!");

        DBlogOut().unwrap().then((success) => {

            console.log("LogOut succeeded - state:", success);
            dispatch(LocallogOut());
            navigate("/login");

        }).catch((err) => {

            console.log("LogOut failed - error:", err);

        });

    }, []);

    React.useEffect(() => {

        if (logOutError || !logOutState) {

            console.log("Logout action failed");
            return;

        };

        console.log("Logout action succeeded");

    }, [logOutState]);


    return (<LogOutContext.Provider value={{
        onLogOutClick
    }}>

        {props.children}

    </LogOutContext.Provider>)

};

export default LogOut;