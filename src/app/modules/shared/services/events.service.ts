import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  async getEvents(queryParams: any = {}): Promise<any> {
    const res$ = this.http.get('/events', { params: queryParams }).pipe(take(1));
    return await lastValueFrom(res$);
  }


}
