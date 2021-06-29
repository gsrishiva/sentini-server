const Validator = require('validatorjs');
const mongoose = require('mongoose');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
const termsRegex = /\b(\w*true\w*)\b/;
function hasDuplicates(arr) {
    return arr.some(x => arr.indexOf(x) !== arr.lastIndexOf(x));
}
// Tighten password policy
Validator.register(
    'strict',
    value => passwordRegex.test(value),
    'password must contain at least one uppercase letter, one lowercase letter and one number'
);

Validator.register(
    'termscheck',
    value => termsRegex.test(value),
    't_c must be a boolean value and checked'
);
Validator.register(
    'mongooseIdRule',
    function(value, requirement, attribute) {
        return value.every(i => mongoose.Types.ObjectId.isValid(i) === true);
    },
    'Invalid Categories Type'
);
Validator.register(
    'checkForDuplicatesInArray',
    function(value, requirement, attribute) {
        if (hasDuplicates(value)) {
            return false;
        } else {
            return true;
        }
    },
    'Duplicate values present in the input Array'
);

const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    if (validation.fails()) {
        callback(validation.errors, false);
    } else {
        callback(null, true);
    }
};

module.exports = validator;
