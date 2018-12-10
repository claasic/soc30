import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError, BehaviorSubject } from 'rxjs';
import { concatMap, map, switchMap, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ItemService } from "../shared/services/item.service";



@Component({
    moduleId: module.id,
    selector: "rating",
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

    // sync
    private id: string;
    private rating = []; 

    constructor(
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private page: Page,
        private appSet: AppSettingsService,
        private itemService: ItemService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        if (!this.appSet.getUser('guest')) {
            // 
        } else {
            console.log('how the fuck did the user get here?');
        }
    }

    deleteRating(val) {
        let idx = this.rating.indexOf(val);
        if (idx !== -1) {
            this.rating.splice(idx, 1);
        }
    }
    
    addRating(val) {
        if (this.rating.indexOf(val) != -1) {
            this.rating.push(val);
        }
    }

    submitRating() {
        let role = this.id.slice(0,1);
        let henqId = this.id.slice(1);
        if (role === 'X') {
            this.itemService.rateItem(henqId, this.rating);
        }
        if (role === 'Y') {
            this.itemService.rateFilerItem(henqId, this.rating)
        }
    }

    public goBack() {
        this.routerExtension.back();
    }
}