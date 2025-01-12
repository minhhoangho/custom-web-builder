import Dexie from 'dexie';
import { templateSeeds } from './seed';

export const db = new Dexie('drawDB');

db.version(6).stores({
  diagrams: '++id, lastModified, loadedFromGistId',
  templates: '++id, custom',
});

db.on('populate', (transaction) => {
  transaction.templates.bulkAdd(templateSeeds).catch((e) => console.info(e));
});
