import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { FormHelperText, FormControlLabel, Radio } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Radiofield = (
  {
      innerRef,
      name,
      checkedIcon,
      icon,
      color,
      disabled,
      required,
      size,
      sx,
      label,
      labelPlacement,
      value,
      test,
      showErrorHelperText,
      ...props
  }
) => {
    const RENDER_TIMES = useRef(0);
    const internalRef = useRef(null);
    const ref = innerRef ? innerRef : internalRef;

    const theme = useTheme();
    const errorColor = theme?.palette?.error?.main || '#d32f2f';

    const { control, events } = useFormContext();

    const {
        field,
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
    });

    const [_checkedIcon, setCheckedIcon] = useState(checkedIcon);
    const [_icon, setIcon] = useState(icon);
    const [_color, setColor] = useState(color);
    const [_disabled, setDisabled] = useState(disabled);
    const [_required, setRequired] = useState(required);
    const [_size, setSize] = useState(size);
    const [_sx, setSx] = useState(sx);
    const [_label, setLabel] = useState(label);
    const [_labelPlacement, setLabelPlacement] = useState(labelPlacement);
    const [_value, setValue] = useState(value);

    const renderTestLabel = `${_label} - ${RENDER_TIMES.current}`;

    RENDER_TIMES.current++;
    useEffect(() => {
        return () => {
            RENDER_TIMES.current = 0;
        };
    }, []);

    const managedFormControlLabelProps = {
        value: _value,
        required: _required,
        disabled: _disabled,
        label: test ? renderTestLabel : _label,
        labelPlacement: _labelPlacement,
        sx: {
            '& .MuiButtonBase-root': {
                color: invalid ? errorColor : 'inherit'
            },
            '& .MuiFormControlLabel-label': {
                color: invalid ? errorColor : 'inherit',
                marginTop: '3px'
            },
            '& .MuiFormControlLabel-asterisk': {
                color: invalid ? errorColor : 'inherit'
            },
            ...(_sx || {}),
        },
    };

    const managedRadioProps = {
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
            getValue: () => _value,
            setValue: (value) => {
                setValue(value);
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
        console.log(`Radiofield ${name}/${value} RENDER`);
    }

    return (
      <>
          <FormControlLabel
            {...props}
            {...managedFormControlLabelProps}
            checked={field.value === value}
            onChange={async () => {
                const newValue = value;

                if (events?.[name]?.beforeChange) {
                    await events[name].beforeChange({ oldValue: field.value, newValue });
                }

                field.onChange(newValue);

                if (events?.[name]?.afterChange) {
                    await events[name].afterChange({ oldValue: field.value, newValue });
                }
            }}
            control={
                <Radio
                  inputRef={ref}
                  {...managedRadioProps}
                  name={name}
                />
            }
          />
          {invalid && showErrorHelperText && <FormHelperText error>{error?.message || 'Errore'}</FormHelperText>}
      </>
    );
}

Radiofield.propTypes = {
    name: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
    checkedIcon: PropTypes.node,
    icon: PropTypes.node,
    color: PropTypes.oneOf(['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning']),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    size: PropTypes.oneOf(['medium', 'small']),
    sx: PropTypes.object,
    label: PropTypes.string,
    labelPlacement: PropTypes.oneOf(['bottom', 'end', 'start', 'top']),
    value: PropTypes.string.isRequired,
    test: PropTypes.bool,
    showErrorHelperText: PropTypes.bool,
}

Radiofield.defaultProps = {
    name: null,
    hidden: false,
    checkedIcon: null,
    icon: null,
    color: 'default',
    disabled: false,
    required: false,
    size: 'medium',
    sx: {},
    label: 'Nuova label',
    labelPlacement: 'end',
    value: null,
    test: false,
    showErrorHelperText: false,
};

export const useRadiofield = ({ name, components }) => {
    const inputRefs = Array.from({ length: components.length || 0 }, () => React.createRef());

    const Radios = components.map((component, i) => {
        return (
          <Radiofield
            key={i}
            showErrorHelperText={i === 0}
            name={name}
            {...component}
            innerRef={inputRefs[i]}
          />
        );
    })

    return [Radios, inputRefs];
}

export default Radiofield;
