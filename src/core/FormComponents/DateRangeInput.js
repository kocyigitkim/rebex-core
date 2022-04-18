import React from 'react';
import { Box, TextField } from "@mui/material";
import { DateRangePicker } from '@mui/lab';
import moment from 'moment';
import { ArrowRightAltOutlined } from '@mui/icons-material';

export function DateRangeInput(props) {
    return (<DateRangePicker
        {...props}
        value={props.value ? (
            props.value.map((v) => moment(v, props.format))
        ) : [null, null]}
        onChange={(e) => {
            props.onChange(e ? (
                props.format ? e.map((v) => v && moment(v).format(props.format)) : e.map((v) => v && moment(v).toDate().toISOString())
            ) : [null, null]);
        }}
        renderInput={(startProps, endProps) => (
            <Box display={"flex"} alignItems="center" sx={{ width: '100%' }}>
                <TextField sx={{ flex: 1 }} fullWidth {...startProps} label={undefined} />
                <ArrowRightAltOutlined />
                <TextField sx={{ flex: 1 }} fullWidth {...endProps} label={undefined} />
            </Box>
        )} />);
}
