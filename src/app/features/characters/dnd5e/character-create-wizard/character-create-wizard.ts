import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { CharacterService } from '../../../../core/services/character.service';
import { RaceDefinition, CharacterClassDefinition, BackgroundDefinition, Ability } from '../../../../core/models/reference-data.model';
import { PlayerCharacterCreateRequest, RolledAbilityScore } from '../../../../core/models/player-character.model';

const STANDARD_ARRAY_VALUES = [15, 14, 13, 12, 10, 8];

const POINT_BUY_COST: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const POINT_BUY_BUDGET = 27;

@Component({
  selector: 'app-character-create-wizard',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule
  ],
  templateUrl: './character-create-wizard.html',
  styleUrl: './character-create-wizard.scss'
})
export class CharacterCreateWizard implements OnInit {
  races = signal<RaceDefinition[]>([]);
  classes = signal<CharacterClassDefinition[]>([]);
  backgrounds = signal<BackgroundDefinition[]>([]);
  errorMessage = signal<string | null>(null);
  rolledScores = signal<RolledAbilityScore[]>([]);
  rolledAssignments = signal<(number | null)[]>([null, null, null, null, null, null]);

  methodForm: FormGroup;
  identityForm: FormGroup;
  statsForm: FormGroup;
  bonusForm: FormGroup;

  readonly abilities: Ability[] = ['STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA'];
  readonly standardArrayValues = STANDARD_ARRAY_VALUES;
  readonly pointBuyOptions = [8, 9, 10, 11, 12, 13, 14, 15];

  constructor(
    private fb: FormBuilder,
    private referenceDataService: ReferenceDataService,
    private characterService: CharacterService,
    private router: Router
  ) {
    this.methodForm = this.fb.group({
      generationMethod: ['STANDARD_ARRAY', Validators.required]
    });

    this.identityForm = this.fb.group({
      name: ['', Validators.required],
      raceId: [null, Validators.required],
      classId: [null, Validators.required],
      backgroundId: [null, Validators.required],
      level: [1, [Validators.required, Validators.min(1)]]
    });

    this.statsForm = this.fb.group({
      strength: [8, Validators.required],
      dexterity: [8, Validators.required],
      constitution: [8, Validators.required],
      intelligence: [8, Validators.required],
      wisdom: [8, Validators.required],
      charisma: [8, Validators.required]
    });

    this.bonusForm = this.fb.group({
      distributionType: ['ONE_ONE_ONE', Validators.required],
      plusTwoAbility: [null],
      plusOneAbility: [null]
    });
  }

  ngOnInit(): void {
    this.referenceDataService.getRaces().subscribe(data => this.races.set(data));
    this.referenceDataService.getClasses().subscribe(data => this.classes.set(data));
    this.referenceDataService.getBackgrounds().subscribe(data => this.backgrounds.set(data));
  }

  get selectedBackground(): BackgroundDefinition | undefined {
    const id = this.identityForm.value.backgroundId;
    return this.backgrounds().find(b => b.id === id);
  }

  get selectedMethod(): string {
    return this.methodForm.value.generationMethod;
  }

  get statsValues(): number[] {
    const v = this.statsForm.value;
    return [v.strength, v.dexterity, v.constitution, v.intelligence, v.wisdom, v.charisma];
  }

  get isStandardArrayValid(): boolean {
    const sorted = [...this.statsValues].sort((a, b) => b - a);
    const expected = [...STANDARD_ARRAY_VALUES].sort((a, b) => b - a);
    return JSON.stringify(sorted) === JSON.stringify(expected);
  }

  get pointBuyTotalCost(): number {
    return this.statsValues.reduce((sum, value) => sum + (POINT_BUY_COST[value] ?? Infinity), 0);
  }

  get pointBuyRemaining(): number {
    return POINT_BUY_BUDGET - this.pointBuyTotalCost;
  }

  get isPointBuyValid(): boolean {
    return this.pointBuyRemaining >= 0 && this.statsValues.every(v => v in POINT_BUY_COST);
  }

