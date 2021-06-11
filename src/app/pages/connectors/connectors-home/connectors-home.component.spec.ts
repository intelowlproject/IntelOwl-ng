import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorsHomeComponent } from './connectors-home.component';

describe('ConnectorsHomeComponent', () => {
  let component: ConnectorsHomeComponent;
  let fixture: ComponentFixture<ConnectorsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorsHomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
