import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorsCallsComponent } from './connectors-calls.component';

describe('ConnectorsCallsComponent', () => {
  let component: ConnectorsCallsComponent;
  let fixture: ComponentFixture<ConnectorsCallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorsCallsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorsCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
