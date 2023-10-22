/**
 * Function isNull
 * 
 * @param value - Value to check
 * @returns True if the value is '' or null or undefined
 */
export const isNull = (value) => value === '' || value === null || value === undefined;

/**
 * Function notNull
 * 
 * @param value - Value to check
 * @returns True if the value is NOT '' and NOT null and NOT undefined
 */
export const notNull = (value) => value !== '' && value !== null && value !== undefined;

const getCommaLanguage = (t = 'it') => {
    switch (t) {
        case 'it':
            return {
                language: 'it-IT',
                trueComma: ',',
            };
        case 'en':
            return {
                language: 'en-EN',
                trueComma: '.',
            };
        default:
            return {
                language: 'it-IT',
                trueComma: ',',
            };
    }
};

/**
 * Function parseStringToNumber
 * 
 * @param value - The value to convert into a number
 * @param t - Language of conversion for decimal point
 * @returns Number or null
 */
export const parseStringToNumber = (value, t = 'en') => {
    try {
        const { trueComma } = getCommaLanguage(t);

        if (isNull(value)) {
            return null;
        }

        let val = value;
        if (val === null) {
            return null;
        }

        if (typeof val === 'string') {
            const indexComma = val.indexOf(trueComma);
            if (trueComma === ',') {
                if (indexComma === -1) {
                    val = parseFloat(val.replaceAll('.', ''));
                } else {
                    val = parseFloat(val.replaceAll('.', '').replace(',', '.'));
                }
            } else if (indexComma === -1) {
                val = parseFloat(val.replaceAll(',', ''));
            } else {
                val = parseFloat(val.replaceAll(',', ''));
            }
        } else {
            val = value;
        }

        return val;
    } catch (e) {
        return null;
    }
};

/**
 * Function parseNumberToString
 * 
 * @param t - Language of conversion for decimal point
 * @param value - The value to convert into a string
 * @param digit - Number of decimal needs
 * @returns String or null
 */
export const parseNumberToString = (t = 'en', value, digit = 0) => {
    try {
        const { language } = getCommaLanguage(t);
        return parseStringToNumber(value, t)?.toLocaleString(language, { minimumFractionDigits: digit, maximumFractionDigits: digit });
    } catch (e) {
        return null;
    }
};
