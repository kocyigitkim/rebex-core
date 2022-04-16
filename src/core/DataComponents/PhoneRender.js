import React from 'react';
import { Link } from '@mui/material';


export function PhoneRender(props) {
    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" href={`tel:${props.value}`} onClick={() => {
        if (props.column.onClick)
            props.column.onClick(props);
    }}>{props.value}</Link>;
}
