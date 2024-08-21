import React from "react";
import { logIn } from "../../Redux/Reducer/Authentication";
import { useAppDispatch } from "../../Redux/Hooks";
import { useLogInMutation } from "../../Services/Authentication";

const Login = (): JSX.Element => {

    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const dispatch = useAppDispatch();

    const [DBlogIn, { data: logInState, error: logInError }] = useLogInMutation();

    React.useEffect(() => {

        if (!logInState || logInError) {

            return;

        };

        if (logInState.state === "Fail") {

            return;

        };

        dispatch(logIn());

    }, [logInState]);

    const loginFn = (username: string, password: string) => {

        const requestBody = { username, password };

        DBlogIn(requestBody);
        
    };

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            return;

        };

        setUsername(currentValue);

    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const currentValue = e.currentTarget.value;

        if (!(Object.prototype.toString.call(currentValue) === ("[object String]"))) {

            return;

        };

        setPassword(currentValue);

    };

    return (<>

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

        <form className="p-2">

            <div className="mb-3">
                <label htmlFor="username-input" className="form-label">Username</label>
                <input type="text" name="username" className="form-control" id="username-input"
                    placeholder="Username" onChange={onUsernameChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="password-input" className="form-label">Password</label>
                <input type="password" name="password" className="form-control" id="password-input"
                    placeholder="Password" onChange={onPasswordChange} />
            </div>

            <button type="button" className="btn btn-primary" onClick={() => { loginFn(username, password) }}>Log in</button>
        </form>
    </>);

};

export default Login;