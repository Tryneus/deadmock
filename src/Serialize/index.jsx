import {ModelStorage, ModelStorageContext} from './ModelStorage';
import {serializeable} from './serialization';
import {snapshots} from './snapshots.v2';
import {latestVersion} from './versions';

const examples = Object.fromEntries(
  Object.entries(snapshots).map(([k, v]) => [k, v.hydrated]),
);

const templates = [
  {label: 'Item', data: snapshots.HollowPointWard.hydrated},
  {label: 'Ability', data: snapshots.Tornado.hydrated},
  {label: 'Hero', data: snapshots.Dynamo.hydrated},
];

export {
  ModelStorage,
  ModelStorageContext,
  examples,
  latestVersion,
  serializeable,
  snapshots,
  templates,
};
