import { Component, OnInit } from '@angular/core';
import { Message } from './shared/message.model';
import { User } from './shared/user.model';
import { SocketService } from './shared/socket.service';

import { Angular2TokenService } from 'angular2-token';
import { CookieService } from 'angular2-cookie/core';

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

    constructor(private socketService: SocketService,
                private tokenService: Angular2TokenService,
                private cookieService: CookieService,
    ) {}

    ngOnInit(): void {
        this.initModel();
        this.initIoConnection();
        this.cookieService.put('auth', 'klhgjfadkh987676hjgfhj')
        this.tokenService.init();
    }

    private initModel(): void {
        this.user = new User(this.getRandomUsername(), AUTH_TOKEN);
        this.messages = [];
        this.rooms = [];
    }

    private initIoConnection(): void {
        this.ioConnection = this.socketService.get().subscribe((message: Message) => {
            this.messages.push(message);
        });
    }

    private getRandomUsername(): string {
        return 'User-' + (Math.floor(Math.random() * (10000 - 0)) + 1);
    }

    sendMessage(): void {
        this.socketService.send(new Message(this.user, this.messageContent));
        this.messageContent = null;
    }
}
