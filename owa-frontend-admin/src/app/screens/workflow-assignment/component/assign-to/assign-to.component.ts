import { Component } from '@angular/core';

@Component({
  selector: 'app-assign-to',
  templateUrl: './assign-to.component.html',
  styleUrls: ['./assign-to.component.scss']
})
export class AssignToComponent {
roles = [
  {id:'1', name:'Accounts'},
  {id:'2', name:'Operations'},
  {id:'3', name:'Design'},
  {id:'4', name:'Customer Support'},
  {id:'5', name:'Sales'},
]

employees = [
  {id:'1', name:'Ramesh Thakur', department:'Sales'},
  {id:'2', name:'Chetan Verma', department:'Marketing'},
  {id:'3', name:'Akriti Rana', department:'Customer Support'},
  {id:'4', name:'Manish Rane', department:'IT'},
  {id:'5', name:'Raina Rao', department:'Accounts'},
]
}
