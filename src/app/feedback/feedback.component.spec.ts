import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeedbackComponent } from './feedback.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValidateName } from '../validators/name.validator';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, MatSelectModule, MatRadioModule, MatInputModule, NoopAnimationsModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ FeedbackComponent ],
      providers: [FormBuilder, FormGroupDirective]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    component.feedbackForm = new FormGroup({
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should check saveFeedback function", () => {
    //* mock a formgroupdirective
    const fb = new FormBuilder();
    let formDirective: FormGroupDirective = new FormGroupDirective([],[]);
    formDirective.form = fb.group({
      test: fb.control(null)
    });
    //* test a custom validator
    expect(ValidateName(new FormControl('bob'))).toEqual({ validName: true });
    expect(component.saveFeedback).toBeTruthy();
    expect(component.saveFeedback).toBeDefined();
    spyOn(component, "saveFeedback").and.callThrough();
    component.saveFeedback(formDirective);
    expect(component.saveFeedback).toHaveBeenCalled();
  });
});
