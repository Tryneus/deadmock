import {serializeable} from './serialization';
import {snapshots} from './snapshots.v2';
import {latestVersion, versions} from './versions';
import {deserialize} from './compat';

// The first entry will be the default object loaded when there is nothing in particular to show
const examples = [
  snapshots.HeroicAura.hydrated,
  snapshots.ReturnFire.hydrated,
  snapshots.SlowingHex.hydrated,
  snapshots.Tornado.hydrated,
];

export {deserialize, examples, serializeable, snapshots};
