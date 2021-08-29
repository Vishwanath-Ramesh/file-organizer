import { existsSync, mkdirSync, rename } from 'fs';
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

export default { createDirectory, moveFile };
