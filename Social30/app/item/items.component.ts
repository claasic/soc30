import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { getCategoryIconSource } from "../app.component";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';

// import * as application from "tns-core-modules/application";
// import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

import { isIOS, isAndroid } from "tns-core-modules/platform";
import { ListViewEventData } from "nativescript-ui-listview";

import { AuthenticationService } from '../shared/services/authentication.service';
import { DataService } from '../shared/services/data.service';

declare var UIView, NSMutableArray, NSIndexPath;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls:  ["./items.component.scss"]
})
export class ItemsComponent implements OnInit {

    items: Item[] = [];
    message: { categories: boolean[], time: number ,distance: number };
    
    // imported this way to avoid angular namespace problems
    formatDuration = this.itemService.formatDuration;
    formatDistance = this.itemService.formatDistance;
    formatStartTime = this.itemService.formatStartTime;
    formatStartTimeLong = this.itemService.formatStartTimeLong;
    formatCategory = this.itemService.formatCategory;
    formatTerra = this.itemService.formatTerra;
    setIcon = this.itemService.getCategoryIconName;

    constructor(
        private itemService: ItemService, 
        private router: RouterExtensions, 
        private appSet: AppSettingsService,
        private authenticationService: AuthenticationService,
        private data: DataService,
        private page: Page,
        ) { }

    ngOnInit(): void {
        // get the current filter settings (default values in this case)
        this.data.currentMessage.subscribe(message => this.message = message);
        // checks whether the user is a guest or not
        if(!this.appSet.getUser('guest')) {
            this.receiveList();
        } else {
            this.items = this.itemService.getGuestItems(12);
        }
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => {
            if (result) {
                // filters entries made by the user, not very clean but whatever
                // I blame those people working on the backend
                // afterwards sorts them by date
                let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
                this.items = result.filter(entry => currentUser._id != entry.createdBy._id)
                    .sort((entry1, entry2) => {
                            let date1 = new Date(entry1.startTime).getTime();
                            let date2 = new Date(entry2.startTime).getTime();
                            return date1 - date2
                    });
            } else {
                console.log('Didnt get any items')
            }
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(["/welcome"], { clearHistory: true });
    }

    templateSelector(item: any, index: number, items: any): string {
        return item.expanded ? "expanded" : "default";
    }

    onItemTap(event: ListViewEventData) {
        const listView = event.object,
                rowIndex = event.index,
                dataItem = event.view.bindingContext;

        dataItem.expanded = !dataItem.expanded;
        if (isIOS) {
            // Uncomment the lines below to avoid default animation
             UIView.animateWithDurationAnimations(0, () => {
                var indexPaths = NSMutableArray.new();
                indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
                listView.ios.reloadItemsAtIndexPaths(indexPaths);
             });
        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
    
}

