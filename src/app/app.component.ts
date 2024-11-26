import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, FormsModule, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})

export class AppComponent {

  title = 'BikeVille';

}
