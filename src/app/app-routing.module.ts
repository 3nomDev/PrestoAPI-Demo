import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { OrdersComponent } from './orders/orders.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { CustomersComponent } from './customers/customers.component';
import { SetttingsComponent } from './setttings/setttings.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'settings',
    component: SetttingsComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
  },
  {
    path: 'shipment',
    component: ShipmentComponent,
  },
  {
    path: 'inventory',
    component: InventoryComponent,
  },
  {
    path: 'suppliers',
    component: SuppliersComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
