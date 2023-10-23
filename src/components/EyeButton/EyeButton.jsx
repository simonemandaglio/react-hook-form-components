import React, { useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, IconButton } from '@mui/material';

/**
 * The `EyeButton` component is a snippet for making visibile or not some text 
 * into a Radiofield
 * 
 * Example:
 * ```jsx
 * const listeners = useMemo(() => ({
 *  [nameOfField]: async (value, formValues) => {
 *    console.log(value, formValues);
 *  }
 * }), []);
 * 
 * <Listeners listeners={listenters} />
 * ```
 * 
 */
const EyeButton = ({ innerRef, initialValue, disabled = false, onClick }) => {
    const [visible, setVisible] = useState(initialValue);
    const [_disabled, setDisabled] = useState(disabled);

    const label = !visible ? 'visibility_off' : 'visibility';

    useImperativeHandle(innerRef, () => {
        return {
            isDisabled: () => _disabled,
            setDisabled: (value) => {
                setDisabled(value);
            },
        }
    });

    return (
        <IconButton
            ref={innerRef}
            disabled={_disabled}
            size="small"
            sx={{ padding: '4px', borderRadius: '50px' }}
            onClick={() => {
                setVisible((prevState) => {
                    onClick(!prevState);
                    return !prevState;
                });
            }}
        >
            <Icon className="text-20" color="action">
                {label}
            </Icon>
        </IconButton>
    );
};

EyeButton.propTypes = {
    innerRef: PropTypes.element,
    initialValue: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

EyeButton.defaultProps = {
    innerRef: null,
    initialValue: true,
    disabled: false,
    onClick: () => {}
};

export default EyeButton;
