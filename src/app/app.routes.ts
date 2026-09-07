import { Routes } from '@angular/router';
import { CharacterList } from './features/characters/dnd5e/character-list/character-list';
import { CharacterDetail } from './features/characters/dnd5e/character-detail/character-detail';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'characters', component: CharacterList, canActivate: [authGuard] },
  { path: 'characters/:id', component: CharacterDetail, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];