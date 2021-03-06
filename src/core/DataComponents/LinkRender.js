import React from 'react';
import { Link } from '@mui/material';


export function LinkRender(props) {
    if(!props.value) return null;
    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" onClick={() => {
        if (props.column.onClick)
            props.column.onClick(props);
    }}>{props.value}</Link>;
}
