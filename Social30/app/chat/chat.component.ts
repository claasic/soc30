import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute} from '@angular/router';
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError } from 'rxjs';
import { concatMap, map, catchError, tap } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ChatService } from "../shared/services/chat.service";
import { ItemService } from '../shared/services/item.service'
import { getCategoryIconSource } from "../app.component";


@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    // async
    private polledChatOverview$: Observable<any>;

    // sync
    // private entries;
    private guest: boolean = false;

    // imported this way to avoid angular namespace problems
    // cant use imported service functions inside html
    formatDuration = this.itemService.formatDuration;
    formatDistance = this.itemService.formatDistance;
    formatStartTime = this.itemService.formatStartTime;
    formatStartTimeLong = this.itemService.formatStartTimeLong;
    formatCategory = this.itemService.formatCategory;
    formatCategoryByUser = this.itemService.formatCategoryByUser;
    formatTerra = this.itemService.formatTerra;
    formatTime = this.itemService.formatTime;
    formatLocation = this.itemService.formatLocation;
    getSubStrings = this.itemService.getSubStrings;
    getSubs = this.itemService.getSubs;
    setIcon = this.itemService.getCategoryIconName;

    public constructor(
        private chatService: ChatService,
        private page: Page,
        private router: Router,
        private appSet: AppSettingsService,
        private itemService: ItemService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if (!this.appSet.getUser('guest')) {
            // the stream
            const chatOverview$ = this.chatService.getChatsOverview();

            // polling every 10s, concatMap subscribes to the stream
            this.polledChatOverview$ = timer(0, 10000).pipe(
                concatMap(_ => chatOverview$),
                tap(res => console.log('tick')),
                map(res => res),
                catchError(err => throwError(err))
            );
        }
    }

    // checks the reading status
    readStatus(item) {
        if (item.readFiler == null) {
            if (!item.readAide) {
                return "Eine neue Nachricht"
            } else {
                return "Alles gelesen"
            }
        } else {
            if (!item.readFiler) {
                return "Eine neue Nachricht"
            } else {
                return "Alles gelesen"
            }
        }
    }

    // just pass the whole item.henquiry object
    userIsFiler(henquiry) {
       if (henquiry.aide == null) {
           return false;
       } else {
           return true;
       }
    }

    // should clear
    aideCanCancelHenquiry(henquiry) {
        // check for success boolean
        if (this.userIsFiler(henquiry)) {
            return false;
        } else {
            return true;
        }
    }

    // missing conditions
    filerCanAcceptHenquiry(henquiry) {
        if (this.userIsFiler(henquiry)) {
            if (true) {
                // check whether the current chat partner is an aide or potential aide
                // best done with contains() 
            }
        } else {
            return false;
        }
    }

    // missing conditions
    filerCanResolveHenquiry(henquiry) {
        if (this.userIsFiler(henquiry)) {
            if (true) {
                // check whether the amountofAide is equal to the number of aids
            }
        } else {
            return false;
        }
    }

    userCanRate() {
        // check success boolean
        // check time?
    }

    rateUser(henquiry) {
        if (this.userIsFiler(henquiry)) {
            this.router.navigate([['../rating', 'X' + henquiry._id]])
        } else {
            this.router.navigate([['../rating', 'Y' + henquiry._id]])
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}

 /*if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
        }
        */