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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
<<<<<<< HEAD
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let Post = class Post extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.updatedAt = Date;
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
=======
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
let Post = class Post {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    core_1.PrimaryKey(),
>>>>>>> 955eba4194044fe0b572cf9f626d7e4092b2b3a5
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
<<<<<<< HEAD
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
=======
    core_1.Property({ type: 'date' }),
    __metadata("design:type", Object)
], Post.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    core_1.Property({ type: 'date', onUpdate: () => new Date() }),
>>>>>>> 955eba4194044fe0b572cf9f626d7e4092b2b3a5
    __metadata("design:type", Object)
], Post.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(),
<<<<<<< HEAD
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Post.prototype, "post", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "sub", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "media", void 0);
Post = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
=======
    core_1.Property({ type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
Post = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity()
>>>>>>> 955eba4194044fe0b572cf9f626d7e4092b2b3a5
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map