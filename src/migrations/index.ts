import * as migration_20250227_151653_pages from './20250227_151653_pages';
import * as migration_20250307_005029_pages2 from './20250307_005029_pages2';

export const migrations = [
  {
    up: migration_20250227_151653_pages.up,
    down: migration_20250227_151653_pages.down,
    name: '20250227_151653_pages',
  },
  {
    up: migration_20250307_005029_pages2.up,
    down: migration_20250307_005029_pages2.down,
    name: '20250307_005029_pages2'
  },
];
