import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CharacterService } from '../../../../core/services/character.service';
import { PlayerCharacter } from '../../../../core/models/player-character.model';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss'
})
export class CharacterDetail implements OnInit {
  character = signal<PlayerCharacter | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage.set('Keine gültige Charakter-ID in der URL.');
      return;
    }

    this.characterService.getCharacterById(Number(idParam)).subscribe({
      next: (data) => this.character.set(data),
      error: (err) => this.errorMessage.set('Charakter konnte nicht geladen werden: ' + err.message)
    });
  }
}