import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  form: any = {
    keyword: '',
    countryCode: '',
    postalCode: null
  }
  
  search() {
    console.log(this.form)
  }

}
