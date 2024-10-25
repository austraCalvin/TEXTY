import { createEntityAdapter, createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { ILocalMessageRequest, IMessageRequest } from "../../Types/Message/Request";



interface ILocalMessageRequestEntity {

    ids: EntityId[];
    entities: Record<ILocalMessageRequest["id"], ILocalMessageRequest | undefined>,
};

const entity = createEntityAdapter<ILocalMessageRequest>({
    "selectId": (model) => model.id
});

const initialState = {

    ...entity.getInitialState(),

} satisfies ILocalMessageRequestEntity as ILocalMessageRequestEntity;

export const reducer = createSlice({
    "name": "messageRequest",
    initialState,
    "reducers": {

        "init": entity.setAll,
        "add": (state, action: PayloadAction<ILocalMessageRequest>) => {

            console.log("message-request payload:", action.payload);

            if (action.payload.userId) {

                entity.addOne(state, { "id": action.payload.id, "messageId": action.payload.messageId, "userId": action.payload.userId });

            } else {

                entity.addOne(state, { "id": action.payload.id, "messageId": action.payload.messageId, "contactId": action.payload.contactId });

            };

        },
        "remove": entity.removeOne,
        "edit": entity.updateOne

    },

});

export const selectMessageRequestById = (state: RootState, id: ILocalMessageRequest["id"]) => {

    const elementId = state.messageRequest.ids.findIndex((each) => {

        return each === id;

    });

    if (elementId === -1) {

        return null;

    };

    return state.messageRequest.entities[id] as ILocalMessageRequest;

};

export const selectAllMessageRequestIds = (state: RootState) => {

    return state.messageRequest.ids;

};

export const selectAllMessageRequests = (state: RootState) => {

    return state.messageRequest.entities;

};

export const { add, remove, edit, init } = reducer.actions;