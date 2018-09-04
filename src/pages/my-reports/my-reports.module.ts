import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyReportsPage } from './my-reports';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MyReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyReportsPage),
    ComponentsModule
  ],
})
export class MyReportsPageModule {}
