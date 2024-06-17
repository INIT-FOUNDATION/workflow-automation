import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'admin-management',
    loadChildren: () =>
      import('./screens/admin-management/admin-management.module').then((m) => m.AdminManagementModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'form-builder',
    loadChildren: () =>
      import('./screens/form-builder/form-builder.module').then((m) => m.FormBuilderModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'workflow-builder',
    loadChildren: () =>
      import('./screens/workflow-builder/workflow-builder.module').then((m) => m.WorkflowBuilderModule),
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log('NavigationEnd event:', event);
      }
    });
  }
}
