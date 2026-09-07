import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../../../core/services/character.service';
import { PlayerCharacter } from '../../../../core/models/player-character.model';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss'
})
export class CharacterList implements OnInit {
  characters: PlayerCharacter[] = [];
  errorMessage: string | null = null;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.getAllCharacters().subscribe({
      next: (data) => {
        this.characters = data;
      },
      error: (err) => {
        this.errorMessage = 'Fehler beim Laden der Charaktere: ' + err.message;
        console.error(err);
      }
    });
  }
}