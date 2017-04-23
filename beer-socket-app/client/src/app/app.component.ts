import { Component, OnInit } from '@angular/core';
import { Message } from './shared/message.model';
import { User } from './shared/user.model';
import { SocketService } from './shared/socket.service';

import { CookieService } from 'angular2-cookie/core';
import { Angular2TokenService } from 'angular2-token';

let AUTH_TOKEN = (Math.floor(Math.random() * (10000 - 0)) + 1).toString();

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [SocketService]
})
export class AppComponent implements OnInit {
    private rooms: string[];
    private user: User;
    private messages: Message[];
    private messageContent: string;
    private ioConnection: any;

    constructor(private tokenService: Angular2TokenService,
                private socketService: SocketService,
                private cookieService: CookieService,
    ) {}

    ngOnInit(): void {
        if (this.cookieService.get('auth_token') === undefined || this.cookieService.get('auth_token') === '') {
            this.cookieService.put('auth_token', AUTH_TOKEN);
        } 

        this.initModel();
        this.initIoConnection();
        this.tokenService.init();
    }

    private initModel(): void {
        this.user = new User('Betty', this.cookieService.get('auth_token'));
        this.createUser();

        this.messages = [];
        this.rooms = [];
    }

    private initIoConnection(): void {
        this.ioConnection = this.socketService.get().subscribe((message: Message) => {
            this.messages.push(message);
        });
    }

    sendMessage(): void {
        this.socketService.send(new Message(this.user.name, this.messageContent));
        this.messageContent = null;
    }

    createUser(): void {
        this.socketService.createUser(this.user);
    }
}
