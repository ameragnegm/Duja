import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router ,RouterOutlet ,Event } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'Duja';
  showNavbar : boolean = true ; 
  constructor(private router : Router){}
  ngOnInit() {
    // Listen to every route change
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      
      // Check the URL. If it includes login or register, HIDE the navbar.
      const isAuthPage = event.url.includes('/login') || event.url.includes('/register');
      
      // If we are on an Auth page, showNavbar should be FALSE
      this.showNavbar = !isAuthPage;
    });
  }
}
