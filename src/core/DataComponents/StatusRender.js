import React from 'react';
import { Chip } from '@mui/material';


export function StatusRender(props) {
    const column = props.column;
    const color = (column.colorMap && column.colorMap[props.value]) || 'inherit';
    const text = (column.colorMap && column.map[props.value]) || props.value;
    return <Chip {...props} color={color} label={text}></Chip>;
}
