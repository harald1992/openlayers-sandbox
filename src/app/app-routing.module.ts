import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { MapContainerComponent } from './components/map-container/map-container.component';

const routes: Routes = [
  { path: '**', component: MapContainerComponent }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  imports: [
    RouterModule.forRoot([], {
      //... other features
      bindToComponentInputs: true // <-- enable this feature
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

