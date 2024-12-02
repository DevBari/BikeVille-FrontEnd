import { Component } from '@angular/core';
import { FooterComponent } from '@components/footer/footer.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { HeaderComponent } from '@components/header/header.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
