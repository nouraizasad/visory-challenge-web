import { JsonPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService } from '../../../shared/services/events.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgFor, NgIf, NgTemplateOutlet, EventCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements AfterViewInit {

  @ViewChild('formRef', { read: NgForm }) formRef: any;

  isLoading: boolean = false;

  isDirty: boolean = false;

  form: any = {
    keyword: '',
    countryCode: '',
    postalCode: '',
    startDateTime: '',
    endDateTime: '',
  }

  isFormDirty: boolean = false;

  page: number = 1;

  pageSize: number = 10;

  /**
   * Added just a few countries to keep it simple. Can eventually be asyncronously loaded for complete list
   */
  countryCodes: any[] = [
    {
      code: 'AU',
      name: 'Australia'      
    },
    {
      code: 'US',
      name: 'United States'      
    },
    {
      code: 'GB',
      name: 'Great Britain'      
    },
    {
      code: 'NZ',
      name: 'New Zealand'      
    },
    {
      code: 'PK',
      name: 'Pakistan'      
    },
    {
      code: 'CA',
      name: 'Canada'      
    },
    {
      code: 'ES',
      name: 'Spain'      
    },
  ]

  events: any[] = [];
  
  constructor(private eventsService: EventsService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formRef.valueChanges!.subscribe(() => {
        this.isFormDirty = true;
        // console.log(this.form)
      })
    }, 0);
  }
  
  async search() {
    try {
      this.isLoading = true;
      this.isDirty = true;
      const queryParams = { 
        ...this.form,
        startDateTime: this.form.startDateTime && this.removeMilliseconds(new Date(this.form.startDateTime).toISOString()) || '',
        endDateTime: this.form.endDateTime && this.removeMilliseconds(new Date(this.form.endDateTime).toISOString()) || '',
        page: this.page, 
        pageSize: this.pageSize 
      }
      const res = await this.eventsService.getEvents(queryParams);
      this.events = res.data._embedded.events;
      console.log(this.events);
    } catch (error) {
      console.log(error);
    } finally { 
      this.isLoading = false;
    }
  }

  resetFilters() {
    Object.keys(this.form).forEach((key) => this.form[key] = '');
    this.search();
  }

  removeMilliseconds(date: string) {
      return date.split('.')[0] + 'Z';
  }
}