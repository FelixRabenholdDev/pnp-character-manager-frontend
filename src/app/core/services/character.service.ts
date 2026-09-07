import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerCharacter } from '../models/player-character.model';
import { environment } from '../../../environments/environment';

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
}