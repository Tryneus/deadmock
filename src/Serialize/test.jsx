import {State} from '../State';
import {examples} from '../example';

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => '00000000-0000-0000-0000-000000000000',
  },
});

// Serialized snapshots of the examples to make sure they aren't changed without updating
/* eslint-disable @stylistic/js/comma-spacing */
const snapshots = [
  ['v1', {
    'Heroic Aura': ['weapon','Heroic Aura',3,[],[[[],'Bullet Lifesteal',20,'%',1],[[],'Bonus Health',150,'',1],[[],'Move Speed',1,' m/s',1]],[['Provides **Fire Rate** to nearby player minions.',[[[[['stat/fire_rate','orange'],'Minions Fire Rate',40,'%',1,0,1]],[[[],'Radius',20,'m']]]]],['Provides bonus **Movement Speed** and **Fire Rate** to you and nearby allies.',[[[[['stat/move_speed'],'Movement Speed',2,'m/s',1,0,1],[['stat/fire_rate','orange'],'Fire Rate',25,'%',1,0,1]],[[[],'Active Radius',30,'m'],[[],'Duration',6,'s']]]],1,32]]],
    'Return Fire': ['vitality','Return Fire',2,[],[[[],'Bonus Health',125,'',1],[[],'Spirit Power',9,'',1]],[['Automatically **fire a bullet** towards any attacker who damages you with their abilities or weapon.',[[[[['stat/weapon_damage','orange',1],'Bullet Damage Returned',60,'%',0,0,0,0,'orange'],[['stat/spirit_damage','purple',1],'Spirit Damage Returned',30,'%',0,0,0,0,'purple'],[['stat/bullet_shield','orange'],'Bullet Resist',25,'%',1,0,1]],[[[],'Duration',7,'s']]]],1,25]]],
    'Slowing Hex': ['spirit','Slowing Hex',2,['Enduring Spirit'],[[[],'Spirit Lifesteal',10,'%',1],[[],'Spirit Power',5,'',1],[[],'Bonus Health',75,'',1]],[['Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target\'s stamina usage._',[[[[['stat/spirit_damage','purple',1],'Damage',80,'',0,0,0,0,'purple'],[['stat/move_slow'],'Movement Slow',20,'%',0,0,1],[['stat/move_slow'],'Dash Distance',-30,'%',1,0,1]],[[[],'Cast Range',29,'m'],[[],'Duration',3,'s']]]],1,26]]],
    'Tornado':     ['ability','Tornado',[[['stat/cooldown'],'cooldown',32,'s'],[['stat/duration'],'Stat',0.75,'s']],'Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',[[[[['stat/spirit_damage','purple'],'Damage',70,'',0,0.7],[['stat/duration'],'Lift Duration',1.5,'s'],[[],'Bullet Evasion Chance',30,'%']],[[[],'Bullet Evasion Duration',3.5,'s'],[['stat/aoe'],'Radius',3.5,'m']]]],['**+0.5s**\nLift Duration', '**-14s**\nCooldown', '**+20%**\nBullet Evasion Chance']],
  }],
];
/* eslint-enable @stylistic/js/comma-spacing */

describe('serialization', () => {
  describe.each(examples)('examples', (ex) => {
    describe(ex.name, () => {
      const makeModel = () => {
        const state = new State();
        state.loadRaw(ex);
        return state.activeModel;
      };

      test('round trip', () => {
        const model = makeModel();
        const data = model.serialize();
        const model2 = model.constructor.deserialize(data);
        const data2 = model2.serialize();
        const model3 = model.constructor.deserialize(data2);
        const data3 = model3.serialize();

        expect(data).toEqual(data2);
        expect(data).toEqual(data3);
        expect(model).toEqual(model2);
        expect(model).toEqual(model3);
      });

      describe.each(snapshots)('load snapshots', (version, versionSnapshots) => {
        test(version, () => {
          const snapshot = versionSnapshots[ex.name];
          const model = makeModel();
          const model2 = model.constructor.deserialize(snapshot);
          expect(model).toEqual(model2);
        });
      });

      test(`serialize to latest snapshot`, () => {
        const expected = snapshots[snapshots.length - 1][1][ex.name];
        expect(expected).toBeDefined();
        expect(makeModel().serialize()).toEqual(expected);
      });
    });
  });
});
