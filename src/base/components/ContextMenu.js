import React, { useState, forwardRef } from 'react';
import { Menu } from '@mui/material';

import { useImperativeHandle } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { MenuItem, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';

const StyledMenuItem = styled(MenuItem)({
    paddingLeft: '4px',
    paddingRight: '4px',
    display: 'flex',
    justifyContent: 'space-between',
});

const StyledTypography = styled(Typography)({
    paddingLeft: '8px',
    paddingRight: '8px',
    textAlign: 'left',
});

const FlexBox = styled(Box)({
    display: 'flex',
});


const IconMenuItem = forwardRef(
    (
        { leftIcon, rightIcon, onClick, label, MenuItemProps, className, ...props },
        ref,
    ) => {
        return (
            <StyledMenuItem
                {...MenuItemProps}
                ref={ref}
                className={className}
                onClick={onClick}
                {...props}
            >
                <FlexBox>
                    {leftIcon}
                    <StyledTypography>{label}</StyledTypography>
                </FlexBox>
                {rightIcon}
            </StyledMenuItem>
        );
    },
);

IconMenuItem.displayName = 'IconMenuItem';

const NestedMenuItem = React.forwardRef(function NestedMenuItem(props, ref) {
    const {
        parentMenuOpen,
        label,
        rightIcon = <ChevronRight />,
        leftIcon = null,
        children,
        className,
        tabIndex: tabIndexProp,
        disabled,
        ContainerProps: ContainerPropsProp = {},
        ...MenuItemProps
    } = props;

    const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

    const menuItemRef = useRef(null);
    useImperativeHandle(ref, () => menuItemRef.current);

    const containerRef = useRef(null);
    useImperativeHandle(containerRefProp, () => containerRef.current);

    const menuContainerRef = useRef(null);

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleMouseEnter = (e) => {
        setIsSubMenuOpen(true);

        if (ContainerProps.onMouseEnter) {
            ContainerProps.onMouseEnter(e);
        }
    };
    const handleMouseLeave = (e) => {
        setIsSubMenuOpen(false);

        if (ContainerProps.onMouseLeave) {
            ContainerProps.onMouseLeave(e);
        }
    };

    // Check if any immediate children are active
    const isSubmenuFocused = () => {
        const active = containerRef.current.ownerDocument.activeElement;
        for (const child of menuContainerRef.current.children) {
            if (child === active) {
                return true;
            }
        }
        return false;
    };

    const handleFocus = (e) => {
        if (e.target === containerRef.current) {
            setIsSubMenuOpen(true);
        }

        if (ContainerProps.onFocus) {
            ContainerProps.onFocus(e);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            return;
        }

        if (isSubmenuFocused()) {
            e.stopPropagation();
        }

        const active = containerRef.current.ownerDocument.activeElement;

        if (e.key === 'ArrowLeft' && isSubmenuFocused()) {
            containerRef.current.focus();
        }

        if (
            e.key === 'ArrowRight' &&
            e.target === containerRef.current &&
            e.target === active
        ) {
            const firstChild = menuContainerRef.current.children[0];
            firstChild.focus();
        }
    };

    const open = isSubMenuOpen && parentMenuOpen;

    // Root element must have a `tabIndex` attribute for keyboard navigation
    let tabIndex;
    if (!props.disabled) {
        tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
    }

    return (
        <div
            {...ContainerProps}
            disabled={disabled}
            ref={containerRef}
            onFocus={handleFocus}
            tabIndex={tabIndex}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
        >
            <IconMenuItem
                MenuItemProps={MenuItemProps}
                className={className}
                ref={menuItemRef}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                label={label}
            />

            <Menu
                // Set pointer events to 'none' to prevent the invisible Popover div
                // from capturing events for clicks and hovers
                style={{ pointerEvents: 'none' }}
                anchorEl={menuItemRef.current}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={open}
                autoFocus={false}
                disableAutoFocus
                disableEnforceFocus
                onClose={() => {
                    setIsSubMenuOpen(false);
                }}
            >
                <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
                    {children}
                </div>
            </Menu>
        </div>
    );
});

NestedMenuItem.displayName = 'NestedMenuItem';

function nestedMenuItemsFromObject({
    menuItemsData: items,
    isOpen,
    handleClose,
}) {
    return items.map(item => {
        const { leftIcon, rightIcon, label, items, disabled, callback } = item;

        if (items && items.length > 0) {
            // Recurse deeper
            return (
                <NestedMenuItem
                    {...item}
                    key={label}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    label={label}
                    parentMenuOpen={isOpen}
                >
                    {/* Call this function to nest more items */}
                    {nestedMenuItemsFromObject({
                        menuItemsData: items,
                        isOpen,
                        handleClose,
                    })}
                </NestedMenuItem>
            );
        } else {
            // No children elements, return MenuItem
            return (
                <IconMenuItem
                    {...item}
                    key={label}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    label={label}
                    onClick={() => {
                        handleClose();
                        if (item.onClick) {
                            item.onClick();
                        }
                    }}
                />
            );
        }
    });
}


const ContextMenu = forwardRef(
    ({ children, menuItemsData }, ref) => {
        const [menuPosition, setMenuPosition] = useState(null);

        const [mouseDownPosition, setMouseDownPosition] = useState(null);

        const handleItemClick = () => setMenuPosition(null);

        const handleMouseDown = (e) => {
            if (menuPosition !== null) setMenuPosition(null);

            if (e.button !== 2) return;

            setMouseDownPosition({ top: e.clientY, left: e.clientX });
        };

        const handleMouseUp = (e) => {
            const top = e.clientY;
            const left = e.clientX;

            if (mouseDownPosition === null) return;
            if (e.button !== 2) return;

            setMenuPosition({ top: e.clientY, left: e.clientX });
        };

        const menuItems = nestedMenuItemsFromObject({
            menuItemsData: menuItemsData,
            isOpen: !!menuPosition,
            handleClose: handleItemClick,
        });



        return (
            <>
                {React.Children.map(children, (child) => {

                    return React.cloneElement(child, {
                        onMouseDown: handleMouseDown,
                        onMouseUp: handleMouseUp,
                        onContextMenu: (e) => {

                            e.preventDefault();
                            e.stopPropagation();

                            console.log(e, child);
                        }
                    });

                })}

                <Menu
                    onContextMenu={e => e.preventDefault()}
                    open={!!menuPosition}
                    onClose={() => setMenuPosition(null)}
                    anchorReference="anchorPosition"
                    anchorPosition={menuPosition}
                    PaperProps={{
                        style: {
                            minWidth: 100
                        }
                    }}
                >
                    {menuItems}
                </Menu>
            </>
        );
    },
);

ContextMenu.displayName = 'ContextMenu';
export { ContextMenu };