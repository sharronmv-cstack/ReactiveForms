import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms-component',
  template: ` <form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div *ngFor="let formField of formFields" style="margin: 1em 0">
      <label> {{formField.name}} </label>
      <input type="{{formField.type}}" value="{{formField.name}}" [required]="formField.required" formControlName="{{formField.name}}">
      <br>
  </div>
  <button type="submit" [disabled]="this.form.invalid">Submit</button>
</form>`
})
export class FormComponentComponent implements OnInit {

  onSubmit() {
    console.log(this.form.value);
  }

  formFields: any[] = [];
  form = new FormGroup({});
  constructor(private formBuilder: UntypedFormBuilder, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get<any[]>('/assets/dataFormat.json').subscribe((formFields: any) => {
      for (let formField of formFields) {
        this.form.addControl(formField.name, new FormControl('', this.getValidator(formField)));
      }
      this.formFields = formFields;
    });
  }
  private getValidator(formField: any): ValidatorFn[] {
    let validate: ValidatorFn[] = [];
    for(var i of formField.validation)
    {
      if(i=="required")
        validate.push(Validators.required);
      else if(i=="email")
        validate.push(Validators.email);
    }
    return validate;
  }
}