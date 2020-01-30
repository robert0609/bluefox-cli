"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ejs_1 = __importDefault(require("ejs"));
var path_1 = __importDefault(require("path"));
var inquire_1 = require("./inquire");
var utility_1 = require("./utility");
function fillConfig(content, varibles) {
    var template = ejs_1.default.compile(content);
    var result = template(varibles);
    return result;
}
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a, configInfo, selectedTemplate, sourceTemplateDir, destinationDir, needInjectFiles, k;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, inquire_1.inquire()];
                case 1:
                    _a = _b.sent(), configInfo = _a.configInfo, selectedTemplate = _a.selectedTemplate, sourceTemplateDir = _a.sourceTemplateDir;
                    destinationDir = path_1.default.resolve(process.cwd(), configInfo['name']);
                    needInjectFiles = {};
                    for (k in selectedTemplate.needInjectFiles) {
                        needInjectFiles[path_1.default.normalize(path_1.default.join(sourceTemplateDir, k))] = selectedTemplate.needInjectFiles[k];
                    }
                    utility_1.traverseDir(sourceTemplateDir, '.', function (baseDir, relativeDir, name) {
                        var sourceFile = path_1.default.normalize(path_1.default.join(baseDir, relativeDir, name));
                        var destDir = path_1.default.normalize(path_1.default.join(destinationDir, relativeDir));
                        var destFile = path_1.default.normalize(path_1.default.join(destDir, name));
                        if (!utility_1.isDirExist(destDir)) {
                            utility_1.makeDir(destDir);
                        }
                        // console.log('traverse', baseDir, relativeDir, name);
                        // 判断是否需要注入变量
                        var varibles = needInjectFiles[sourceFile];
                        if (varibles && varibles.length > 0) {
                            var vs_1 = {};
                            varibles.forEach(function (k) {
                                vs_1[k] = configInfo[k];
                            });
                            var newContent = fillConfig(utility_1.readFile(sourceFile), vs_1);
                            utility_1.writeFile(destFile, newContent);
                        }
                        else {
                            utility_1.copyFile(sourceFile, destFile);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}()).catch(function (error) {
    console.error(error);
});

//# sourceMappingURL=index.js.map
