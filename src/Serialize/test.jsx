import {State} from '/src/State';

import {hydrate, migrate} from './compat';
import snapshotsV1 from './snapshots.v1';
import snapshotsV2 from './snapshots.v2';
import {latestVersion} from './versions';

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => '00000000-0000-0000-0000-000000000000',
  },
});

// Serialized snapshots of the examples to make sure they aren't changed without updating
const snapshots = [
  ['v1', snapshotsV1.snapshots],
  ['v2', snapshotsV2.snapshots],
];
const latest = snapshots[snapshots.length - 1][1];

describe('serialization', () => {
  describe.each(snapshots)('snapshots', (version, versionSnapshots) => {
    describe.each(Object.entries(versionSnapshots))(version, (key, {hydrated, serialized}) => {
      describe(key, () => {
        const latestSnapshot = Object.values(latest).find((x) => x.hydrated.name === hydrated.name);

        const makeModel = (data) => {
          const state = new State();
          state.loadRaw(data);
          return state.activeModel;
        };

        test('hydrates to latest version', () => {
          const modelFromSerialized = makeModel(hydrate(serialized, version));
          const modelFromLatest = makeModel(latestSnapshot.hydrated);
          expect(modelFromSerialized).toEqual(modelFromLatest);
        });

        test('round trip', () => {
          const model = makeModel(migrate(hydrated, version));
          const type = model.constructor;

          const data = model.serialize();
          const model2 = new type(hydrate(data, latestVersion));
          const data2 = model2.serialize();
          const model3 = new type(hydrate(data2, latestVersion));
          const data3 = model3.serialize();

          expect(data).toEqual(data2);
          expect(data).toEqual(data3);
          expect(model).toEqual(model2);
          expect(model).toEqual(model3);
        });

        test('serializes to latest version', () => {
          expect(makeModel(migrate(hydrated, version)).serialize()).toEqual(latestSnapshot.serialized);
        });
      });
    });
  });
});
