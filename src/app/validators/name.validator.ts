import { AbstractControl } from '@angular/forms';

export function ValidateName(control: AbstractControl) {
  let regex = /bob/i;
    if (regex.test(control?.value?.toLowerCase())) {
    return { validName: true };
  }
  return null;
}
