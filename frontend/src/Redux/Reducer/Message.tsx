import { createEntityAdapter, createSlice, createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import IMessage from "../../Types/Message/Message";

interface IMessageEntity {

    ids: EntityId[];
    entities: Record<IMessage["id"], IMessage | undefined>,
};

const entity = createEntityAdapter<IMessage>({
    "selectId": (model) => model.id
});

const initialState = {

    ...entity.getInitialState(),


} satisfies IMessageEntity as IMessageEntity;

export const reducer = createSlice({
    "name": "message",
    initialState,
    "reducers": {

        "init": entity.setAll,
        "add": entity.addOne,
        "remove": entity.removeOne,
        "edit": entity.updateOne

    },

});

export const selectMessageById = (state: RootState, id: IMessage["id"]) => {

    const elementId = state.message.ids.findIndex((each) => {

        return each === id;

    });

    if (elementId === -1) {

        return null;

    };

    return state.message.entities[id] as IMessage;

};

export const selectAllMessages = (state: RootState) => {

    return state.message.entities;

};

export const { add, remove, edit, init } = reducer.actions;