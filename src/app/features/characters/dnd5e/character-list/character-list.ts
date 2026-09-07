import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CharacterService } from '../../../../core/services/character.service';
import { PlayerCharacter } from '../../../../core/models/player-character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss'
})
export class CharacterList implements OnInit {
  characters = signal<PlayerCharacter[]>([]);
  errorMessage = signal<string | null>(null);

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.getAllCharacters().subscribe({
      next: (data) => {
        this.characters.set(data);
      },
      error: (err) => {
        this.errorMessage.set('Fehler beim Laden der Charaktere: ' + err.message);
      }
    });
  }
}