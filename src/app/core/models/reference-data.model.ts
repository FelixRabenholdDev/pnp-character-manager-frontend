export interface RaceDefinition {
  id: number;
  name: string;
  description: string;
  traits: string[];
}

export interface CharacterClassDefinition {
  id: number;
  name: string;
  description: string;
  traits: string[];
}

export type Ability = 'STRENGTH' | 'DEXTERITY' | 'CONSTITUTION' | 'INTELLIGENCE' | 'WISDOM' | 'CHARISMA';

export interface BackgroundDefinition {
  id: number;
  name: string;
  description: string;
  eligibleAbilities: Ability[];
  traits: string[];
}