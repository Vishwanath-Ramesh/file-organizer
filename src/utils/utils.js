import { existsSync, mkdirSync, rename, renameSync, statSync } from 'fs';
import { basename, resolve } from 'path';

function createDirectory(path) {
  if (!existsSync(path)) mkdirSync(path);
}

function moveFile(file, dir2) {
  const f = basename(file);
  const dest = resolve(dir2, f);

  rename(file, dest, (err) => {
    if (err) alert(err);
  });
}

function sortByDatetime(filePath1, filePath2) {
  const s1 = statSync(filePath1);
  const s2 = statSync(filePath2);

  return s1.ctime < s2.ctime;
}

function renameFile(oldPath, newPath) {
  console.log(newPath);
  renameSync(oldPath, newPath);
}

export default { createDirectory, moveFile, sortByDatetime, renameFile };
