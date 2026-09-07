import { Routes } from '@angular/router';
import { CharacterList } from './features/characters/dnd5e/character-list/character-list';

export const routes: Routes = [
  { path: 'characters', component: CharacterList },
  { path: '', redirectTo: 'characters', pathMatch: 'full' }
];