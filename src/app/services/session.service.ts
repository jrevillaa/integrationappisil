import { Injectable } from '@angular/core';


@Injectable()
export class SessionService {

  constructor() { }

  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  getItem(key) {
    return localStorage.getItem(key);
  }

  setObject(key, object) {
    const value = JSON.stringify(object);
    localStorage.setItem(key, value);
  }

  getObject(key) {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  }

  destroy(key) {
    localStorage.removeItem(key);
  }

}
