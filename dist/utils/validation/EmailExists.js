"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailExists = void 0;
exports.EmailExists = (emailExists) => {
    if (emailExists) {
        return {
            errors: [
                {
                    field: 'email',
                    message: 'Email has already been registered.',
                },
            ],
        };
    }
    return null;
};
//# sourceMappingURL=EmailExists.js.map