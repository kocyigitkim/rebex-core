import React from 'react';
import { Chip } from '@mui/material';
import { truncateString } from '../../utils';


export function IdRender(props) {
    if(!props.value) return null;
    return <Chip {...props} onClick={() => {
        if (props.column.onClick)
            props.column.onClick(props);
    }} label={truncateString("#" + (props.showId ? props.value : ''), 10)}></Chip>;
}
