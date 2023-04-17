import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchQuery?: string = '';
  searchResults: Array<any> = [];
  currentPage = 1;
  totalPages = 1;
  loading = false;

  constructor(private http: HttpClient) {
    this.bookSearch = new FormControl('');
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {
        this.searchQuery = value;
        this.searchBooks();
      });
  }
  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    }
 
    searchBooks() {
    this.loading = true; 
    const limit = 10; 
    const offset = (this.currentPage - 1) * limit; 
    
    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(this.searchQuery ?? '')}&limit=${limit}&offset=${offset}`;


    this.http.get(apiUrl).subscribe((response: any) => {
      this.searchResults = response.docs;
      this.totalPages = Math.ceil(response.numFound / limit); 
      this.loading = false; 
    });
  }
    
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.searchBooks();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.searchBooks();
  }
}
}
