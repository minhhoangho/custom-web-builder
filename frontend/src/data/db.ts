import Dexie, { type EntityTable, Transaction } from 'dexie';
import { templateSeeds } from './seed';
import { DTemplate } from "./interface";


// Extend the Transaction type to include the templates property
interface AppTransaction extends Transaction {
  templates: EntityTable<DTemplate>;
}

const db = new Dexie('drawDB') as Dexie & {
  templates: EntityTable<DTemplate>;
};


db.version(6).stores({
  diagrams: '++id, lastModified, loadedFromGistId',
  templates: '++id, custom',
});

db.on('populate', (transaction: AppTransaction) => {
  transaction.templates.bulkAdd(templateSeeds).catch((e) => console.info(e));
});


export {
  db
}