import * as migration_20250227_135932_pages from './20250227_135932_pages';

export const migrations = [
  {
    up: migration_20250227_135932_pages.up,
    down: migration_20250227_135932_pages.down,
    name: '20250227_135932_pages'
  },
];
