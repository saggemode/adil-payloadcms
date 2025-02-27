import * as migration_20250227_151653_pages from './20250227_151653_pages';

export const migrations = [
  {
    up: migration_20250227_151653_pages.up,
    down: migration_20250227_151653_pages.down,
    name: '20250227_151653_pages'
  },
];
