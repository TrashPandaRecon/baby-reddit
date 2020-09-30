"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const mailchecker_1 = require("mailchecker");
const Password_1 = require("./Password");
exports.validateRegister = (input) => {
    if (!mailchecker_1.isValid(input.email)) {
        return {
            errors: [
                {
                    field: 'email',
                    message: 'Email is invalid.',
                },
            ],
        };
    }
    if (input.username.length < 3) {
        return {
            errors: [
                {
                    field: 'username',
                    message: 'Username must be more than 2 characters long.',
                },
            ],
        };
    }
    if (!/^[\w\d-]*$/.test(input.username)) {
        return {
            errors: [
                {
                    field: 'username',
                    message: 'Username can only contain letters, numbers and "-"',
                },
            ],
        };
    }
    var isPasswordValid = Password_1.Password(input.password, input.reenterPassword);
    if (isPasswordValid != null) {
        return isPasswordValid;
    }
    return null;
};
//# sourceMappingURL=Register.js.map