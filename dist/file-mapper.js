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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMapper = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * La fonction fileMapper mappe de manière récursive les fichiers dans un répertoire
 * et renvoie un tableau d'objets de fichiers avec leurs propriétés respectives.
 * @param {string} dir - Le paramètre `dir` est une chaîne de caractères représentant
 * le chemin du répertoire dont vous souhaitez mapper les fichiers.
 * @returns La fonction `fileMapper` renvoie un tableau d'objets. Chaque objet représente
 * un fichier ou un répertoire dans le répertoire `dir` donné. Si l'élément est un répertoire,
 * la fonction s'appelle récursivement pour mapper les fichiers et répertoires à l'intérieur
 * de ce répertoire. Si l'élément est un fichier, un objet est créé avec des propriétés représentant
 * les statistiques du fichier (comme la taille, l'heure de modification, etc.), le chemin, le nom,
*/
function fileMapper(dir) {
    let files = fs.readdirSync(dir);
    let results = [];
    for (const file of files) {
        let stats = fs.statSync(path.join(dir, file));
        if (stats.isDirectory()) {
            results.push(fileMapper(path.join(dir, file)));
        }
        else {
            results.push({
                ...stats,
                get path() { return path.join(dir, file); },
                get name() { return path.basename(file, path.extname(file)); },
                get extension() { return path.extname(file); },
                get fullName() { return `${this.name}${this.extension}`; }
            });
        }
    }
    return results.flat();
}
exports.fileMapper = fileMapper;
//# sourceMappingURL=file-mapper.js.map