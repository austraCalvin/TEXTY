interface IUserConfiguration {

    "id": string;
    "online": "everyone" | "lastOnline";
    "writing": boolean;
    "lastOnline": "everyone" | "contact" | "none";
    "read": boolean;
    "approve": "contact" | "group" | "both" | "none";
    "notify": boolean;
    "push": boolean;
    "email": boolean;

};

export type IPartialUserConfiguration = Partial<IUserConfiguration>;

export type IPOSTUserConfiguration = Omit<IUserConfiguration, "id">;

export type IEDITUserConfiguration = Omit<IPartialUserConfiguration, "id">;

export type IUserConfigurationKeys = Array<keyof IUserConfiguration>;

export default IUserConfiguration;