import React from 'react'
import { Chip, Link } from '@mui/material'
import { truncateString } from '../utils';
export function DataRender(props) {
    const eventNames = Object.keys(props.column).filter(key => key.startsWith('on'));
    const events = eventNames.reduce((acc, key) => {
        acc[key] = props.column[key].bind(null, props);
        return acc;
    }, {});

    return <div {...events}>{props.value}</div>;
}

export function BadgeRender(props) {
    return <Chip {...props} label={props.value}></Chip>;
}
export function IdRender(props) {
    return <Chip {...props} onClick={() => {
        if (props.column.onClick) props.column.onClick(props);
    }} label={truncateString("#" + (props.showId ? props.value : ''), 10)}></Chip>;
}

export function EmailRender(props) {
    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" href={`mailto:${props.value}`} onClick={() => {
        if (props.column.onClick) props.column.onClick(props);
    }}>{props.value}</Link>;
}

export function PhoneRender(props) {
    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" href={`tel:${props.value}`} onClick={() => {
        if (props.column.onClick) props.column.onClick(props);
    }}>{props.value}</Link>;
}

export function UrlRender(props) {
    var link = props.value || "";
    if (link.indexOf("http://") === -1 && link.indexOf("https://") === -1) link = "http://" + link;

    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" href={link} onClick={() => {
        if (props.column.onClick) props.column.onClick(props);
    }}>{props.value}</Link>;
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

export function StatusRender(props) {
    const column = props.column;
    const color = (column.colorMap && column.colorMap[props.value]) || 'inherit';
    const text = (column.colorMap && column.map[props.value]) || props.value;
    return <Chip {...props} color={color} label={text}></Chip>;
}
export function LinkRender(props) {
    return <Link style={{
        cursor: 'pointer',
        ...props.style
    }} {...props} target="_blank" onClick={() => {
        if (props.column.onClick) props.column.onClick(props);
    }}>{props.value}</Link>;
}
DataRenderRegistry.register('link', LinkRender);
DataRenderRegistry.register('default', DataRender);
DataRenderRegistry.register('badge', BadgeRender);
DataRenderRegistry.register('status', StatusRender);
DataRenderRegistry.register('id', IdRender);
DataRenderRegistry.register('email', EmailRender);
DataRenderRegistry.register('phone', PhoneRender);
DataRenderRegistry.register('url', UrlRender);
