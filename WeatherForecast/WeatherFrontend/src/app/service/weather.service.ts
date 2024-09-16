import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://localhost:7030/api/Weather';
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';  

  constructor(private http: HttpClient) {}

  getDailyWeather(latitude: number, longitude: number, continent:string, city:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/coordinatesDaily`, {
      params: { latitude: latitude.toString(), longitude: longitude.toString(), continent:continent, city:city }
    });
  }

  getHourlyWeather(latitude: number, longitude: number, continent:string, city:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/coordinatesHourly`, {
      params: { latitude: latitude.toString(), longitude: longitude.toString(), continent:continent, city:city }
    });
  }
  searchLocation(query: string): Observable<any> {
    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5'
    };
    return this.http.get<any>(this.nominatimUrl, { params });
  }
}

