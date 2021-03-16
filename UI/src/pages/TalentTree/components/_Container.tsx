import React, { useState, useEffect } from "react";
import * as Types from "../../../types";
import * as Tracked from "../Types";


interface Props {
  configuration: Types.TalentConfiguration,
  children: (
    points: number,
    maxPoints: number,
    paths: Tracked.TrackedTalentPath[],
    onActivate: (key: Types.TalentsEnum) => void,
    onDeactivate: (key: Types.TalentsEnum) => void) => React.ReactNode
}

export const Container: React.FC<Props> = ({ configuration, children }) => {
  const [talents, setTalents] = useState(() => buildTalents(configuration));
  const [active, setActive] = useState(() => buildActive(configuration, talents));
  const [enabled, setEnabled] = useState(() => buildEnabled(configuration, talents, active));

  // Run on props change
  useEffect(() => {
    setTalents(buildTalents(configuration));
  }, [configuration]);

  // Run on props change
  useEffect(() => {
    setActive(buildActive(configuration, talents));
  }, [talents, configuration]);

  // Run whenever the active collection changes
  useEffect(() => {
    setEnabled(buildEnabled(configuration, talents, active));
  }, [configuration, talents, active]);

  // remove talent to active collection
  const onActivate = (key: Types.TalentsEnum): void => {
    if(active.has(key)) return;

    const updated = new Map(active);
    const added = talents.get(key);
    if(!added) return;
    
    updated.set(added.key, added);
    setActive(updated);
  }
  // remove talent and all subsequent talents from active collection
  const onDeactivate = (key: Types.TalentsEnum): void => {
    let talent = active.get(key);
    if(!talent) return;

    const updated = new Map(active);
    while(talent) {
      updated.delete(talent.key);
      talent = talent.next;
    }
    setActive(updated);
  }

  const getPoints = (): number => {
    let points = 0;
    active.forEach(v => points += v.points);

    return points;
  }
  const points = getPoints();
  const maxPoints = configuration.maxPoints;

  const getPaths = (paths: Types.TalentPath[]): Tracked.TrackedTalentPath[] => {
    const output: Tracked.TrackedTalentPath[] = [];
    paths.forEach(p => {
      const path: Tracked.TrackedTalentPath = {
        title: p.title,
        talents: mapTalents(p.talents, active, enabled)
      };

      output.push(path);
    });

    return output;
  }
  const paths = getPaths(configuration.paths);

  return (
    <>
      { children(points, maxPoints, paths, onActivate, onDeactivate) }
    </>
  );
};

export interface PointerTalent extends Types.Talent {
  next?: PointerTalent
}

/* Helper methods */
export const buildTalents = (configuration: Types.TalentConfiguration): Map<Types.TalentsEnum, PointerTalent> => {
  const map = new Map<Types.TalentsEnum, PointerTalent>();

  // loop over talents in reverse order so we can include forward pointers in map
  for(const p of configuration.paths) {
    let next: PointerTalent | undefined = undefined;
    for(let i = p.talents.length - 1; i > -1; i--) {
      const talent = p.talents[i];
      const value: PointerTalent = {
        ...talent,
        next
      }
      
      map.set(talent.key, value);
      next = value;
    }
  }
  
  return map;
}
export const buildActive = (configuration: Types.TalentConfiguration, talents: Map<Types.TalentsEnum, PointerTalent>): Map<Types.TalentsEnum, PointerTalent> => {
  const map = new Map<Types.TalentsEnum, PointerTalent>();
  for (const active of configuration.activeTalents) {
    const talent = talents.get(active);
    if(!talent) break;

    map.set(talent.key, talent);
  }

  return map;
}
export const buildEnabled = (configuration: Types.TalentConfiguration, talents: Map<Types.TalentsEnum, PointerTalent>, active: Map<Types.TalentsEnum, PointerTalent>): Map<Types.TalentsEnum, PointerTalent> => {
  const maxPoints = configuration.maxPoints;
  let points = 0;
  const map = buildDefaultEnabled(talents, configuration);

  active.forEach(value => {
    points += value.points;
    if(!value.next) return;

    const next = value.next;
    map.set(next.key, next);
  })

  // if all points have been used, all as disabled
  if(points >= maxPoints) map.clear();

  return map;
}
const buildDefaultEnabled = (talents: Map<Types.TalentsEnum, PointerTalent>, configuration: Types.TalentConfiguration): Map<Types.TalentsEnum, PointerTalent> => {
  const map = new Map<Types.TalentsEnum, PointerTalent>();
  configuration.paths.forEach(p => {
    const firstTalent = p.talents.find(t => true);
    if(!firstTalent) return;
    const talent = talents.get(firstTalent.key)
    if(!talent) return;

    map.set(talent.key, talent);
  });

  return map;
}
const mapTalents = (input: Types.Talent[], active: Map<Types.TalentsEnum, PointerTalent>, enabled: Map<Types.TalentsEnum, PointerTalent>): Tracked.TrackedTalent[] => {
  const talents = input.map(t => {
    const isActive = active.has(t.key);
    const isEnabled = enabled.has(t.key);
    const talent: Tracked.TrackedTalent = {
      ...t,
      active: isActive,
      enabled: isEnabled
    }

    return talent;
  });

  return talents;
}