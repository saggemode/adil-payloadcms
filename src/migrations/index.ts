import * as migration_20250227_151653_pages from './20250227_151653_pages';
import * as migration_20250307_005029_pages2 from './20250307_005029_pages2';
import * as migration_20250316_232455_page3 from './20250316_232455_page3';
import * as migration_20250319_111535_page4 from './20250319_111535_page4';
import * as migration_20250319_111807_page5 from './20250319_111807_page5';
import * as migration_20250324_204101_page6 from './20250324_204101_page6';

export const migrations = [
  {
    up: migration_20250227_151653_pages.up,
    down: migration_20250227_151653_pages.down,
    name: '20250227_151653_pages',
  },
  {
    up: migration_20250307_005029_pages2.up,
    down: migration_20250307_005029_pages2.down,
    name: '20250307_005029_pages2',
  },
  {
    up: migration_20250316_232455_page3.up,
    down: migration_20250316_232455_page3.down,
    name: '20250316_232455_page3',
  },
  {
    up: migration_20250319_111535_page4.up,
    down: migration_20250319_111535_page4.down,
    name: '20250319_111535_page4',
  },
  {
    up: migration_20250319_111807_page5.up,
    down: migration_20250319_111807_page5.down,
    name: '20250319_111807_page5',
  },
  {
    up: migration_20250324_204101_page6.up,
    down: migration_20250324_204101_page6.down,
    name: '20250324_204101_page6'
  },
];
