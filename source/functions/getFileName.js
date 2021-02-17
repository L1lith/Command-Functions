import { basename, extname } from 'path'

function getFileName(path) {
  return basename(path, extname(path))
}

export default getFileName
