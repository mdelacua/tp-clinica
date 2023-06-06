import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentesCreacionComponent } from './componentes-creacion.component';

describe('ComponentesCreacionComponent', () => {
  let component: ComponentesCreacionComponent;
  let fixture: ComponentFixture<ComponentesCreacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentesCreacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentesCreacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
