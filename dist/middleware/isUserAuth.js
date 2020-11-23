"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAuth = void 0;
exports.isUserAuth = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("Not Authenticated.");
    }
    return next();
};
//# sourceMappingURL=isUserAuth.js.map