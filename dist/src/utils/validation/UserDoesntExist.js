"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDoesntExists = void 0;
exports.UserDoesntExists = (userExists) => {
    if (!userExists) {
        return {
            errors: [
                {
                    field: 'usernameOrEmail',
                    message: 'Username / Email is not registered.',
                },
            ],
        };
    }
    return null;
};
//# sourceMappingURL=UserDoesntExist.js.map