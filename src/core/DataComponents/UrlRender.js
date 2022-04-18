import React from 'react';
import { Link } from '@mui/material';


export function UrlRender(props) {
    if(!props.value) return null;
    var link = props.value || "";
    if (link.indexOf("http://") === -1 && link.indexOf("https://") === -1)
        link = "http://" + link;

    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" href={link} onClick={() => {
        if (props.column.onClick)
            props.column.onClick(props);
    }}>{props.value}</Link>;
}
