import { SortContext } from "../../Context/SearchInput";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import { selectAllMessageRequestIds, selectAllMessageRequests } from "../../Redux/Reducer/MessageRequest";
import { IMessageRequest } from "../../Types/Message/Request";
import Request from "../Chats/Request";

const RequestList = (): JSX.Element => {

    const requestListIds = useAppSelector(selectAllMessageRequestIds);
    const requestListRaw = useAppSelector(selectAllMessageRequests);

    console.log(`contact list current length: ${requestListIds}`);
    const requestList: IMessageRequest[] = Object.values(requestListRaw) as IMessageRequest[];

    return (<>
        {
            requestListIds.filter((requestId, index) => {

                console.log("request list going")

                const currentRequest = requestListRaw[requestId] as IMessageRequest;

                if (!currentRequest.contactId) {

                    return true;

                } else if (!currentRequest.userId) {

                    return false;

                };

            }).map((requestId, index) => {

                const currentRequest = requestListRaw[requestId] as IMessageRequest;

                return <Request key={`request-${index}`} id={currentRequest.id} userId={currentRequest.userId} />;

            })
        }

    </>);

};

export default RequestList;