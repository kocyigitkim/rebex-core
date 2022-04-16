import React from 'react';
import { Chip } from '@mui/material';


export function BadgeRender(props) {
    return <Chip {...props} label={props.value}></Chip>;
}
