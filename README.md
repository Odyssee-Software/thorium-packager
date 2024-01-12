# thorium-packager

ThoriumPackager est une bibliothèque TypeScript qui fournit des fonctionnalités pour mapper des fichiers, initialiser des paquets, et lire/écrire des paquets zip. Elle utilise des bibliothèques populaires telles que `archiver` et `unzipper` pour simplifier les opérations d'emballage de fichiers dans l'écosystème Thorium.

## Fonctionnalités

- **Mapping de Fichiers:** Mappez facilement des fichiers dans un répertoire source avec des informations détaillées telles que le chemin, le nom, l'extension, et le nom complet.
- **Initialisation de Paquet:** Initialisez un paquet en créant une nouvelle instance de la classe Archiver avec le format 'zip'.
- **Lecture de Paquet:** Lisez un fichier zip, extrayez ses entrées, et récupérez un objet API structuré contenant le flux zip et les informations d'entrée.
- **Écriture de Paquet:** Créez un fichier zip contenant des fichiers à partir d'un répertoire source spécifié et recevez un tableau des fichiers inclus dans le zip.

## Installation

Pour installer ThoriumPackager, utilisez la commande npm suivante :

```bash
npm install thorium-packager
```

## Utilisation

Voici un exemple rapide de comment utiliser ThoriumPackager dans un projet TypeScript :

```typescript

  import { thoriumPackager, ThoriumPackagerAPI, FilesMapperResult } from 'thorium-packager';

  // Exemple de mapping de fichiers
  const resultatsMapping: FilesMapperResult = thoriumPackager.fileMapper('/chemin/vers/source');

  // Exemple d'initialisation de paquet
  const instanceArchiver = thoriumPackager.initPackage();

  // Exemple de lecture de paquet
  const apiPaquet: ThoriumPackagerAPI = await thoriumPackager.readPackage('/chemin/vers/paquet.zip');

  // Exemple d'écriture de paquet
  const fichiersInclus: FilesMapperResult = await thoriumPackager.writePackage('/chemin/vers/source', '/chemin/vers/destination');

```

## Documentation de l'API

`fileMapper(sourceDir: string): FilesMapperResult`
Mappe les fichiers dans un répertoire source et retourne des informations détaillées sur chaque fichier.

`initPackage(): Archiver`
Initialise un paquet en créant une nouvelle instance de la classe Archiver avec le format 'zip'.

`readPackage(sourcePackage: string): Promise<ThoriumPackagerAPI>`
Lit un fichier zip, extrait ses entrées, et retourne un objet API structuré contenant le flux zip et les informations d'entrée.

`writePackage(sourceToPack: string, pathToPack: string): Promise<FilesMapperResult>`
Crée un fichier zip contenant des fichiers à partir d'un répertoire source spécifié et retourne un tableau des fichiers inclus dans le zip.