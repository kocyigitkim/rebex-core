import React from 'react';
import { Link } from '@mui/material';


export function EmailRender(props) {
    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" href={`mailto:${props.value}`} onClick={() => {
        if (props.column.onClick)
            props.column.onClick(props);
    }}>{props.value}</Link>;
}
