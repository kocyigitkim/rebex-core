import { Alert, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRebexData } from "../../contexts/RebexDataProvider";
import { FormElementRegistry } from "../FormComponents/FormElementRegistry";

function RebexFormFieldPlace(fields, values, setFields, setValues, options) {
    const { translate } = useRebexData();
    const fieldName = options.name;
    const fieldTitle = options.title;
    const fieldDescription = options.description;
    const hideValidation = options.hideValidation;
    const hideTitle = options.hideTitle;
    const hideDescription = options.hideDescription;
    const FieldComponent = options.render ? options.render : FormElementRegistry.get(options.type);
    const ref = useRef();
    const [firstValueSet, setFirstValueSet] = useState(false);

    if (!fields[fieldName]) {
        const fieldRef = {
            ...options,
            ref: ref
        };
        setFields({
            ...fields,
            [fieldName]: fieldRef
        })
        return;
    }

    var [validated, validationResult] = checkFormValidation({ [fieldName]: options }, { [fieldName]: values[fieldName] });
    const showValidationSuccess = ((options.validate && validated) || (validated && options.required) || (!options.required && !options.validate));

    return (<>
        {fieldTitle && !hideTitle && <Typography variant="body1">{fieldTitle}{options.required ? '  *' : ''}</Typography>}
        <FieldComponent key={fieldName} fullWidth={true} ref={ref} value={values[fieldName]} onChange={(e) => {
            setValues({ ...values, [fieldName]: e });
            if (!firstValueSet) setFirstValueSet(true);
        }} {...options} />
        {fieldDescription && !hideDescription && <Typography sx={{ mb: 2 }} variant="body2">{fieldDescription}</Typography>}
        {firstValueSet && !hideValidation ? (
            <>
                {showValidationSuccess ? (
                    <Alert severity="success">{translate('form.validated')}</Alert>
                ) : (
                    <Alert severity="error">{translate('form.validation.error')}</Alert>
                )}
            </>
        ) : null}
    </>);
}
function RebexFormPlaceButton(form, options) {
    const onClick = options.onClick;
    const title = options.title;
    const disableOnLoading = options.disableOnLoading;
    const validated = options.validated;
    const isFormValidated = form.validated;

    return (<Box sx={{ display: 'inline-block', m: 1 }}>
        <Button {...options.props} disabled={(options.loading && disableOnLoading) || (validated && !isFormValidated)} onClick={onClick && onClick.bind(null, form)}>
            {(options.iconAlign === 'left' || !options.iconAlign) && options.icon}
            {title}
            {options.iconAlign === 'right' && options.icon}
        </Button>
    </Box>);
}
async function RebexFormSubmit(fields, values, setLoading, setError, setResult, submit) {
    setLoading(true);
    try {
        var r = submit(values);
        var hasError = false;
        if (r instanceof Promise) r = await r.catch((err) => {
            console.error(err);
            setError(err);
            hasError = true;
        });
        if (!hasError) setResult(r);
    } catch (error) {
        setError(error);
    }
    setTimeout(() => {
        setLoading(false);
    }, 500);
}
function RebexFormTitle(title) {
    return (<Typography sx={{ mb: 2, mt: 1 }} variant="h6">{title}</Typography>);
}
function checkFormValidation(fields, values) {
    var isValidated = true;
    var results = {};
    Object.keys(fields).forEach(fieldName => {
        var fieldValue = values[fieldName];
        if (fields[fieldName].required && !fieldValue) {
            isValidated = false;
            return;
        }
        if (!fieldValue) return;
        var field = fields[fieldName];
        if (field && field.validate) {
            if (typeof field.validate === 'function') {
                results[fieldName] = field.validate(values[fieldName]);
            }
            else {
                try {
                    var result = field.validate.validateSync(values[fieldName]);
                } catch (err) {
                    isValidated = false;
                }
                results[fieldName] = {
                    success: isValidated,
                    result: result
                };
            }
        }
    });

    return [isValidated, results];
}
export function useRebexForm(options) {
    const [fields, setFields] = useState({});
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const submit = options && options.submit;
    const [validated, validationResults] = checkFormValidation(fields, values);

    const form = {
        place: RebexFormFieldPlace.bind(null, fields, values, (newFields) => setFields({ ...fields, ...newFields }), setValues),
        title: RebexFormTitle,
        loading: loading,
        error: error,
        result: result,
        isSuccess: !loading && result,
        validated: validated,
        validations: validationResults,
        submit: RebexFormSubmit.bind(null, fields, values, setLoading, setError, setResult, submit)
    }
    form.placeButton = RebexFormPlaceButton.bind(null, { ...form, setLoading, setError, setResult });
    return form;
}