import React from "react";
import { createContext, useState } from "react";
import { BeforeInstallPromptEvent } from "../extends";

export const InstallPromoContext = createContext<{ "installPromo": BeforeInstallPromptEvent | null, "isUserChoice": () => void }>({
    "installPromo": null,
    "isUserChoice": () => { }
});

interface IInstallPromoProps {

    "children": React.ReactNode;

};

const CInstallPromoContext = (props: IInstallPromoProps) => {

    const [installPromo, setInstallPromo] = React.useState<BeforeInstallPromptEvent | null>(null);

    const isUserChoice = React.useCallback(() => {

        if (!installPromo) {

            return;

        };

        installPromo.prompt();

        installPromo.userChoice.then((currentUserChoice) => {

            setInstallPromo(null);
            console.log("Install prompt succeeded -", " outcome=", currentUserChoice.outcome);

        }).catch((err) => {

            setInstallPromo(null);
            console.log("Install prompt failed -", err);

        });

    }, [installPromo]);


    React.useLayoutEffect(() => {

        if (!window) {

            console.log("Error from App component at useLayoutEffect - window global object does NOT exist");
            return;

        };

        console.log("¡Listening for install prompt!");

        window.addEventListener("beforeinstallprompt", (e) => {

            console.log("beforeinstallprompt triggered!");
            console.log(`Event = ${!!e}`);
            e.preventDefault();
            setInstallPromo(e);

        });

        window.addEventListener("appinstalled", (e) => {

            setInstallPromo(null);
            console.log("¡The app has been successfully installed!");

        });

    }, []);

    return (<InstallPromoContext.Provider value={{
        installPromo,
        isUserChoice
    }}>

        {props.children}

    </InstallPromoContext.Provider>)

};

export default CInstallPromoContext;