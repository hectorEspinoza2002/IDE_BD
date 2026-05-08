import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Ide } from './ide/ide';

export const routes: Routes = [

    {
        path: '',
        component: Login
    },
    {
        path: 'ide',
        component: Ide
    }


];
