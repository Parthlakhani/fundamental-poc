import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemingService, ThemingModule } from '@fundamental-ngx/core/theming';
import { RouterModule } from '@angular/router';
import { ListModule } from '@fundamental-ngx/core/list';
import { VerticalNavigationModule } from '@fundamental-ngx/core/vertical-navigation';
import {
  PlatformPanelModule,
  PlatformTableModule,
} from '@fundamental-ngx/platform';
import { TableTreeComponent } from './table-tree/table-tree.component';
import { IconModule, SplitterModule } from '@fundamental-ngx/core';

@NgModule({
  declarations: [AppComponent, TableTreeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    VerticalNavigationModule,
    ListModule,
    IconModule,
    PlatformTableModule,
    PlatformPanelModule,
    SplitterModule,
    ThemingModule.withConfig({ defaultTheme: 'sap_horizon' }),
    RouterModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(themingService: ThemingService) {
    themingService.init();
  }
}
