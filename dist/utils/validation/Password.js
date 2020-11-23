"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaltPassword = exports.Password = void 0;
const constants_1 = require("../../constants");
exports.Password = (password, reenterPassword) => {
    if (reenterPassword != password) {
        return {
            errors: [
                {
                    field: 'reenterPassword',
                    message: 'Passwords do not match',
                },
            ],
        };
    }
    if (password.length < 4) {
        return {
            errors: [
                {
                    field: 'password',
                    message: 'Username must be more than 4 characters long.',
                },
            ],
        };
    }
    return null;
};
exports.SaltPassword = (password) => {
    return password + constants_1.SALT;
};
//# sourceMappingURL=Password.js.map