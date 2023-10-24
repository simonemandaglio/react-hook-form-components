import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { FormHelperText, FormControlLabel, Checkbox } from '@mui/material';

const Checkfield = (
  {
      innerRef,
      name,
      indeterminateIcon,
      checkedIcon,
      icon,
      color,
      disabled,
      required,
      size,
      sx,
      label,
      labelPlacement,
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
    } = useController({
        name,
        control,
    });

    const [_indeterminateIcon, setIndeterminateIcon] = useState(indeterminateIcon);
    const [_checkedIcon, setCheckedIcon] = useState(checkedIcon);
    const [_icon, setIcon] = useState(icon);
    const [_color, setColor] = useState(color);
    const [_disabled, setDisabled] = useState(disabled);
    const [_required, setRequired] = useState(required);
    const [_size, setSize] = useState(size);
    const [_sx, setSx] = useState(sx);
    const [_label, setLabel] = useState(label);
    const [_labelPlacement, setLabelPlacement] = useState(labelPlacement);

    const renderTestLabel = `${_label} - ${RENDER_TIMES.current}`;

    RENDER_TIMES.current++;
    useEffect(() => {
        return () => {
            RENDER_TIMES.current = 0;
        };
    }, []);

    const managedFormControlLabelProps = {
        required: _required,
        disabled: _disabled,
        label: test ? renderTestLabel : _label,
        labelPlacement: _labelPlacement,
        sx: {
            '& .MuiButtonBase-root': {
                color: invalid ? '#d32f2f' : 'inherit'
            },
            '& .MuiFormControlLabel-label': {
                color: invalid ? '#d32f2f' : 'inherit',
                marginTop: '3px'
            },
            '& .MuiFormControlLabel-asterisk': {
                color: invalid ? '#d32f2f' : 'inherit'
            },
            ...(_sx || {}),
        },
    };

    const managedCheckboxProps = {
        ...(_indeterminateIcon && { indeterminateIcon: _indeterminateIcon }),
        ...(_checkedIcon && { checkedIcon: _checkedIcon }),
        ...(_icon && { icon: _icon }),
        color: _color,
        size: _size,
    };

    useImperativeHandle(ref, () => {
        // noinspection JSUnusedGlobalSymbols
        return {
            input: ref?.current,
            setFocus: () => {
                document.getElementsByName(name)[0].focus();
            },
            getIndeterminateIcon: () => _indeterminateIcon,
            setIndeterminateIcon: (value) => {
                setIndeterminateIcon(value);
            },
            getCheckedIcon: () => _checkedIcon,
            setCheckedIcon: (value) => {
                setCheckedIcon(value);
            },
            getIcon: () => _icon,
            setIcon: (value) => {
                setIcon(value);
            },
            getColor: () => _color,
            setColor: (value) => {
                setColor(value);
            },
            getLabel: () => _label,
            setLabel: (value) => {
                setLabel(value);
            },
            getLabelPlacement: () => _labelPlacement,
            setLabelPlacement: (value) => {
                setLabelPlacement(value);
            },
            isRequired: () => _required,
            setRequired: (value) => {
                setRequired(value);
            },
            isDisabled: () => _disabled,
            setDisabled: (value) => {
                setDisabled(value);
            },
            getSize: () => _size,
            setSize: (value) => {
                setSize(value);
            },
            getSx: () => _sx,
            setSx: (value) => {
                setSx(value);
            },
        };
    });

    if (test) {
        console.log(`Checkfield ${name} RENDER`);
    }

    return (
      <>
          <FormControlLabel
            {...props}
            {...managedFormControlLabelProps}
            checked={Boolean(field.value || 0)}
            // indeterminate={indeterminate}
            onChange={async (e) => {
                const newValue = e.target.checked;

                if (events?.[name]?.beforeChange) {
                    await events[name].beforeChange({ oldValue: field.value, newValue });
                }

                field.onChange(newValue);

                if (events?.[name]?.afterChange) {
                    await events[name].afterChange({ oldValue: field.value, newValue });
                }
            }}
            control={
                <Checkbox
                  inputRef={ref}
                  {...managedCheckboxProps}
                  name={name}
                />
            }
          />
          {invalid && <FormHelperText error>{error?.message || 'Errore'}</FormHelperText>}
      </>
    );
}

Checkfield.propTypes = {
    name: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
    indeterminateIcon: PropTypes.node,
    checkedIcon: PropTypes.node,
    icon: PropTypes.node,
    color: PropTypes.oneOf(['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning']),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    size: PropTypes.oneOf(['medium', 'small']),
    sx: PropTypes.object,
    label: PropTypes.string,
    labelPlacement: PropTypes.oneOf(['bottom', 'end', 'start', 'top']),
    test: PropTypes.bool,
}

Checkfield.defaultProps = {
    name: null,
    hidden: false,
    indeterminateIcon: null,
    checkedIcon: null,
    icon: null,
    color: 'primary',
    disabled: false,
    required: false,
    size: 'medium',
    sx: {},
    label: 'Nuova label',
    labelPlacement: 'end',
    test: false,
};

export const useCheckfield = (props) => {
    const inputRef = useRef(null);

    const Component = <Checkfield {...props} innerRef={inputRef} />

    return [Component, inputRef];
}

export default Checkfield;