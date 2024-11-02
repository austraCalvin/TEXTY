import React from "react";
import { SortContext } from "../../../Context/SearchInput";

const NotificationSearch = (): JSX.Element => {

    const { inputRef, sort, isFocused, inputOnChange, inputOnFocus, inputOnBlur } = React.useContext(SortContext);

    return (<div className="input-group search-input">

        <button type="button" className="btn d-flex justify-content-center align-items-center"
            aria-label="Search">

            {
                isFocused
                    ?
                    <i className="fa-solid fa-arrow-left text-success"></i>
                    :
                    <i className="fa-solid fa-magnifying-glass text-secondary"></i>
            }

        </button>

        <input ref={inputRef} type="text" className="form-control" aria-label="Search" placeholder="Search" value={sort} onChange={inputOnChange} onFocus={inputOnFocus} onBlur={inputOnBlur} />

        {
            sort
                ?
                <button type="button" className="btn d-flex justify-content-center align-items-center"
                    aria-label="Close">

                    <i className="fa-solid fa-xmark text-secondary"></i>

                </button>
                :
                <></>
        }


    </div>);

};

export default NotificationSearch;