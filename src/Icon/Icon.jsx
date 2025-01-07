import classNames from 'classnames';
import {useContext} from 'preact/hooks';

import {ConfigContext} from '/src/Common';
import './Icon.css';

const iconColors = [
  'white',
  'grey',
  'orange',
  'green',
  'purple',
  'aqua',
  'red',
  'yellow',
  'cyan',
];

// Icon colors that users can't really put to use
const hiddenColors = [
  'bright-green', // Used for sidebar button '+' icon
  'dark-grey', // Used for hero ability icons
  'item-spirit', // Used for the inner color of spirit item icons
  'item-vitality', // Used for the inner color of vitality item icons
  'item-weapon', // Used for the inner color of weapon item icons
];

// Map icon name to file
const filenames = {
  'item/basic_magazine':                 'item/basic_magazine.svg',
  'item/close_quarters':                 'item/close_quarters.svg',
  'item/headshot_booster':               'item/headshot_booster.svg',
  'item/high_velocity_mag':              'item/high_velocity_mag.svg',
  'item/hollow_point_ward':              'item/hollow_point_ward.svg',
  'item/monster_rounds':                 'item/monster_rounds.svg',
  'item/rapid_rounds':                   'item/rapid_rounds.svg',
  'item/restorative_shot':               'item/restorative_shot.svg',
  'item/active_reload':                  'item/active_reload.svg',
  'item/berserker':                      'item/berserker.svg',
  'item/fleetfoot':                      'item/fleetfoot.svg',
  'item/kinetic_dash':                   'item/kinetic_dash.svg',
  'item/long_range':                     'item/long_range.svg',
  'item/melee_charge':                   'item/melee_charge.svg',
  'item/mystic_shot':                    'item/mystic_shot.svg',
  'item/slowing_bullets':                'item/slowing_bullets.svg',
  'item/soul_shredder_bullets':          'item/soul_shredder_bullets.svg',
  'item/swift_striker':                  'item/swift_striker.svg',
  'item/alchemical_fire':                'item/alchemical_fire.svg',
  'item/burst_fire':                     'item/burst_fire.svg',
  'item/escalating_resilience':          'item/escalating_resilience.svg',
  'item/headhunter':                     'item/headhunter.svg',
  'item/heroic_aura':                    'item/heroic_aura.svg',
  'item/hunters_aura':                   'item/hunters_aura.svg',
  'item/intensifying_magazine':          'item/intensifying_magazine.svg',
  'item/point_blank':                    'item/point_blank.svg',
  'item/pristine_emblem':                'item/pristine_emblem.svg',
  'item/sharpshooter':                   'item/sharpshooter.svg',
  'item/spellslinger_headshots':         'item/spellslinger_headshots.png',
  'item/tesla_bullets':                  'item/tesla_bullets.svg',
  'item/titanic_magazine':               'item/titanic_magazine.svg',
  'item/toxic_bullets':                  'item/toxic_bullets.svg',
  'item/warp_stone':                     'item/warp_stone.svg',
  'item/crippling_headshot':             'item/crippling_headshot.svg',
  'item/frenzy':                         'item/frenzy.svg',
  'item/glass_cannon':                   'item/glass_cannon.svg',
  'item/lucky_shot':                     'item/lucky_shot.svg',
  'item/ricochet':                       'item/ricochet.svg',
  'item/shadow_weave':                   'item/shadow_weave.svg',
  'item/silencer':                       'item/silencer.svg',
  'item/spiritual_overflow':             'item/spiritual_overflow.svg',
  'item/vampiric_burst':                 'item/vampiric_burst.svg',
  'item/enduring_spirit':                'item/enduring_spirit.svg',
  'item/extra_health':                   'item/extra_health.svg',
  'item/extra_regen':                    'item/extra_regen.svg',
  'item/extra_stamina':                  'item/extra_stamina.svg',
  'item/healing_rite':                   'item/healing_rite.svg',
  'item/melee_lifesteal':                'item/melee_lifesteal.svg',
  'item/sprint_boots':                   'item/sprint_boots.svg',
  'item/bullet_armor':                   'item/bullet_armor.svg',
  'item/bullet_lifesteal':               'item/bullet_lifesteal.svg',
  'item/combat_barrier':                 'item/combat_barrier.svg',
  'item/debuff_reducer':                 'item/debuff_reducer.svg',
  'item/divine_barrier':                 'item/divine_barrier.svg',
  'item/enchanters_barrier':             'item/enchanters_barrier.svg',
  'item/enduring_speed':                 'item/enduring_speed.svg',
  'item/healbane':                       'item/healbane.svg',
  'item/healing_booster':                'item/healing_booster.svg',
  'item/healing_nova':                   'item/healing_nova.svg',
  'item/reactive_barrier':               'item/reactive_barrier.svg',
  'item/restorative_locket':             'item/restorative_locket.svg',
  'item/return_fire':                    'item/return_fire.svg',
  'item/spirit_armor':                   'item/spirit_armor.svg',
  'item/spirit_lifesteal':               'item/spirit_lifesteal.svg',
  'item/debuff_remover':                 'item/debuff_remover.svg',
  'item/fortitude':                      'item/fortitude.svg',
  'item/improved_bullet_armor':          'item/improved_bullet_armor.svg',
  'item/improved_spirit_armor':          'item/improved_spirit_armor.svg',
  'item/lifestrike':                     'item/lifestrike.svg',
  'item/majestic_leap':                  'item/majestic_leap.svg',
  'item/metal_skin':                     'item/metal_skin.svg',
  'item/rescue_beam':                    'item/rescue_beam.svg',
  'item/superior_stamina':               'item/superior_stamina.svg',
  'item/colossus':                       'item/colossus.svg',
  'item/inhibitor':                      'item/inhibitor.svg',
  'item/leech':                          'item/leech.svg',
  'item/phantom_strike':                 'item/phantom_strike.svg',
  'item/siphon_bullets':                 'item/siphon_bullets.svg',
  'item/unstoppable':                    'item/unstoppable.svg',
  'item/veil_walker':                    'item/veil_walker.svg',
  'item/ammo_scavenger':                 'item/ammo_scavenger.svg',
  'item/extra_charge':                   'item/extra_charge.svg',
  'item/extra_spirit':                   'item/extra_spirit.svg',
  'item/infuser':                        'item/infuser.svg',
  'item/mystic_burst':                   'item/mystic_burst.svg',
  'item/mystic_reach':                   'item/mystic_reach.svg',
  'item/spirit_strike':                  'item/spirit_strike.svg',
  'item/bullet_resist_shredder':         'item/bullet_resist_shredder.svg',
  'item/cold_front':                     'item/cold_front.svg',
  'item/decay':                          'item/decay.svg',
  'item/duration_extender':              'item/duration_extender.svg',
  'item/improved_cooldown':              'item/improved_cooldown.svg',
  'item/mystic_vulnerability':           'item/mystic_vulnerability.svg',
  'item/quicksilver_reload':             'item/quicksilver_reload.svg',
  'item/slowing_hex':                    'item/slowing_hex.svg',
  'item/suppressor':                     'item/suppressor.svg',
  'item/withering_whip':                 'item/withering_whip.svg',
  'item/arcane_surge':                   'item/arcane_surge.png',
  'item/ethereal_shift':                 'item/ethereal_shift.svg',
  'item/improved_burst':                 'item/improved_burst.svg',
  'item/improved_reach':                 'item/improved_reach.svg',
  'item/improved_spirit':                'item/improved_spirit.svg',
  'item/knockdown':                      'item/knockdown.svg',
  'item/mystic_slow':                    'item/mystic_slow.svg',
  'item/rapid_recharge':                 'item/rapid_recharge.svg',
  'item/silence_glyph':                  'item/silence_glyph.svg',
  'item/spirit_snatch':                  'item/spirit_snatch.png',
  'item/superior_cooldown':              'item/superior_cooldown.svg',
  'item/superior_duration':              'item/superior_duration.svg',
  'item/surge_of_power':                 'item/surge_of_power.svg',
  'item/torment_pulse':                  'item/torment_pulse.svg',
  'item/boundless_spirit':               'item/boundless_spirit.svg',
  'item/curse':                          'item/curse.svg',
  'item/diviners_kevlar':                'item/diviners_kevlar.svg',
  'item/echo_shard':                     'item/echo_shard.svg',
  'item/escalating_exposure':            'item/escalating_exposure.svg',
  'item/magic_carpet':                   'item/magic_carpet.svg',
  'item/mystic_reverb':                  'item/mystic_reverb.svg',
  'item/refresher':                      'item/refresher.svg',
  'hero/abrams/infernal_resilience':     'hero/abrams/infernal_resilience.svg',
  'hero/abrams/seismic_impact':          'hero/abrams/seismic_impact.svg',
  'hero/abrams/shoulder_charge':         'hero/abrams/shoulder_charge.svg',
  'hero/abrams/siphon_life':             'hero/abrams/siphon_life.svg',
  'hero/bebop/exploding_uppercut':       'hero/bebop/exploding_uppercut.svg',
  'hero/bebop/hook':                     'hero/bebop/hook.svg',
  'hero/bebop/hyper_beam':               'hero/bebop/hyper_beam.svg',
  'hero/bebop/sticky_bomb':              'hero/bebop/sticky_bomb.svg',
  'hero/dynamo/kinetic_pulse':           'hero/dynamo/kinetic_pulse.svg',
  'hero/dynamo/quantum_entanglement':    'hero/dynamo/quantum_entanglement.svg',
  'hero/dynamo/rejuvenating_aurora':     'hero/dynamo/rejuvenating_aurora.svg',
  'hero/dynamo/singularity':             'hero/dynamo/singularity.svg',
  'hero/grey_talon/charged_shot':        'hero/grey_talon/charged_shot.svg',
  'hero/grey_talon/guided_owl':          'hero/grey_talon/guided_owl.svg',
  'hero/grey_talon/spirit_snare':        'hero/grey_talon/spirit_snare.svg',
  'hero/grey_talon/rain_of_arrows':      'hero/grey_talon/rain_of_arrows.svg',
  'hero/haze/bullet_dance':              'hero/haze/bullet_dance.svg',
  'hero/haze/fixation':                  'hero/haze/fixation.svg',
  'hero/haze/sleep_dagger':              'hero/haze/sleep_dagger.svg',
  'hero/haze/smoke_bomb':                'hero/haze/smoke_bomb.svg',
  'hero/infernus/afterburn':             'hero/infernus/afterburn.svg',
  'hero/infernus/catalyst':              'hero/infernus/catalyst.svg',
  'hero/infernus/concussive_combustion': 'hero/infernus/concussive_combustion.svg',
  'hero/infernus/flame_dash':            'hero/infernus/flame_dash.svg',
  'hero/ivy/air_drop':                   'hero/ivy/air_drop.svg',
  'hero/ivy/kudzu_bomb':                 'hero/ivy/kudzu_bomb.svg',
  'hero/ivy/stone_form':                 'hero/ivy/stone_form.svg',
  'hero/ivy/watchers_covenant':          'hero/ivy/watchers_covenant.svg',
  'hero/kelvin/arctic_beam':             'hero/kelvin/arctic_beam.svg',
  'hero/kelvin/frost_grenade':           'hero/kelvin/frost_grenade.svg',
  'hero/kelvin/frozen_shelter':          'hero/kelvin/frozen_shelter.svg',
  'hero/kelvin/ice_path':                'hero/kelvin/ice_path.svg',
  'hero/lady_geist/essence_bomb':        'hero/lady_geist/essence_bomb.svg',
  'hero/lady_geist/life_drain':          'hero/lady_geist/life_drain.svg',
  'hero/lady_geist/malice':              'hero/lady_geist/malice.svg',
  'hero/lady_geist/soul_exchange':       'hero/lady_geist/soul_exchange.svg',
  'hero/lash/death_slam':                'hero/lash/death_slam.svg',
  'hero/lash/flog':                      'hero/lash/flog.svg',
  'hero/lash/grapple':                   'hero/lash/grapple.svg',
  'hero/lash/ground_strike':             'hero/lash/ground_strike.svg',
  'hero/mcginnis/heavy_barrage':         'hero/mcginnis/heavy_barrage.svg',
  'hero/mcginnis/medicinal_specter':     'hero/mcginnis/medicinal_specter.svg',
  'hero/mcginnis/mini_turret':           'hero/mcginnis/mini_turret.svg',
  'hero/mcginnis/spectral_wall':         'hero/mcginnis/spectral_wall.svg',
  'hero/mirage/djinns_mark':             'hero/mirage/djinns_mark.svg',
  'hero/mirage/fire_scarabs':            'hero/mirage/fire_scarabs.svg',
  'hero/mirage/tornado':                 'hero/mirage/tornado.svg',
  'hero/mirage/traveler':                'hero/mirage/traveler.svg',
  'hero/mo_and_krill/burrow':            'hero/mo_and_krill/burrow.svg',
  'hero/mo_and_krill/combo':             'hero/mo_and_krill/combo.svg',
  'hero/mo_and_krill/sand_blast':        'hero/mo_and_krill/sand_blast.svg',
  'hero/mo_and_krill/scorn':             'hero/mo_and_krill/scorn.svg',
  'hero/paradox/kinetic_carbine':        'hero/paradox/kinetic_carbine.svg',
  'hero/paradox/paradoxical_swap':       'hero/paradox/paradoxical_swap.svg',
  'hero/paradox/pulse_grenade':          'hero/paradox/pulse_grenade.svg',
  'hero/paradox/time_wall':              'hero/paradox/time_wall.svg',
  'hero/pocket/affliction':              'hero/pocket/affliction.svg',
  'hero/pocket/barrage':                 'hero/pocket/barrage.svg',
  'hero/pocket/enchanters_satchel':      'hero/pocket/enchanters_satchel.svg',
  'hero/pocket/flying_cloak':            'hero/pocket/flying_cloak.svg',
  'hero/seven/lightning_ball':           'hero/seven/lightning_ball.svg',
  'hero/seven/power_surge':              'hero/seven/power_surge.svg',
  'hero/seven/static_charge':            'hero/seven/static_charge.svg',
  'hero/seven/storm_cloud':              'hero/seven/storm_cloud.svg',
  'hero/shiv/bloodletting':              'hero/shiv/bloodletting.svg',
  'hero/shiv/killing_blow':              'hero/shiv/killing_blow.svg',
  'hero/shiv/serrated_knives':           'hero/shiv/serrated_knives.svg',
  'hero/shiv/slice_and_dice':            'hero/shiv/slice_and_dice.svg',
  'hero/vindicta/assassinate':           'hero/vindicta/assassinate.svg',
  'hero/vindicta/crow_familiar':         'hero/vindicta/crow_familiar.svg',
  'hero/vindicta/flight':                'hero/vindicta/flight.svg',
  'hero/vindicta/stake':                 'hero/vindicta/stake.svg',
  'hero/viscous/goo_ball':               'hero/viscous/goo_ball.svg',
  'hero/viscous/puddle_punch':           'hero/viscous/puddle_punch.svg',
  'hero/viscous/splatter':               'hero/viscous/splatter.svg',
  'hero/viscous/the_cube':               'hero/viscous/the_cube.svg',
  'hero/warden/alchemical_flask':        'hero/warden/alchemical_flask.svg',
  'hero/warden/binding_word':            'hero/warden/binding_word.svg',
  'hero/warden/last_stand':              'hero/warden/last_stand.svg',
  'hero/warden/willpower':               'hero/warden/willpower.svg',
  'hero/wraith/card_trick':              'hero/wraith/card_trick.svg',
  'hero/wraith/full_auto':               'hero/wraith/full_auto.svg',
  'hero/wraith/project_mind':            'hero/wraith/project_mind.svg',
  'hero/wraith/telekinesis':             'hero/wraith/telekinesis.svg',
  'hero/yamato/crimson_slash':           'hero/yamato/crimson_slash.svg',
  'hero/yamato/flying_strike':           'hero/yamato/flying_strike.svg',
  'hero/yamato/power_slash':             'hero/yamato/power_slash.svg',
  'hero/yamato/shadow_transformation':   'hero/yamato/shadow_transformation.svg',
  'stat/cooldown':                       'stat/cooldown.svg',
  'stat/charge':                         'stat/charge.svg',
  'stat/charge_cooldown':                'stat/charge_cooldown.svg',
  'stat/duration':                       'stat/duration.svg',
  'stat/range':                          'stat/range.svg',
  'stat/aoe':                            'stat/aoe.svg',
  'stat/weapon_damage':                  'stat/weapon_damage.svg',
  'stat/spirit_damage':                  'stat/spirit_damage.svg',
  'stat/melee':                          'stat/melee.svg',
  'stat/bullet':                         'stat/bullet.svg',
  'stat/fire_rate':                      'stat/fire_rate.svg',
  'stat/ammo':                           'stat/ammo.svg',
  'stat/reload':                         'stat/reload.svg',
  'stat/bullet_armor':                   'stat/bullet_armor.svg',
  'stat/bullet_resist_reduction':        'stat/bullet_resist_reduction.png',
  'stat/spirit_armor':                   'stat/spirit_armor.svg',
  'stat/spirit_resist_reduction':        'stat/spirit_resist_reduction.png',
  'stat/bullet_shield':                  'stat/bullet_shield.svg',
  'stat/spirit_shield':                  'stat/spirit_shield.svg',
  'stat/move_speed':                     'stat/move_speed.svg',
  'stat/stamina':                        'stat/stamina.svg',
  'stat/move_slow':                      'stat/move_slow.svg',
  'stat/stun':                           'stat/stun.svg',
  'stat/invisible':                      'stat/invisible.svg',
  'stat/health':                         'stat/health.svg',
  'stat/healing':                        'stat/healing.svg',
  'stat/damage_amplification':           'stat/damage_amplification.svg',
  'stat/placeholder':                    'stat/placeholder.svg',
  'stat/ability_point':                  'stat/ability_point.svg',
  'stat/silence':                        'stat/silence.svg',
  'cancel':                              'cancel.svg',
  'compress':                            'compress.svg',
  'dropdown':                            'dropdown.svg',
  'error':                               'error.svg',
  'expand':                              'expand.svg',
  'font':                                'font.svg',
  'gear':                                'gear.svg',
  'grip':                                'grip.svg',
  'hourglass_half':                      'hourglass_half.svg',
  'plus':                                'plus.svg',
  'soul':                                'soul.svg',
  'spirit':                              'spirit.svg',
  'swap':                                'swap.svg',
  'trash':                               'trash.svg',
  'vitality':                            'vitality.svg',
  'weapon':                              'weapon.svg',
};

const allIconFiles = Object.values(filenames);

const dataRegex = /^data:/;
const isData = (s) => Boolean(s.match(dataRegex));

const Icon = ({image, large, color, onMouseDown}) => {
  const config = useContext(ConfigContext);
  const colorClass = `mock-icon-${color}`;
  const classes = classNames('mock-icon', {
    [colorClass]:          Boolean(color),
    'mock-icon-clickable': Boolean(onMouseDown),
    'mock-icon-large':     Boolean(large),
  });

  const filename = filenames[image] || filenames['stat/placeholder'];
  const url = image && isData(image) ?
    `url(${image})` :
    `url("${config.baseUrl}icon/${filename}")`;

  return (
    <span
      className={classes}
      style={{maskImage: url}}
      onMouseDown={onMouseDown}
    />
  );
};

export {Icon, allIconFiles, hiddenColors, iconColors};
