import {serializeable} from './serialization';
import {snapshots} from './snapshots.v2';
import {latestVersion, versions} from './versions';

// The first entry will be the default object loaded when there is nothing in particular to show
const examples = [
  snapshots.HeroicAura.hydrated,
  snapshots.ReturnFire.hydrated,
  snapshots.SlowingHex.hydrated,
  snapshots.Tornado.hydrated,
];

export {examples, latestVersion, serializeable, snapshots, versions};
