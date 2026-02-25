import { Routes } from '@angular/router';
import { Login } from './pages/Auth/login/login';
import { Checkout } from './pages/checkout/checkout';
import { EmpForm } from './pages/Employee-pages/emp-form/emp-form';
import { ProductList } from './pages/Product-pages/product-list/product-list';
import { ProducDetails } from './pages/Product-pages/produc-details/produc-details';
import { ProductForm } from './pages/Product-pages/product-form/product-form';
import { EmpList } from './pages/Employee-pages/emp-list/emp-list';
import { EmpDatails } from './pages/Employee-pages/emp-datails/emp-datails';
import { OrderList } from './pages/Order-pages/order-list/order-list';
import { OrderForm } from './pages/Order-pages/order-form/order-form';
import { OrderDetails } from './pages/Order-pages/order-details/order-details';
import { Cart } from './pages/Cart/cart/cart';
import { SignUp } from './pages/Auth/sign-up/sign-up';
import { Home } from './pages/home/home';
import { ManageAds } from './pages/Ads/manage-ads/manage-ads';
import { Management } from './pages/Management/management/management';

export const routes: Routes = [
    // --- PUBLIC PAGES ---
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: "home", component: Home },
    { path: "register", component: SignUp },
    { path: "login", component: Login },
    { path: "cart", component: Cart },
    { path: 'checkout', component: Checkout },
    { path: "product/:id", component: ProducDetails },
    { path: "products", component: ProductList },

    // --- MANAGEMENT DASHBOARD (NESTED ROUTES) ---
    {
        path: "manage",
        component: Management, // This contains the Tabs & <router-outlet>
        children: [
            // When user goes to /manage, redirect to /manage/products
            { path: '', redirectTo: 'products', pathMatch: 'full' },

            // The Tabs Content
            { path: "products", component: ProductList },
            { path: "ads", component: ManageAds },
            { path: "employees", component: EmpList },
            { path: "orders", component: OrderList },

            // Forms (Add/Edit) - Loading inside the dashboard layout
            { path: "products/add", component: ProductForm },
            { path: "products/edit/:id", component: ProductForm },
            { path: "employees/add", component: EmpForm },
            { path: "employees/edit/:id", component: EmpForm },
            { path: "orders/add", component: OrderForm },
            { path: "orders/edit/:id", component: OrderForm },

            // Details inside dashboard
            { path: "employees/:id", component: EmpDatails },
            { path: "orders/:id", component: OrderDetails }
        ]
    }
];