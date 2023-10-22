import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextField as MuiTextfield, FormHelperText } from '@mui/material';

const Textfield = (
    {
        name,
        label,
        helperText,
        startAdornment,
        endAdornment,
        required,
        disabled,
        sx,
        size,
        shrink,
        type,
        isUpperCase,
        fullWidth,
        innerRef,
        test,
        ...props
    }
) => {
    const RENDER_TIMES = useRef(0);
    const internalRef = useRef(null);
    const ref = innerRef ? innerRef : internalRef;

    const { control, events } = useFormContext();

    const {
        field,
        fieldState: { invalid, error },
        // formState: { touchedFields, dirtyFields },
    } = useController({
        name,
        control,
    });

    const [_type, setType] = useState(type);
    const [_size, setSize] = useState(size);
    const [_shrink, setShrink] = useState(shrink);
    const [_label, setLabel] = useState(label);
    const [_helperText, setHelperText] = useState(helperText);
    const [_startAdornment, setStartAdornment] = useState(startAdornment);
    const [_endAdornment, setEndAdornment] = useState(endAdornment);
    const [_required, setRequired] = useState(required);
    const [_disabled, setDisabled] = useState(disabled);
    const [_sx, setSx] = useState(sx);

    const renderTestLabel = `${_label} - ${RENDER_TIMES.current}`;

    RENDER_TIMES.current++;
    useEffect(() => {
        return () => {
            RENDER_TIMES.current = 0;
        };
    }, []);

    const managedProps = {
        type: _type,
        size: _size,
        label: test ? renderTestLabel : _label,
        required: _required,
        disabled: _disabled,
        sx: {
            '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
                paddingRight: '7px',
            },
            ...(_disabled && {
                '& .MuiInputBase-root:hover, & .MuiInputBase-input:hover, & .MuiFormLabel-root:hover, & .MuiFormControl-root:hover':
                {
                    cursor: 'not-allowed',
                }
            }),
            ...(_sx || {}),
        },
    };

    useImperativeHandle(ref, () => {
        // noinspection JSUnusedGlobalSymbols
        return {
            input: ref?.current,
            setFocus: () => {
                ref?.current?.input?.focus();
            },
            getType: () => _type,
            setType: (value) => {
                setType(value);
            },
            getSize: () => _size,
            setSize: (value) => {
                setSize(value);
            },
            getShrink: () => _shrink,
            setShrink: (value) => {
                setShrink(value);
            },
            getLabel: () => _label,
            setLabel: (value) => {
                setLabel(value);
            },
            getHelperText: () => _helperText,
            setHelperText: (value) => {
                setHelperText(value);
            },
            setStartAdornment: (value) => {
                setStartAdornment(value);
            },
            setEndAdornment: (value) => {
                setEndAdornment(value);
            },
            isRequired: () => _required,
            setRequired: (value) => {
                setRequired(value);
            },
            isDisabled: () => _disabled,
            setDisabled: (value) => {
                setDisabled(value);
            },
            getSx: () => _sx,
            setSx: (value) => {
                setSx(value);
            },
        };
    });

    const InputLabelProps = {
        shrink: false
    };
    if (_shrink) {
        InputLabelProps.shrink = true;
    }

    if (test) {
        console.log('Textfield ' + name + ' RENDER');
    }

    return (
        <>
            <MuiTextfield
                inputRef={r => ref.current = r}
                {...field}
                value={field.value || ''}
                {...props}
                {...managedProps}
                InputLabelProps={InputLabelProps}
                InputProps={{
                    ...(isUpperCase && { inputProps: { style: { textTransform: 'uppercase' } } }),
                    startAdornment: _startAdornment,
                    endAdornment: _endAdornment,
                }}
                autoComplete="off"
                fullWidth={fullWidth}
                error={invalid}
                onChange={async (e) => {
                    const newValue = e.target.value;

                    if (events?.[name]?.beforeChange) {
                        await events[name].beforeChange({ oldValue: field.value, newValue });
                    }

                    field.onChange(newValue);

                    if (events?.[name]?.afterChange) {
                        await events[name].afterChange({ oldValue: field.value, newValue });
                    }
                }}
            />
            {invalid && <FormHelperText error>{error?.message || 'Errore'}</FormHelperText>}
            {!invalid && _helperText && <FormHelperText>{_helperText}</FormHelperText>}
        </>
    );
}

Textfield.propTypes = {
    name: PropTypes.string.isRequired,
    shrink: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password', 'email']),
    helperText: PropTypes.string,
    startAdornment: PropTypes.node,
    endAdornment: PropTypes.node,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    sx: PropTypes.object,
    size: PropTypes.oneOf(['medium', 'small']),
    test: PropTypes.bool,
    fullWidth: PropTypes.bool,
    hidden: PropTypes.bool,
    variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
};

Textfield.defaultProps = {
    name: null,
    shrink: false,
    label: 'Nuova label',
    type: 'text',
    helperText: null,
    startAdornment: null,
    endAdornment: null,
    required: false,
    disabled: false,
    sx: {},
    size: 'small',
    test: false,
    fullWidth: true,
    hidden: false,
    variant: 'outlined',
};

export const useTextfield = (props) => {
    const inputRef = useRef();

    const Component = <Textfield {...props} innerRef={inputRef} />

    return [Component, inputRef];
}

export default Textfield;
