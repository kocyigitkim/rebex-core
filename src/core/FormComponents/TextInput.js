import React from 'react';
import { TextField, Typography } from "@mui/material";
import { Checkbox, Radio, FormControlLabel } from '@mui/material';
export function TextInput(props) {
    return (<TextField {...props} onChange={(e) => {
        if (props.onChange)
            props.onChange(e.target.value);
    }} value={props.value || ''} />);
}

export function CheckBoxField(props) {
    return (<FormControlLabel control={<Checkbox {...props} onChange={(e) => {
        if (props.onChange)
            props.onChange(e.target.checked);
    }} checked={props.checked} />} label={props.label ? (
        <Typography sx={{ userSelect: 'none' }}>{props.label}</Typography>
    ) : undefined} />);
}
export function RadioListField(props){
    const radios = props.items && props.items.map((option, index) => {
        return (<FormControlLabel key={index} control={<Radio {...props} value={option.value} checked={option.value === props.value} onClick={(e) => {
            if (props.onChange)
                props.onChange(option.value);
        }} />} label={option.label} />);
    }
    );
    return (<>
        {radios}
    </>);
}