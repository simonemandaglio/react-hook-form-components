import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

/**
 * The `Listener` is a helpfull component that receive listeners object as a prop
 * and listen the form value changes based on it.
 * 
 * You can listen multiple fields and every time each field's value has changed you 
 * may access to its current value and also to all form values.
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
const Listener = ({ listeners }) => {
    const [oldData, setOldData] = useState(null);

    const { control } = useFormContext();
    const subscription = useWatch({ control });

    useEffect(() => {
        setOldData(subscription);
    }, []);

    const handleSatisfy = useCallback(async () => {
        if (listeners) {
            const entries = Object.entries(listeners);
            // eslint-disable-next-line no-restricted-syntax
            for (const [key, l] of entries) {
                if (oldData?.[key] !== subscription?.[key]) {
                    // eslint-disable-next-line no-await-in-loop
                    await l(subscription?.[key], subscription);
                    setOldData(subscription);
                }
            }
        }
    }, [listeners, subscription]);

    useEffect(() => {
        (async () => handleSatisfy())();
    }, Object.keys(listeners).map((key) => subscription?.[key]));

    return null;
}

export default Listener;
