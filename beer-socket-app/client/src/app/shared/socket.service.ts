import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Message} from './message.model';
import {User} from './user.model';

import * as socketIo from 'socket.io-client';

let SERVER_URL = 'http://10.93.166.24:5000';



@Injectable()
export class SocketService {
    private socket;

    constructor() {
        this.initSocket();
    }

    private initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public createUser(user: User): void {
        this.socket.emit('create user', user);
    }

    public send(group: Message): void {
        this.socket.emit('join', group);
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
