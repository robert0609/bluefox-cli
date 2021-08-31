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
exports.inquire = void 0;
var commander_1 = __importDefault(require("commander"));
var path_1 = __importDefault(require("path"));
var inquirer_1 = __importDefault(require("inquirer"));
var package_json_1 = __importDefault(require("../package.json"));
var semver_1 = __importDefault(require("semver"));
var loadTemplate_1 = require("./loadTemplate");
var utility_1 = require("./utility");
function inquire() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var program = new commander_1.default.Command();
                        program.version(package_json_1.default.version);
                        program
                            .command('init')
                            .description('init project')
                            .action(function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var sourceDir, projectGroup, manifest, categories, categoryOptions, groupNames, category, selectedTemplate, sourceTemplateDir, validation_1, uniqueArr, questions, answers, categoryName, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, loadTemplate_1.loadRemoteTemplate('100talxes1v1/fe-project')];
                                        case 1:
                                            sourceDir = _a.sent();
                                            projectGroup = JSON.parse(utility_1.readFile(path_1.default.resolve(sourceDir, 'manifest.json')));
                                            manifest = {};
                                            categories = [];
                                            categoryOptions = [];
                                            groupNames = Object.keys(projectGroup);
                                            groupNames.forEach(function (groupName) {
                                                categoryOptions.push(new inquirer_1.default.Separator(groupName));
                                                var groupManifest = projectGroup[groupName];
                                                var projectNames = Object.keys(groupManifest);
                                                projectNames.forEach(function (c, i) {
                                                    manifest[c] = groupManifest[c];
                                                    categoryOptions.push({
                                                        name: c,
                                                        value: i + categories.length
                                                    });
                                                });
                                                categories.push.apply(categories, projectNames);
                                            });
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 5, , 6]);
                                            return [4 /*yield*/, inquirer_1.default.prompt({
                                                    type: 'list',
                                                    name: 'category',
                                                    message: 'Please select project category:',
                                                    choices: categoryOptions,
                                                    validate: function (selection) {
                                                        if (selection.length < 1) {
                                                            return 'You must choose project category!';
                                                        }
                                                        return true;
                                                    }
                                                })];
                                        case 3:
                                            category = (_a.sent()).category;
                                            selectedTemplate = manifest[categories[category]];
                                            sourceTemplateDir = path_1.default.resolve(sourceDir, selectedTemplate.templateFolder);
                                            validation_1 = selectedTemplate.validation;
                                            uniqueArr = Array.from(new Set(Object.values(selectedTemplate.needInjectFiles).reduce(function (a, b) {
                                                return a.concat(b);
                                            }, [])));
                                            questions = uniqueArr.map(function (key) {
                                                var q = {
                                                    type: 'input',
                                                    name: key,
                                                    message: "Please input package " + key + ":",
                                                    validate: function (inputContent) {
                                                        if (inputContent === undefined || inputContent === '') {
                                                            return "You must input package " + key + "!";
                                                        }
                                                        if (key === 'version') {
                                                            var r = semver_1.default.valid(inputContent);
                                                            if (r === null) {
                                                                return 'You must input valid version!';
                                                            }
                                                        }
                                                        // 如果有配置了validation，则要追加自定义校验处理
                                                        if (validation_1 && validation_1[key]) {
                                                            var validate = validation_1[key];
                                                            var regex = new RegExp(validate.rule);
                                                            if (!regex.test(inputContent)) {
                                                                return validate.message;
                                                            }
                                                        }
                                                        return true;
                                                    }
                                                };
                                                if (key === 'version') {
                                                    q['default'] = '0.1.1';
                                                }
                                                return q;
                                            });
                                            return [4 /*yield*/, inquirer_1.default.prompt(questions)];
                                        case 4:
                                            answers = _a.sent();
                                            categoryName = categories[category];
                                            answers['category'] = categoryName;
                                            // 判断如果是选择的Boston微前端的项目模板，则生成name配置项
                                            if (categoryName.startsWith('boston')) {
                                                if (answers['libraryName']) {
                                                    answers['name'] = "boston-library-" + answers['libraryName'];
                                                }
                                                else if (answers['appName']) {
                                                    answers['name'] = "boston-app-" + answers['appName'];
                                                }
                                            }
                                            resolve({ configInfo: answers, selectedTemplate: selectedTemplate, sourceTemplateDir: sourceTemplateDir });
                                            return [3 /*break*/, 6];
                                        case 5:
                                            e_1 = _a.sent();
                                            reject(e_1);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        program.parseAsync(process.argv);
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.inquire = inquire;

//# sourceMappingURL=inquire.js.map
