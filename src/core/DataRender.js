import React, { useEffect, useState } from 'react'
import { BadgeRender } from './DataComponents/BadgeRender';
import { IdRender } from './DataComponents/IdRender';
import { EmailRender } from './DataComponents/EmailRender';
import { PhoneRender } from './DataComponents/PhoneRender';
import { UrlRender } from './DataComponents/UrlRender';
import { StatusRender } from './DataComponents/StatusRender';
import { LinkRender } from './DataComponents/LinkRender';
import { Avatar } from '@mui/material';
import { LoadingOverlay } from '../base/components/LoadingOverlay';
export function DataRender(props) {
    const eventNames = Object.keys(props.column).filter(key => key.startsWith('on'));
    const events = eventNames.reduce((acc, key) => {
        acc[key] = props.column[key].bind(null, props);
        return acc;
    }, {});

    return <div {...events}>{props.value}</div>;
}

export class DataRenderRegistry {
    constructor() {
        this.renderers = {};
    }
    static register(name, renderer) {
        if (!DataRenderRegistry.renderers) DataRenderRegistry.renderers = {};
        DataRenderRegistry.renderers[name] = renderer;
    }
    static get(name) {
        return this.renderers[name];
    }
}

function ImageRender(props) {
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

DataRenderRegistry.register('link', LinkRender);
DataRenderRegistry.register('default', DataRender);
DataRenderRegistry.register('badge', BadgeRender);
DataRenderRegistry.register('status', StatusRender);
DataRenderRegistry.register('id', IdRender);
DataRenderRegistry.register('email', EmailRender);
DataRenderRegistry.register('phone', PhoneRender);
DataRenderRegistry.register('url', UrlRender);
DataRenderRegistry.register('image', ImageRender);