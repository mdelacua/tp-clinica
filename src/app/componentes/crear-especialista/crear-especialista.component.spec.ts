import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEspecialistaComponent } from './crear-especialista.component';

describe('CrearEspecialistaComponent', () => {
  let component: CrearEspecialistaComponent;
  let fixture: ComponentFixture<CrearEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearEspecialistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
