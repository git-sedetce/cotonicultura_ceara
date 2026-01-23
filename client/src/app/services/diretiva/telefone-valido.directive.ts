import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appTelefoneValido][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TelefoneValidoDirective,
      multi: true
    }
  ],
  standalone: false
})
export class TelefoneValidoDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const telefone = value.toString();

    // Bloqueia números com todos os dígitos iguais
    if (/^(\d)\1+$/.test(telefone)) {
      return { telefoneInvalido: true };
    }

    // Tamanho esperado (10 ou 11 dígitos)
    if (telefone.length < 10) {
      return { telefoneInvalido: true };
    }

    return null;
  }

}
