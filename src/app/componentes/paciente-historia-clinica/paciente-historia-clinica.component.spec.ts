import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteHistoriaClinicaComponent } from './paciente-historia-clinica.component';

describe('PacienteHistoriaClinicaComponent', () => {
  let component: PacienteHistoriaClinicaComponent;
  let fixture: ComponentFixture<PacienteHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacienteHistoriaClinicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
