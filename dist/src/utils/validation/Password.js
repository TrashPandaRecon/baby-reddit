"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
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
//# sourceMappingURL=Password.js.map