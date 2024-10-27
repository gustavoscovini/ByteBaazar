import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductListComponent } from './product-list/product-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductCrudListComponent } from './product-crud-list/product-crud-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { RegisterProductComponent } from './product-register/product-register.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product-crud-list', component: ProductCrudListComponent },
  { path: 'product-edit/:id', component: ProductEditComponent },
  { path: 'register-product', component: RegisterProductComponent},
  { path: 'shopping-cart', component: ShoppingCartComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
