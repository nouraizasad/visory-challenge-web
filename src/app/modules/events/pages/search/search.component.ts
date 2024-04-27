import { JsonPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService } from '../../../shared/services/events.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';

interface ICountryCode {
  code: string,
  name: string,
}

interface IGetQueryParams {
  keyword?: string,
  countryCode?: string,
  postalCode?: string,
  startDateTime?: string,
  endDateTime?: string,
  page: string,
  size: string,
}

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

  isDirty: boolean = false; // Track if the first search has been made

  form: Partial<IGetQueryParams> = {
    keyword: '',
    countryCode: '',
    postalCode: '',
    startDateTime: '',
    endDateTime: '',
  }

  isFormDirty: boolean = false;

  page: number = 0;

  /**
   * Set page size here.
   */
  pageSize: number = 12;

  /**
   * Added only a few countries to keep it simple. Can eventually be asyncronously loaded for complete list
   */
  countryCodes: ICountryCode[] = [
    {
      code: 'AU',
      name: 'Australia',
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

  pageLinks: any;
  
  constructor(private eventsService: EventsService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formRef.valueChanges!.subscribe(() => { this.isFormDirty = true; })
    }, 0);
  }
  
  async search(href?: string) {
    try {
      this.isLoading = true;
      this.isDirty = true;
      const params = this.getQueryParams(href);

      if (parseInt(params.page as string) * parseInt(params.size as string) >= 1000) { return alert('This will exceed dev API limits: Max paging depth (page * size) must be less than 1,000'); }
      
      this.page = parseInt(params.page);

      const res = await this.eventsService.getEvents(params);
      this.events = res.data._embedded?.events || [];
      this.pageLinks = res.data._links;
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Formats and returns query params object
   * @param href - (optional) pagination url returned by ticketmaster api
   * @returns queryParams object
   */
  getQueryParams(href?: string): IGetQueryParams {
    let params: any = {};
    if (href) { // use ticketmaster's url to build next query's params
      const paramsString = href.split('?')[1].split('&');
      paramsString.forEach(str => {
        const entry = str.split('=');
        params[entry[0] as keyof IGetQueryParams] = entry[1];
      })
    } else { // build query params using the form
      this.page = 0;
      params = {
        ...this.form,
        startDateTime: this.form.startDateTime && this.removeMilliseconds(new Date(this.form.startDateTime).toISOString()) || '',
        endDateTime: this.form.endDateTime && this.removeMilliseconds(new Date(this.form.endDateTime).toISOString()) || '',
        postalCode: this.form.postalCode || '',
        page: this.page.toString(), 
        size: this.pageSize.toString(),
      }
    }
    return params as IGetQueryParams;
  }

  resetFilters() {
    this.page = 0;
    Object.keys(this.form).forEach((key: string) => this.form[key as keyof IGetQueryParams] = '');
    this.search();
  }

  /**
   * Remove milliseconds from a date's ISO string format
   * @param date - ISO string
   * @returns ISO string without milliseconds
   */
  removeMilliseconds(date: string) {
      return date.split('.')[0] + 'Z';
  }
}
