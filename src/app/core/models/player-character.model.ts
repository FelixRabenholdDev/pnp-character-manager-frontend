import { Ability } from '../models/reference-data.model';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  strengthModifier: number;
  dexterityModifier: number;
  constitutionModifier: number;
  intelligenceModifier: number;
  wisdomModifier: number;
  charismaModifier: number;
}

export interface EffectiveAbilityScores {
  strength: number;
  strengthModifier: number;
  dexterity: number;
  dexterityModifier: number;
  constitution: number;
  constitutionModifier: number;
  intelligence: number;
  intelligenceModifier: number;
  wisdom: number;
  wisdomModifier: number;
  charisma: number;
  charismaModifier: number;
}

export interface CharacterStatsInput {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export type GenerationMethod = 'POINT_BUY' | 'STANDARD_ARRAY' | 'ROLLED';

export interface PlayerCharacter {
  id: number;
  name: string;
  raceName: string;
  className: string;
  backgroundName: string;
  level: number;
  generationMethod: GenerationMethod;
  baseStats: CharacterStats;
  effectiveStats: EffectiveAbilityScores;
  proficiencyBonus: number;
  ownerUsername: string;
}

export interface PlayerCharacterCreateRequest {
  name: string;
  raceId: number;
  classId: number;
  backgroundId: number;
  level: number;
  generationMethod: GenerationMethod;
  stats: CharacterStatsInput;
  backgroundBonuses: Partial<Record<Ability, number>>;
}

export interface RolledAbilityScore {
  rolls: number[];
  droppedRoll: number;
  total: number;
}