interface IRegistration {

    "id": string;
    "email": string;
    "ttl": Date;
    "code": number;

};

export type IPartialRegistration = Partial<IRegistration>;

export type IPOSTRegistration = Partial<Omit<IRegistration, "id" | "ttl" | "code">>;

export default IRegistration;