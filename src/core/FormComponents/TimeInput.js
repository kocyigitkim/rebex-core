import React from 'react';
import { TextField } from "@mui/material";
import { TimePicker } from '@mui/lab';
import moment from 'moment';

export function TimeInput(props) {
    return (<TimePicker
        {...props}
        value={props.value ? (moment(props.value, props.format)) : null}
        onChange={(e) => {
            try {
                props.onChange(e ? (
                    props.format ? moment(e).format(props.format) : moment(e).toDate().toISOString()
                ) : null);
            } catch (err) {
                console.log(err);
            }
        }}
        renderInput={(params) => <TextField fullWidth {...params} />} />);
}
