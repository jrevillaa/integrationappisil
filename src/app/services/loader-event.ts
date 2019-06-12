import { Observable } from 'rxjs/Observable';
import { Broadcaster } from './broadcaster';
import { Injectable } from '@angular/core';

@Injectable()
export class LoaderEvent {
  constructor(private broadcaster: Broadcaster) {}

  fire(value: Boolean): void {
    this.broadcaster.broadcast(LoaderEvent, value);
  }

  on(): Observable<boolean> {
    return this.broadcaster.on<boolean>(LoaderEvent);
  }
}