import * as migration_20250227_151653_pages from './20250227_151653_pages';
import * as migration_20250307_005029_pages2 from './20250307_005029_pages2';
import * as migration_20250316_232455_page3 from './20250316_232455_page3';
import * as migration_20250319_111535_page4 from './20250319_111535_page4';
import * as migration_20250319_111807_page5 from './20250319_111807_page5';
import * as migration_20250324_204101_page6 from './20250324_204101_page6';
import * as migration_20250325_181001_page7 from './20250325_181001_page7';
import * as migration_20250331_215140_page8 from './20250331_215140_page8';

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
    name: '20250324_204101_page6',
  },
  {
    up: migration_20250325_181001_page7.up,
    down: migration_20250325_181001_page7.down,
    name: '20250325_181001_page7',
  },
  {
    up: migration_20250331_215140_page8.up,
    down: migration_20250331_215140_page8.down,
    name: '20250331_215140_page8'
  },
];
