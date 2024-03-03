import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { DriverComponent } from './pages/driver/driver.component';
import { TrackerComponent } from './pages/tracker/tracker.component';

export const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'driver', component: DriverComponent },
    { path: 'tracker', component: TrackerComponent },
];
