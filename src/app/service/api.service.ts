import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Covid } from '../covid';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base_Url = 'https://disease.sh/v3/covid-19/countries';
  constructor(private http: HttpClient) {}

  getInformation(): Observable<Covid[]> {
    return this.http.get<Covid[]>(this.base_Url);
  }
}
