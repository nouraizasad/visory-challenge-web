import { Routes } from '@angular/router';
import { SearchComponent } from './modules/events/search/search.component';

export const routes: Routes = [
    { path: '', redirectTo: 'events', pathMatch: 'full' },
    { path: 'events', component: SearchComponent },
];
