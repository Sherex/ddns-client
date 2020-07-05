export {
  exists
}

function exists(path: string): boolean | 'directory' | 'file' | 'symlink' {
  try {
    const stat = Deno.statSync(path);
    if (stat.isDirectory) return 'directory'
    if (stat.isFile) return 'file'
    if (stat.isSymlink) return 'symlink'
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}