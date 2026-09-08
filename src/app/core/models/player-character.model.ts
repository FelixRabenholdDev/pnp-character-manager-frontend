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

export interface PlayerCharacter {
  id: number;
  name: string;
  characterClass: string;
  race: string;
  level: number;
  stats: CharacterStats;
  proficiencyBonus: number;
  ownerUsername: string;
}

export interface CharacterStatsInput {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
} 

export interface PlayerCharacterCreateRequest {
  name: string;
  characterClass: string;
  race: string;
  level: number;
  stats: CharacterStatsInput;
}