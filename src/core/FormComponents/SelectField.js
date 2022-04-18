import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Alert, Autocomplete, CircularProgress, Grid, IconButton, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDeepCompareEffect } from 'react-use';

import { useRebexData } from '../../contexts/RebexDataProvider';
export function SelectField(props) {
    const { translate } = useRebexData();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const valueField = props.valueField || 'value';
    const labelField = props.labelField || 'label';
    const [hasError, setHasError] = useState(false);
    const isRemote = Boolean(props.source && props.form && props.form.options && props.form.options.provider);
    var currentValues = null;
    if (Array.isArray(data)) {
        if (Array.isArray(props.value)) {
            currentValues = props.value.map(v => data.find(d => d[valueField] === v));
        }
        else {
            currentValues = data.find(d => d[valueField] === props.value);
        }
    }
    const retrieveItems = async () => {
        if (!isRemote) return;
        setHasError(false);
        setLoading(true);
        if (props.source) {
            var req = props.form.options.provider.create({
                ...props.source
            });
            await req.retrieve();
            if (Array.isArray(req.data)) setData(req.data);
            else setHasError(true);
        }
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }

    useEffect(() => {
        retrieveItems();
    }, []);

    useDeepCompareEffect(() => {
        retrieveItems();
    }, [props.source]);

    return (<>
        <Grid container alignItems={"center"} sx={{ position: 'relative' }}>
            <Grid item flex={1}>
                <Autocomplete
                    disabled={loading}
                    renderInput={(params) => <TextField {...params} fullWidth InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }} />}
                    {...props.props}
                    getOptionLabel={(option) => option[labelField]}
                    options={Array.isArray(data) ? data : []}
                    value={currentValues || null}
                    onChange={(e, v) => {
                        if (props.onChange) {
                            if (Array.isArray(v)) {
                                props.onChange(v.map(v => v[valueField]));
                            }
                            else {
                                props.onChange(v ? v[valueField] : null);
                            }
                        }
                    }}
                />
            </Grid>
            {hasError && isRemote && (<Grid item>
                <IconButton onClick={retrieveItems}>
                    <RefreshIcon />
                </IconButton>
            </Grid>)}
        </Grid>
        {hasError && <Alert sx={{ mt: 0.5 }} severity='error'>{translate("select.loading.error")}</Alert>}
    </>);
}