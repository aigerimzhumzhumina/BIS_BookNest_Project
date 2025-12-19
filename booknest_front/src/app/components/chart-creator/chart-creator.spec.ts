import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCreator } from './chart-creator';

describe('ChartCreator', () => {
  let component: ChartCreator;
  let fixture: ComponentFixture<ChartCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
