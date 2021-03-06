import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, FormControl, FormHelperText, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRebexData } from '../../contexts/RebexDataProvider';


const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const FileListItem = ({ name, onDelete }) => (
    <ListItem>
        <Chip label={name} icon={<UploadFileIcon />} variant="outlined" sx={{ maxWidth: 200 }} onDelete={onDelete} />
    </ListItem>
);

const FileUpload = ({
    value,
    onChange,
    sx,
    description,
    buttonText,
    typographyProps,
    buttonProps,
    disabled,
    maxSize,
    ...options
}) => {
    const { translate } = useRebexData();
    const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
        ...options,
        disabled,
        maxSize,
        onDropAccepted: onChange,
        noClick: true,
        noKeyboard: true,
    });

    const isFileTooLarge = maxSize !== undefined && fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

    const remove = (index) => {
        const files = [...value];
        files.splice(index, 1);
        onChange(files);
    };

    const files = value?.map((file, i) => <FileListItem key={file.name} name={file.name} onDelete={() => remove(i)} />);

    return (
        <Box
            {...getRootProps()}
            sx={{
                border: 1,
                borderRadius: 1,
                borderColor: 'rgba(0, 0, 0, 0.23)',
                paddingY: 3,
                paddingX: 1,
                '&:hover': {
                    borderColor: disabled ? undefined : 'text.primary',
                },
                '&:focus-within': {
                    borderColor: 'primary.main',
                    borderWidth: 1,
                },
                ...sx,
            }}>
            <FormControl
                error={isFileTooLarge}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 40 }} color={disabled ? 'disabled' : 'primary'} />
                <Typography variant="caption" textAlign="center" sx={{ paddingY: 1 }} {...typographyProps}>
                    {description || translate("fileupload.description")}
                </Typography>
                <Button variant="contained" onClick={open} disabled={disabled} sx={{ marginBottom: 1 }} {...buttonProps}>
                    {buttonText || translate("fileupload.upload")}
                </Button>
                <FormHelperText> {fileRejections[0]?.errors[0]?.message} </FormHelperText>
            </FormControl>
            <Box
                component="ul"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}>
                {files}
            </Box>
        </Box>
    );
};

FileUpload;

export function FileUploadField(props) {

    return (<FileUpload {...props} value={props.value} onChange={(v) => {
        if (props.onChange) {
            props.onChange(v);
            console.log(v);
        }
    }} />);
}