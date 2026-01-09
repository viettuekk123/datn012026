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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const cv_service_1 = require("./cv.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const user_entity_1 = require("../../entities/user.entity");
let CvController = class CvController {
    constructor(cvService) {
        this.cvService = cvService;
    }
    upload(req, file) {
        console.log('--- Upload Debug ---');
        console.log('User ID:', req.user?.userId);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('File received:', file ? file.originalname : 'UNDEFINED');
        if (!file) {
            throw new common_1.BadRequestException('File không tìm thấy trong yêu cầu (Multipart key must be "file")');
        }
        return this.cvService.upload(req.user.userId, file);
    }
    findMyCvs(req) {
        return this.cvService.findByUser(req.user.userId);
    }
    findOne(req, id) {
        return this.cvService.findById(id, req.user.userId);
    }
    setDefault(req, id) {
        return this.cvService.setDefault(req.user.userId, id);
    }
    delete(req, id) {
        return this.cvService.delete(req.user.userId, id);
    }
};
exports.CvController = CvController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.CANDIDATE),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload và parse CV' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.CANDIDATE),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách CV của tôi' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "findMyCvs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết CV' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/default'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.CANDIDATE),
    (0, swagger_1.ApiOperation)({ summary: 'Đặt CV làm mặc định' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(user_entity_1.UserRole.CANDIDATE),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa CV' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CvController.prototype, "delete", null);
exports.CvController = CvController = __decorate([
    (0, swagger_1.ApiTags)('CV'),
    (0, common_1.Controller)('cv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cv_service_1.CvService])
], CvController);
//# sourceMappingURL=cv.controller.js.map