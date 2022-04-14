import React from 'react'
import { CircularProgress, Typography } from "@mui/material";

export function LoadingOverlay(props) {
    const open = props.loading || props.open || props.visible || props.show;
    return (<div style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        transition: 'opacity 0.3s ease-in-out',
        zIndex: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        pointerEvents: open ? 'auto' : 'none',
        ...props.style,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        opacity: open ? 1 : 0,
    }}>
        {props.custom || (<>
            <CircularProgress sx={{ color: 'white' }} {...props.props} size={props.size || 40} />
            {props.title && <Typography sx={{ color: 'white', mt: 2 }} variant="body1">{props.title}</Typography>}
        </>)}
    </div>)
}