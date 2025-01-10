import { Routes, RouterModule } from '@angular/router';
import { HomeComponent as Home} from '@components/home/home.component';
import { ContactComponent as Contact } from '@components/contact/contact.component';
import { LoginComponent as Login } from '@components/login/login.component';
import { UserComponent as User } from '@components/user/user.component';
import { ResetPasswordComponent } from '@components/user/userChild/reset-password/reset-password.component';
import { CategoryComponent } from '@components/category/categorycomponent';
import { SearchProductsComponent } from '@components/search/search-products/search-products.component';


export const routes: Routes = [

    { path: 'home', component: Home }, // Home component
    { path: 'contact', component: Contact }, // Contatti component
    { path: 'categories/:id',component: CategoryComponent},
    { path: 'search/:search',component: SearchProductsComponent},

    { path: 'profile/:email', component: User, children: [
        {path: 'resetPassword/:id',component: ResetPasswordComponent}]
    }, // User component

    { path: 'login', component: Login}, // redirect to Login 
    { path: '', redirectTo: 'home', pathMatch: 'full' } // redirect to home
];
