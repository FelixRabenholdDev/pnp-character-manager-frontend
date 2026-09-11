import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerCharacter } from '../models/player-character.model';
import { PlayerCharacterCreateRequest } from '../models/player-character.model';
import { environment } from '../../../environments/environment';
import { RolledAbilityScore } from '../models/player-character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly baseUrl = `${environment.apiUrl}/characters`;

  constructor(private http: HttpClient) {}

  getAllCharacters(): Observable<PlayerCharacter[]> {
    return this.http.get<PlayerCharacter[]>(this.baseUrl);
  }

  getCharacterById(id: number): Observable<PlayerCharacter> {
    return this.http.get<PlayerCharacter>(`${this.baseUrl}/${id}`);
  }

  createCharacter(request: PlayerCharacterCreateRequest): Observable<PlayerCharacter> {
    return this.http.post<PlayerCharacter>(this.baseUrl, request);
  }

  rollAbilityScores(): Observable<RolledAbilityScore[]> {
    return this.http.get<RolledAbilityScore[]>(`${this.baseUrl}/roll-ability-scores`);
  }
}