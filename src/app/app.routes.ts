import { Routes, RouterModule } from '@angular/router';
import { HomeComponent as Home} from '@components/home/home.component';
import { ProductComponent as Product} from '@components/product/product.component';
import { ContactComponent as Contact } from '@components/contact/contact.component';
import { LoginComponent as Login } from '@components/login/login.component';

export const routes: Routes = [

    { path: 'home', component: Home }, // Home component
    { path: 'product', component: Product }, // Prodotti component 
    { path: 'contact', component: Contact }, // Contatti component
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirect to home
    { path: 'login', component: Login}, // redirect to Login 
];
