import React from 'react'
import { BadgeRender } from './DataComponents/BadgeRender';
import { IdRender } from './DataComponents/IdRender';
import { EmailRender } from './DataComponents/EmailRender';
import { PhoneRender } from './DataComponents/PhoneRender';
import { UrlRender } from './DataComponents/UrlRender';
import { StatusRender } from './DataComponents/StatusRender';
import { LinkRender } from './DataComponents/LinkRender';
import { ImageRender } from './DataComponents/ImageRender';
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

DataRenderRegistry.register('link', LinkRender);
DataRenderRegistry.register('default', DataRender);
DataRenderRegistry.register('badge', BadgeRender);
DataRenderRegistry.register('status', StatusRender);
DataRenderRegistry.register('id', IdRender);
DataRenderRegistry.register('email', EmailRender);
DataRenderRegistry.register('phone', PhoneRender);
DataRenderRegistry.register('url', UrlRender);
DataRenderRegistry.register('image', ImageRender);