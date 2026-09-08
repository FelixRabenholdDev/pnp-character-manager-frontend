import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CharacterService } from '../../../../core/services/character.service';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './character-create.html',
  styleUrl: './character-create.scss'
})
export class CharacterCreate {
  characterForm: FormGroup;
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private router: Router
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      characterClass: ['', Validators.required],
      race: ['', Validators.required],
      level: [1, [Validators.required, Validators.min(1)]],
      stats: this.fb.group({
        strength: [10, [Validators.required, Validators.min(1), Validators.max(30)]],
        dexterity: [10, [Validators.required, Validators.min(1), Validators.max(30)]],
        constitution: [10, [Validators.required, Validators.min(1), Validators.max(30)]],
        intelligence: [10, [Validators.required, Validators.min(1), Validators.max(30)]],
        wisdom: [10, [Validators.required, Validators.min(1), Validators.max(30)]],
        charisma: [10, [Validators.required, Validators.min(1), Validators.max(30)]]
      })
    });
  }

  onSubmit(): void {
    if (this.characterForm.invalid) {
      return;
    }

    this.errorMessage.set(null);

    this.characterService.createCharacter(this.characterForm.value).subscribe({
      next: (createdCharacter) => {
        this.router.navigate(['/characters', createdCharacter.id]);
      },
      error: (err) => {
        this.errorMessage.set(this.extractErrorMessage(err));
      }
    });
  }

  private extractErrorMessage(err: any): string {
    if (err.error?.fieldErrors && Object.keys(err.error.fieldErrors).length > 0) {
      return Object.entries(err.error.fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
    }
    return err.error?.message ?? 'Charakter konnte nicht erstellt werden.';
  }
}