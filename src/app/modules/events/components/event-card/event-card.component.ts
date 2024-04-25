import { DatePipe, JsonPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe, JsonPipe, NgIf],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {

  @Input() event: any

  getDate(date: any) {
    return new Date(date.dateTime || date.localDate)
  }

}
