import type { RootState, AppDispatch } from "../Store";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch,
    useAppSelector: TypedUseSelectorHook<RootState> = useSelector;