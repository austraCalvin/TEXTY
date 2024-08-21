import React from "react";
import { clientSocket } from "..";
import ChatApp from "./ChatApp";

const Welcome = (): JSX.Element => {

    const [isSocketOnline, setSocketOnline] = React.useState<boolean>(clientSocket.connected);

    React.useEffect(() => {

        const localPromise: Promise<void> = new Promise((success, danger) => {

            //for success
            clientSocket.on("connect", () => {

                success();

            });

            //for catch
            const timeoutID = setTimeout(() => {

                if (clientSocket.connected) {
                    return;
                };

                danger("SOCKET failed connecting to the server - timeout");

            }, 5000);

            clientSocket.on("connect_error", (err) => {

                clearTimeout(timeoutID);
                danger(err);

            });

        });

        localPromise.then(() => {

            setSocketOnline(true);

        }).catch((err) => {

            if (!err) {
                return;
            };

            console.log("Error from clientSocket.connect", err);

        });

    });

    return (
        isSocketOnline
            ?
            <ChatApp />
            :
            <div className={`spinner-border text-success d-block mx-auto spinner-border-lg`} role="status"></div>
    );

};

export default Welcome;