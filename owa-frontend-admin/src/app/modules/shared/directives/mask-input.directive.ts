import { Directive, ElementRef, OnDestroy, Input } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
  selector: '[appMaskInput]'
})
export class MaskInputDirective implements OnDestroy {
  // @Input('appMaskInput') appMaskInput: any[] | undefined;
  mask = [/\d/, /\d/, ':', /\d/, /\d/]; // dd/mm/yyyy
  maskedInputController;

  constructor(private element: ElementRef) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask
    });
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }

}
