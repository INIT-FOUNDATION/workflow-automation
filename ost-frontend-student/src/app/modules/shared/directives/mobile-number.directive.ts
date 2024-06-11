import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appMobileNumber]',
})
export class MobileNumberDirective {
  private prevVal: any;
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    const c = initalValue.replace(/^((?!(0))[0-9]{0,10})$/g, '');
    this.el.nativeElement.value = initalValue.substr(0, 10);
    if (c.length > 1 && initalValue.length > 10) {
      this.el.nativeElement.value = this.prevVal;
    }
    if (!(/^((?!(0))[0-9]{0,10})$/.test(initalValue))) {
      if (c.length > 1 && /^(?:0|00)\d+$/.test(c)) {
        this.el.nativeElement.value = initalValue.substr(1, c.length);
        this.el.nativeElement.type = 'text';
        this.el.nativeElement.setSelectionRange(0, 0);
        this.el.nativeElement.type = 'number';
        // setSelectionRange
      } else if ((initalValue).length === 1) {
        this.el.nativeElement.value = '';
      }
      event.stopPropagation();
      return false;
    } else {
      this.prevVal = this.el.nativeElement.value;
    }

  }
}


