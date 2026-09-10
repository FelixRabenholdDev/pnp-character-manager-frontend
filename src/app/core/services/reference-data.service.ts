import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackgroundDefinition, CharacterClassDefinition, RaceDefinition } from '../models/reference-data.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  private readonly baseUrl = `${environment.apiUrl}/reference-data`;

  constructor(private http: HttpClient) {}

  getRaces(): Observable<RaceDefinition[]> {
    return this.http.get<RaceDefinition[]>(`${this.baseUrl}/races`);
  }

  getClasses(): Observable<CharacterClassDefinition[]> {
    return this.http.get<CharacterClassDefinition[]>(`${this.baseUrl}/classes`);
  }

  getBackgrounds(): Observable<BackgroundDefinition[]> {
    return this.http.get<BackgroundDefinition[]>(`${this.baseUrl}/backgrounds`);
  }
}