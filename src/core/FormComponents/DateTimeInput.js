import React from 'react';
import { TextField } from "@mui/material";
import { DateTimePicker } from '@mui/lab';
import moment from 'moment';

export function DateTimeInput(props) {
    return (<DateTimePicker
        {...props}
        value={props.value ? (moment(props.value, props.format)) : null}
        onChange={(e) => {
            props.onChange(e ? (
                props.format ? moment(e).format(props.format) : moment(e).toDate().toISOString()
            ) : null);
        }}
        renderInput={(params) => <TextField fullWidth {...params} />} />);
}
