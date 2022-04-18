import React from 'react';
import { Chip } from '@mui/material';


export function BadgeRender(props) {
    if(!props.value) return null;
    return <Chip {...props} label={props.value}></Chip>;
}
