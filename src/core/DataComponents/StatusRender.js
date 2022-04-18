import React from 'react';
import { Chip } from '@mui/material';


export function StatusRender(props) {
    if (!props.column || !props.column.colorMap || !props.column.map) return null;
    const column = props.column;
    const colorValue = (column.colorMap && column.colorMap[props.value]);
    const color = colorValue ? colorValue : 'default';
    const text = (column.colorMap && column.map[props.value]) || props.value;
    return <Chip {...props} color={color} label={text}></Chip>;
}
