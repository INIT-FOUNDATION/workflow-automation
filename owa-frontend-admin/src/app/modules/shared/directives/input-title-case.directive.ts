import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputTitleCase]'
})
export class InputTitleCaseDirective {

  elemRef :ElementRef;
  constructor(private el:ElementRef) {
    this.elemRef =el;
  }

  @HostListener('keydown') onfocusOut(){
    this.elemRef.nativeElement.value= this. toTitleCase(this.elemRef.nativeElement.value);
  }

  toTitleCase(input){
    return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
  }

}
