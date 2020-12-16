import React from 'react';
import {useGlobal} from "reactn";

function RenderField(props) {
    const [addedFields, setAddedField] = useGlobal("addedFields")
    return (
        <div>

        </div>
    );
}

export default RenderField;
