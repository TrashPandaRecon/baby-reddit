"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const mailchecker_1 = require("mailchecker");
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
const Register_1 = require("../utils/validation/Register");
const RegistrationInput_1 = require("../utils/inputModels/RegistrationInput");
const UserResponse_1 = require("../utils/responseModels/UserResponse");
const UserExists_1 = require("../utils/validation/UserExists");
const UserDoesntExist_1 = require("../utils/validation/UserDoesntExist");
const EmailExists_1 = require("../utils/validation/EmailExists");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const Password_1 = require("../utils/validation/Password");
const typeorm_1 = require("typeorm");
let UserResolver = class UserResolver {
    changePassword(token, password, reenterPassword, { redis, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPassword = Password_1.Password(password, reenterPassword);
            if (isPassword != null) {
                return isPassword;
            }
            console.log('STARTING');
            const key = constants_1.FORGET_PASSWORD_PREFIX + token;
            const userId = yield redis.get(key);
            if (userId == null) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: 'Token has expired.',
                        },
                    ],
                };
            }
            const userIntId = parseInt(userId);
            const user = yield User_1.User.findOne(userIntId);
            if (user == null) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: 'User does not exist.',
                        },
                    ],
                };
            }
            yield User_1.User.update({ id: userIntId }, { password: yield argon2_1.default.hash(password) });
            redis.del(key);
            req.session.userId = user.id;
            return {
                user,
            };
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email } });
            if (!user) {
                return true;
            }
            const token = uuid_1.v4();
            yield redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 2);
            sendEmail_1.sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`, 'BabyReddit: Change Password');
            return true;
        });
    }
    me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return User_1.User.findOne(req.session.userId);
    }
    register(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const passed = Register_1.validateRegister(input);
            if (passed) {
                return passed;
            }
            const usernameExists = UserExists_1.UserExists(yield User_1.User.findOne({ where: { username: input.username } }));
            if (usernameExists) {
                return usernameExists;
            }
            const emailExists = EmailExists_1.EmailExists(yield User_1.User.findOne({ where: { email: input.email.toLowerCase() } }));
            if (emailExists) {
                return emailExists;
            }
            const hashedPassword = yield argon2_1.default.hash(input.password);
            let user;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User_1.User)
                    .values({
                    username: input.username,
                    password: hashedPassword,
                    email: input.email,
                })
                    .returning('*')
                    .execute();
                user = result.raw[0];
            }
            catch (err) {
                console.error(err.message);
            }
            req.session.userId = user.id;
            return { user };
        });
    }
    login(usernameOrEmail, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({
                where: mailchecker_1.isValid(usernameOrEmail)
                    ? { email: usernameOrEmail.toLowerCase() }
                    : { username: usernameOrEmail },
            });
            const exists = UserDoesntExist_1.UserDoesntExists(user);
            if (exists) {
                return exists;
            }
            const verify = yield argon2_1.default.verify(user.password, password);
            if (!verify) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Password is incorrect.',
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            return {
                user,
            };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => { var _a; return (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }); });
    }
};
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('token')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Arg('reenterPassword')),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegistrationInput_1.RegistrationInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg('usernameOrEmail')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map