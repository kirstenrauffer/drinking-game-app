import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Message } from './message.model';
import { User } from './user.model';
import { CookieService } from 'angular2-cookie/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { BehaviorSubject }  from 'rxjs/BehaviorSubject';

import * as socketIo from 'socket.io-client';

let SERVER_URL = 'http://10.93.166.24:5000';



@Injectable()
export class SocketService {
    private socket;

    constructor(private cookieService: CookieService, public snackBar: MdSnackBar) {
        this.initSocket();
        this.cookieService.put('user_token', 'klhgjfadkh987676hjgfhj')
    }

    private initSocket(): void {
        this.socket = socketIo(SERVER_URL,
            {
                'transports': ['websocket'],
                'query': 'user_token='+ this.cookieService.get('user_token')
            }
        );
    }

    private responseMessage = new BehaviorSubject(String(''));
    public responseMessageObservable = this.responseMessage.asObservable();

    sendSnackBar(message: string): void {
        let actionButtonLabel: string = 'Retry';
        let action: boolean = false;
        let autoHide: number = 10000;
 
        let config = new MdSnackBarConfig();
        config.duration = autoHide;
        this.snackBar.open(message, actionButtonLabel, config);
    }

    public getRoomUpdates(): void {
        this.socket.on('room update', function(rooms) {
            this.responseMessage.next(rooms);
        });
    }

    public createUser(user: User): void {
        this.socket.emit('create user', user);
    }

    public send(group: Message): void {
        this.socket.emit('join', group);
        //this.sendSnackBar('Sent request to join ' + group.room);
    }

    public leave(group: Message): void {
        this.socket.emit('leave', group);
    }

    public get() {
        let observable = new Observable(observer => {
            this.socket.on('join', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

}
