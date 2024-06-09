import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  member!: Member;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  user!: User; // Ensure user is properly initialized

  constructor(
    public presence: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {
    // Fetch the current user from the account service
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) this.user = user;
    });
    this.router.routeReuseStrategy.shouldReuseRoute=() => false;
  }
  

  ngOnInit(): void {
    // Get member data from route resolver
    this.route.data.subscribe((data) => {
      this.member = data['member'];
    });

    // Get query parameters to set the initial active tab
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'] ? params['tab'] : 0;
      this.selectTab(tab);
    });

    // Configure gallery options
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    // Load member's gallery images
    this.galleryImages = this.getImages();
  }

  // Method to get images for the gallery
  getImages(): NgxGalleryImage[] {
    const galleryImages: NgxGalleryImage[] = [];
    for (const photo of this.member.photos) {
      galleryImages.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    return galleryImages;
  }

  // Method to load messages for the member
  loadMessages(): void {
    if (this.member.username) {
      this.messageService.getMessageThread(this.member.username).subscribe((messages) => {
        this.messages = messages;
      });
    }
  }

  // Method to select a tab
  selectTab(tabId: number): void {
    const tab = this.memberTabs?.tabs[tabId];
    if (tab) {
      tab.active = true;
    }
  }

  // Method triggered when a tab is activated
  onTabActivated(data: TabDirective): void {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    }
    else 
    {
      this.messageService.stopHubConnection();
    }
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
