import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarUsuariosComponent } from './exportar-usuarios.component';

describe('ExportarUsuariosComponent', () => {
  let component: ExportarUsuariosComponent;
  let fixture: ComponentFixture<ExportarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportarUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