  get isStatsStepValid(): boolean {
    if (this.selectedMethod === 'STANDARD_ARRAY') return this.isStandardArrayValid;
    if (this.selectedMethod === 'POINT_BUY') return this.isPointBuyValid;
    return this.isRolledAssignmentComplete;
  }

  get isBonusStepValid(): boolean {
    if (this.bonusForm.value.distributionType === 'ONE_ONE_ONE') {
      return true;
    }
    const { plusTwoAbility, plusOneAbility } = this.bonusForm.value;
    return plusTwoAbility && plusOneAbility && plusTwoAbility !== plusOneAbility;
  }

  private computeBackgroundBonuses(): Partial<Record<Ability, number>> {
    const background = this.selectedBackground;
    if (!background) return {};

    if (this.bonusForm.value.distributionType === 'ONE_ONE_ONE') {
      const bonuses: Partial<Record<Ability, number>> = {};
      background.eligibleAbilities.forEach(a => (bonuses[a] = 1));
      return bonuses;
    }

    const { plusTwoAbility, plusOneAbility } = this.bonusForm.value;
    return { [plusTwoAbility]: 2, [plusOneAbility]: 1 };
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    const request: PlayerCharacterCreateRequest = {
      name: this.identityForm.value.name,
      raceId: this.identityForm.value.raceId,
      classId: this.identityForm.value.classId,
      backgroundId: this.identityForm.value.backgroundId,
      level: this.identityForm.value.level,
      generationMethod: this.methodForm.value.generationMethod,
      stats: this.statsForm.value,
      backgroundBonuses: this.computeBackgroundBonuses()
    };

    this.characterService.createCharacter(request).subscribe({
      next: (created) => this.router.navigate(['/characters', created.id]),
      error: (err) => this.errorMessage.set(this.extractErrorMessage(err))
    });
  }

  private extractErrorMessage(err: any): string {
    if (err.error?.fieldErrors && Object.keys(err.error.fieldErrors).length > 0) {
      return Object.entries(err.error.fieldErrors).map(([field, msg]) => `${field}: ${msg}`).join(', ');
    }
    return err.error?.message ?? 'Charakter konnte nicht erstellt werden.';
  }

  rollScores(): void {
    this.characterService.rollAbilityScores().subscribe({
      next: (scores) => {
        this.rolledScores.set(scores);
        this.rolledAssignments.set([null, null, null, null, null, null]);
        this.syncRolledStatsToForm();
      },
      error: (err) => this.errorMessage.set('Würfeln fehlgeschlagen: ' + err.message)
    });
  }

  onRolledAssignmentChange(abilityIndex: number, rolledIndex: number): void {
    const current = [...this.rolledAssignments()];
    current[abilityIndex] = rolledIndex;
    this.rolledAssignments.set(current);
    this.syncRolledStatsToForm();
  }

  private syncRolledStatsToForm(): void {
    const assignments = this.rolledAssignments();
    const scores = this.rolledScores();

    this.statsForm.patchValue({
      strength: assignments[0] !== null ? scores[assignments[0]].total : 8,
      dexterity: assignments[1] !== null ? scores[assignments[1]].total : 8,
      constitution: assignments[2] !== null ? scores[assignments[2]].total : 8,
      intelligence: assignments[3] !== null ? scores[assignments[3]].total : 8,
      wisdom: assignments[4] !== null ? scores[assignments[4]].total : 8,
      charisma: assignments[5] !== null ? scores[assignments[5]].total : 8
    });
  }

  get isRolledAssignmentComplete(): boolean {
    const assignments = this.rolledAssignments();
    const usedIndices = assignments.filter(a => a !== null);
    return usedIndices.length === 6 && new Set(usedIndices).size === 6;
  }

  availableRollOptions(abilityIndex: number): { rollIndex: number; score: RolledAbilityScore }[] {
    const assignments = this.rolledAssignments();
    const scores = this.rolledScores();
    const currentAssignment = assignments[abilityIndex];

    return scores
      .map((score, rollIndex) => ({ rollIndex, score }))
      .filter(({ rollIndex }) => rollIndex === currentAssignment || !assignments.includes(rollIndex));
  }
}