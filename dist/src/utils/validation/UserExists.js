"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExists = void 0;
exports.UserExists = (userExists) => {
    if (userExists) {
        return {
            errors: [
                {
                    field: 'username',
                    message: 'Username already exists.',
                },
            ],
        };
    }
    return null;
};
//# sourceMappingURL=UserExists.js.map