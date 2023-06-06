import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitarEspecialistaComponent } from './habilitar-especialista.component';

describe('HabilitarEspecialistaComponent', () => {
  let component: HabilitarEspecialistaComponent;
  let fixture: ComponentFixture<HabilitarEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabilitarEspecialistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabilitarEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
