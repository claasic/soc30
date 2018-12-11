import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Carousel, IndicatorAnimation } from 'nativescript-carousel';
import { getCategoryIconSource } from "../app.component";
import { Page } from "tns-core-modules/ui/page";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Router } from '@angular/router';
import { AppSettingsService } from '../shared/services/appsettings.service';

// clean before prod
import { AuthenticationService } from '../shared/services/authentication.service';


@Component({
	moduleId: module.id,
	selector: 'welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss']

})

export class WelcomeComponent implements OnInit {
	@ViewChild('carousel') carouselRef: ElementRef;
	constructor(
		private page: Page, 
		private appSet: AppSettingsService,
		private router: Router,
		// clean before prod
		private authenticationService: AuthenticationService) {
		page.actionBarHidden = true;
		this.page.enableSwipeBackNavigation = false;
	}

	ngOnInit() { }

	onTapGuest() {
		// reset login status - clean before prod
		this.authenticationService.logout();
		// register user as guest
		this.appSet.setUser('guest', 'true');

		this.router.navigate(['../home']);
	}

	getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}

}