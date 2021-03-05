import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ValidateName } from '../validators/name.validator';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  constructor(private formBuilder: FormBuilder){
  }

ngOnInit(): void {
  this.createForm();
}
createForm() {
  this.feedbackForm  =  this.formBuilder.group({
    name: ['', [Validators.required,
                ValidateName,
                Validators.minLength(4)]],
    gender: ['', [Validators.required]],
    rating: ['', [Validators.required]],
    comment: ['', [Validators.required, Validators.minLength(20)]]
});
}
saveFeedback(formDirective: FormGroupDirective) {
  console.table(this.feedbackForm.value);
  formDirective.resetForm();
  this.feedbackForm.reset();
}

}
