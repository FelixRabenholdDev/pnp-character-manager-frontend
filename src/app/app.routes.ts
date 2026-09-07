import { Routes } from '@angular/router';
import { CharacterList } from './features/characters/dnd5e/character-list/character-list';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'characters', component: CharacterList, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];