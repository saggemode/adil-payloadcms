import * as migration_20250408_181230_page1 from './20250408_181230_page1';
import * as migration_20250418_184250_page2 from './20250418_184250_page2';
import * as migration_20250420_002244_page3 from './20250420_002244_page3';
import * as migration_20250429_133936_page4 from './20250429_133936_page4';

export const migrations = [
  {
    up: migration_20250408_181230_page1.up,
    down: migration_20250408_181230_page1.down,
    name: '20250408_181230_page1',
  },
  {
    up: migration_20250418_184250_page2.up,
    down: migration_20250418_184250_page2.down,
    name: '20250418_184250_page2',
  },
  {
    up: migration_20250420_002244_page3.up,
    down: migration_20250420_002244_page3.down,
    name: '20250420_002244_page3',
  },
  {
    up: migration_20250429_133936_page4.up,
    down: migration_20250429_133936_page4.down,
    name: '20250429_133936_page4'
  },
];
