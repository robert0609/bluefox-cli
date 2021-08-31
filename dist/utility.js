"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDir = exports.traverseDir = exports.removeDir = exports.readDir = exports.isDirExist = exports.writeFile = exports.readFile = exports.copyFile = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var rm = __importStar(require("rimraf"));
/**
 * 复制文件
 * @param {String} sourceFile
 * @param {String} destinationFile
 */
function copyFile(sourceFile, destinationFile) {
    fs_1.default.copyFileSync(sourceFile, destinationFile);
}
exports.copyFile = copyFile;
function readFile(sourceFile) {
    return fs_1.default.readFileSync(sourceFile, {
        encoding: 'utf8'
    }).toString();
}
exports.readFile = readFile;
function writeFile(destinationFile, data) {
    fs_1.default.writeFileSync(destinationFile, data, {
        encoding: 'utf8'
    });
}
exports.writeFile = writeFile;
function isDirExist(dir) {
    return fs_1.default.existsSync(dir);
}
exports.isDirExist = isDirExist;
function readDir(dir) {
    var dirents = fs_1.default.readdirSync(dir, {
        encoding: 'utf8',
        withFileTypes: true
    });
    return dirents;
}
exports.readDir = readDir;
function removeDir(dir) {
    if (isDirExist(dir)) {
        rm.sync(dir);
    }
}
exports.removeDir = removeDir;
function traverseDir(baseDir, relativeDir, handleFileContent) {
    var fullDir = path_1.default.normalize(path_1.default.join(baseDir, relativeDir));
    var dirents = readDir(fullDir);
    dirents.forEach(function (d) {
        if (d.isDirectory()) {
            traverseDir(baseDir, path_1.default.normalize(path_1.default.join(relativeDir, d.name)), handleFileContent);
        }
        else if (d.isFile()) {
            if (handleFileContent) {
                handleFileContent(baseDir, relativeDir, d.name);
            }
        }
    });
}
exports.traverseDir = traverseDir;
function makeDir(dir) {
    fs_1.default.mkdirSync(dir, {
        recursive: true
    });
}
exports.makeDir = makeDir;

//# sourceMappingURL=utility.js.map
