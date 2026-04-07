import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { filter } from 'rxjs';
let App = class App {
    router;
    title = 'Duja';
    showNavbar = true;
    constructor(router) {
        this.router = router;
    }
    ngOnInit() {
        // Listen to every route change
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            // Check the URL. If it includes login or register, HIDE the navbar.
            const isAuthPage = event.url.includes('/login') || event.url.includes('/register');
            // If we are on an Auth page, showNavbar should be FALSE
            this.showNavbar = !isAuthPage;
        });
    }
};
App = __decorate([
    Component({
        selector: 'app-root',
        imports: [RouterOutlet, Footer, Header],
        templateUrl: './app.html',
        styleUrl: './app.css'
    })
], App);
export { App };
