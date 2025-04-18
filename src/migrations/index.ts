import * as migration_20250408_181230_page1 from './20250408_181230_page1';
import * as migration_20250418_184250_page2 from './20250418_184250_page2';

export const migrations = [
  {
    up: migration_20250408_181230_page1.up,
    down: migration_20250408_181230_page1.down,
    name: '20250408_181230_page1',
  },
  {
    up: migration_20250418_184250_page2.up,
    down: migration_20250418_184250_page2.down,
    name: '20250418_184250_page2'
  },
];
