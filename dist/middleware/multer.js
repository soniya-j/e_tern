"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
class MulterConfig {
    constructor() {
        this.storage = multer_1.default.memoryStorage(); // Store files in memory
        this.multerConfig = (0, multer_1.default)({
            storage: this.storage,
            limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                    cb(null, true);
                }
                else {
                    cb(new Error('Only JPEG, PNG files are allowed.'));
                }
            },
        }).single('image');
    }
}
exports.default = new MulterConfig().multerConfig;
