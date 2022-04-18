import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { LoadingOverlay } from '../../base/components/LoadingOverlay';

export function ImageRender(props) {
    const [loading, setLoading] = useState(true);
    const onLoadStart = () => setLoading(true);
    const onLoadedData = () => setTimeout(() => { setLoading(false); }, 500);
    useEffect(() => {
        onLoadStart();
    }, [props.value]);
    return <div style={{ position: 'relative', display: 'inline-block' }}>
        <LoadingOverlay style={{ borderRadius: '100%', transform: 'scale(1.2)' }} size={20} loading={loading} />
        <Avatar imgProps={{
            onLoad: onLoadedData
        }} {...props} src={props.value} />
    </div>;
}
