import * as fs from 'fs';
import * as path from 'path';
import { default as archiver , Archiver } from 'archiver';
import { default as unzipper , ParseStream , Entry } from 'unzipper';

import { fileMapper , FilesMapperResult } from './file-mapper';

export interface IThoriumPackager{

}

/**
 * Le type `ThoriumPackagerAPI` définit la structure d'un objet représentant
 * l'API d'un packager Thorium lors de la lecture d'un fichier zip.
 * du fichier zip, chacun contenant des informations sur le chemin et le contenu.
*/
export type ThoriumPackagerAPI = {

  /** Représente le flux zip lors de la lecture du fichier. */
  zip:unzipper.ParseStream;

  /**
   * Un tableau d'objets `Entry` représentant les entrées extraites du fichier zip.
   * Chaque objet `Entry` contient des informations sur le chemin et le contenu du fichier.
  */
  entries:Entry[];
}

export interface IThoriumPackagerConstructor {

}

/**
 * L'interface `ThoriumPackagerConstructor` définit la structure d'un constructeur utilisé
 * pour créer des instances du packager Thorium. Ce constructeur expose des fonctions telles
 * que le mappage de fichiers, l'initialisation d'un paquet, la lecture et l'écriture d'un paquet.
*/
export type ThoriumPackagerConstructor = {

  /**
   * La fonction "fileMapper" mappe les fichiers dans un répertoire source et renvoie le résultat.
   * @param {string} sourceDir - Le paramètre `sourceDir` est une chaîne de caractères représentant le chemin du répertoire
   * où se trouvent les fichiers.
   * @returns La fonction `fileMapper` est appelée avec le paramètre `sourceDir`, et le résultat de cet appel de fonction est renvoyé.
  */
  fileMapper:FilesMapperResult;

  /**
   * La fonction initialise un paquet en créant une nouvelle instance de la classe Archiver avec le format 'zip'.
   * @returns Une instance de la classe Archiver.
  */
  initPackage:Archiver;

  /**
   * La fonction `readPackage` lit un fichier zip, extrait ses entrées et renvoie un objet
   * contenant le flux zip et un tableau de chemins et tampons d'entrée.
   * @param {string} sourcePackage - Le paramètre `sourcePackage` est une chaîne de caractères représentant le chemin
   * du fichier du paquet que vous souhaitez lire.
   * @returns un objet de type `ThoriumPackagerAPI`.
  */
  readPackage:( sourcePackage:string )=>Promise<ThoriumPackagerAPI>;

  /**
   * La fonction `writePackage` crée un fichier zip contenant les fichiers d'un répertoire source spécifié
   * et renvoie un tableau des fichiers inclus dans le zip.
   * @param {string} sourceToPack - Le répertoire source ou le fichier que vous souhaitez empaqueter dans un fichier zip.
   * @param {string} pathToPack - Le paramètre `pathToPack` est le chemin de destination où le paquet
   * sera créé. C'est le répertoire où le fichier `package.zip` sera enregistré.
   * @returns le tableau de fichiers qui ont été ajoutés au paquet zip.
  */
  writePackage:( sourceToPack:string , pathToPack:string ) => Promise<FilesMapperResult>;

}

/** 
 * La classe `_thoriumPackager` fournit des méthodes de mappage de fichiers, d'initialisation d'un paquet et de lecture d'un paquet en TypeScript. 
*/
export class _thoriumPackager implements IThoriumPackager{

  static fileMapper( sourceDir:string ):ThoriumPackagerConstructor["fileMapper"]{ return fileMapper( sourceDir ); }

  static initPackage():ThoriumPackagerConstructor["initPackage"]{ return archiver('zip'); }

  static async readPackage( sourcePackage:string ):Promise<ThoriumPackagerConstructor["readPackage"]>{ 

    let entries = [];
    let zip = fs.createReadStream( sourcePackage ).pipe(unzipper.Parse({forceStream: true}));

    for await( const entry of zip ){
      entries.push({ path : String(`${entry.path}`) , buffer : await entry.buffer() });
    }

    return {
      zip,
      get entries(){ return entries },
    } as any;

  }

  static async writePackage( sourceToPack:string , pathToPack:string ):Promise<ThoriumPackagerConstructor["writePackage"]>{

    let zip = _thoriumPackager.initPackage();
    let output = fs.createWriteStream( path.join( pathToPack , 'package.zip' ) );
    zip.pipe( output );

    let files = _thoriumPackager.fileMapper( sourceToPack );

    for(const file of files){
      zip.append( fs.readFileSync(file.path) , { name : file.fullName } );
    }

    await zip.finalize();

    return files as any;

  }

};

/**
 * L'export `thoriumPackager` est une instance du constructeur `ThoriumPackagerConstructor`.
 * Elle est créée en utilisant `_thoriumPackager` et est typée pour garantir la conformité
 * avec l'interface `ThoriumPackagerConstructor`.
 * 
 * Cette instance expose les fonctionnalités définies dans `ThoriumPackagerConstructor`,
 * ce qui permet l'utilisation facile des méthodes de mappage de fichiers, d'initialisation
 * de paquet, de lecture et d'écriture de paquet dans l'écosystème Thorium.
*/
export const thoriumPackager:ThoriumPackagerConstructor = _thoriumPackager as (typeof _thoriumPackager & ThoriumPackagerConstructor);

export {
  FilesMapperResult,
  Archiver,
  ParseStream
};