import { AbstractControl, ValidatorFn } from '@angular/forms';

export function PasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value) {
      const errorObj: any = {};

      const containsSmallLetter = /[a-z]/.test(control.value);
      const containsCapitalLetter = /[A-Z]/.test(control.value);
      const containsNumber = /[0-9]/.test(control.value);
      const containsSpecialCharacter = /[!@#$%^&*]/.test(control.value);

      if (!containsCapitalLetter) errorObj.capsCheck = true;
      if (!containsSmallLetter) errorObj.smallLetterCheck = true;
      if (!containsNumber) errorObj.numCheck = true;
      if (!containsSpecialCharacter) errorObj.specialCharCheck = true;
      return errorObj;
    }

    return null;
  };
}
