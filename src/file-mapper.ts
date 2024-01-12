import * as fs from 'fs';
import * as path from 'path';

/**
 * Le type `FilesMapperResult` représente le résultat du processus de mappage de fichiers dans
 * un répertoire. Chaque élément du tableau est un objet qui combine les statistiques du fichier
 * (`fs.Stats`) avec des propriétés supplémentaires telles que le chemin, le nom, l'extension et
 * le nom complet du fichier ou du répertoire mappé.
 * 
 * Chaque objet dans le tableau a les propriétés suivantes :
 * - `path`: Le chemin du fichier ou du répertoire.
 * - `name`: Le nom du fichier ou du répertoire.
 * - `extension`: L'extension du fichier (par exemple, ".txt").
 * - `fullName`: Le nom complet du fichier, y compris le nom et l'extension.
*/
export type FilesMapperResult = (fs.Stats & { 

  /** Dans la définition du type `FilesMapperResult`, `path:string;` définit une propriété nommée
  `path` avec le type `string`. Cette propriété représente le chemin du fichier ou du répertoire
  en cours de mappage. */
  path:string;

  /** Dans la définition du type `FilesMapperResult`, `name:string;` définit une propriété nommée
  `name` avec le type `string`. Cette propriété représente le nom du fichier ou du répertoire
  en cours de mappage. */
  name:string;

  /** Dans la définition du type `FilesMapperResult`, `extension:string;` définit une propriété
  nommée `extension` avec le type `string`. Cette propriété représente l'extension du fichier en
  cours de mappage. Par exemple, si le fichier est nommé "exemple.txt", la propriété `extension`
  sera ".txt". */
  extension:string;

  /** La propriété `fullName:string;` dans la définition du type `FilesMapperResult` représente le
  nom complet du fichier en cours de mappage. Il s'agit d'une combinaison de la propriété `name`
  (qui représente le nom du fichier sans l'extension) et de la propriété `extension` (qui représente
  l'extension du fichier). */
  fullName:string;

})[];

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
export function fileMapper( dir:string ):FilesMapperResult{

  let files = fs.readdirSync( dir );
  let results = [];

  for(const file of files){
  
    let stats = fs.statSync( path.join( dir , file ) );
    if(stats.isDirectory()){
      results.push( fileMapper( path.join( dir , file ) ) )
    }
    else{
      results.push( {
        ...stats,
        get path(){return path.join( dir , file )},
        get name(){return path.basename( file , path.extname( file ) )},
        get extension(){return path.extname( file )},
        get fullName(){ return `${this.name}${this.extension}` }
      } );
    }

  }

  return results.flat();

}