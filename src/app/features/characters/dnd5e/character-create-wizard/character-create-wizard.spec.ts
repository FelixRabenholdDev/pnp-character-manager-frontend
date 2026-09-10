import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCreateWizard } from './character-create-wizard';

describe('CharacterCreateWizard', () => {
  let component: CharacterCreateWizard;
  let fixture: ComponentFixture<CharacterCreateWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCreateWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCreateWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
