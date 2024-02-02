"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thoriumPackager = exports._thoriumPackager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const unzipper_1 = __importDefault(require("unzipper"));
const file_mapper_1 = require("./file-mapper");
/**
 * La classe `_thoriumPackager` fournit des méthodes de mappage de fichiers, d'initialisation d'un paquet et de lecture d'un paquet en TypeScript.
*/
class _thoriumPackager {
    static fileMapper(sourceDir) { return (0, file_mapper_1.fileMapper)(sourceDir); }
    static initPackage() { return (0, archiver_1.default)('zip'); }
    static async readPackage(sourcePackage) {
        let entries = [];
        let zip = fs.createReadStream(sourcePackage).pipe(unzipper_1.default.Parse({ forceStream: true }));
        for await (const entry of zip) {
            entries.push({ path: String(`${entry.path}`), buffer: await entry.buffer() });
        }
        return {
            zip,
            get entries() { return entries; },
        };
    }
    static async writePackage(sourceToPack, pathToPack) {
        let zip = _thoriumPackager.initPackage();
        let output = fs.createWriteStream(path.join(pathToPack, 'package.zip'));
        zip.pipe(output);
        let files = _thoriumPackager.fileMapper(sourceToPack);
        for (const file of files) {
            zip.append(fs.readFileSync(file.path), { name: file.fullName });
        }
        await zip.finalize();
        return files;
    }
}
exports._thoriumPackager = _thoriumPackager;
;
/**
 * L'export `thoriumPackager` est une instance du constructeur `ThoriumPackagerConstructor`.
 * Elle est créée en utilisant `_thoriumPackager` et est typée pour garantir la conformité
 * avec l'interface `ThoriumPackagerConstructor`.
 *
 * Cette instance expose les fonctionnalités définies dans `ThoriumPackagerConstructor`,
 * ce qui permet l'utilisation facile des méthodes de mappage de fichiers, d'initialisation
 * de paquet, de lecture et d'écriture de paquet dans l'écosystème Thorium.
*/
exports.thoriumPackager = _thoriumPackager;
//# sourceMappingURL=index.js.map