import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../service/weather.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Coordinates } from '../models/coordinate.model';
import { Location } from '../models/location.model';
import { SkyWaitService } from '@skyux/indicators';
import { finalize } from 'rxjs';
import { SkyToastService, SkyToastType } from '@skyux/toast';

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css']
})
export class WeatherWidgetComponent implements OnInit {
  latitude: number | null = 0;
  longitude: number | null = 0;
  dailyWeatherData: any;
  weeklyForecast: any[] = [];
  hourlyForecast: any[][] = [];
  expandedDayIndex: number | null = null;
  selectedDayIndex: number = 0;
  continent: string = "";
  city: string = "";
  location: string = "";
  suggestions: any[] = [];
  latitudeError: boolean = false;
  longitudeError: boolean = false;

  locationForm: Location = {
    location: ""
  }

  coordinateForm: Coordinates = {
    latitude: 0,
    longitude: 0
  }

  constructor(private weatherService: WeatherService, private skyUxWaitService: SkyWaitService, private skyToast: SkyToastService) {

  }

  ngOnInit() {
    this.getCurrentLocation();
    this.getCurrentTimeZone();
    // this.getCoordinates();
  }
  onSubmitLocation() {
    if (this.locationForm.location === null || this.locationForm.location === "") {
      this.skyToast.openMessage('Location must have a valid input')
    }
    else {

      console.log('Submitting product:', this.locationForm.location);
      console.log(this.locationForm.location)
      this.getCoordinates();
      this.suggestions = [];

    }
  }


  getCoordinates() {
    const placeName = this.locationForm.location;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const location = data[0];
          const lat = location.lat;
          const long = location.lon;
          console.log(lat);
          console.log(long);
          this.latitude = lat;
          this.longitude = long;
          this.suggestions = data;
          this.fetchWeatherData();
        } else {
        }
      })
      .catch(error => {
        this.skyToast.openMessage('Something went wrong')
        // console.error('Error:', error);
      });
  }


  onLocationInput(event: any) {

    const query = event.target.value;
    if (query.length >= 1) {
      this.weatherService.searchLocation(query).pipe(finalize(() => this.skyUxWaitService.endBlockingPageWait())).subscribe({
        next: (data) => {
          this.suggestions = data;
        },
        error: () => {
          this.skyUxWaitService.endBlockingPageWait()
          this.skyToast.openMessage('Error in loading')
          this.suggestions = [];
          console.error('Error fetching location data');
        }
      })
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: any) {
    this.locationForm.location = suggestion.display_name;
    this.suggestions = [];
  }
  reloadPage() {
    window.location.reload();
  }

  validateLatitude() {
    const latitude = this.coordinateForm.latitude;
    if (latitude === null) {
      this.latitudeError = true;
      this.skyToast.openMessage('Latitude must have a valid value')
    }
    if (latitude < -90 || latitude > 90) {
      this.latitudeError = true;
      this.skyToast.openMessage('Latitude value must be in range -90 to 90')
    } else {
      this.latitudeError = false;
      this.skyToast.closeAll()
    }
  }
  validateLongitude() {
    const longitude = this.coordinateForm.longitude;
    if (longitude === null) {
      this.longitudeError = true;
      this.skyToast.openMessage('Longitude must have a valid value')
    }
    if (longitude < -180 || longitude > 180) {
      this.longitudeError = true;
      this.skyToast.openMessage('Longitude value must be in range -180 to 180')
    }
    else {
      this.longitudeError = false;
      this.skyToast.closeAll()
    }
  }
  onSubmit() {
    if (this.latitudeError || this.longitudeError) {
      console.log('Form is invalid due to latitude or longitude errors.');
      this.skyToast.openMessage('Invalid Latitude or longitude value')
      return;
    }
    else {
      console.log('Submitting coordinates:', this.coordinateForm);
      this.latitude = this.coordinateForm.latitude
      this.longitude = this.coordinateForm.longitude
      this.fetchWeatherData();
    }
  }

  selectDay(index: number) {
    this.selectedDayIndex = index;
    this.expandedDayIndex = index;
  }

  getWeatherIcon(weatherCode: number): string {
    const weatherIconsMap: { [key: number]: string } = {
      0: 'wi-day-sunny',         // Clear sky
      1: 'wi-cloudy',            // Cloudy
      2: 'wi-rain',              // Rain
      3: 'wi-snow',              // Snow
      4: 'wi-thunderstorm',       // Thunderstorm
      5: 'wi-fog',               // Fog
      6: 'wi-windy',             // Windy
      7: 'wi-day-sunny-overcast', // Partly cloudy
      8: 'wi-night-clear',        // Clear night
      9: 'wi-night-alt-cloudy',   // Cloudy night
      10: 'wi-night-alt-rain',    // Rainy night
      11: 'wi-night-alt-snow',    // Snowy night
      12: 'wi-sleet',             // Sleet
      13: 'wi-hail',              // Hail
      14: 'wi-tornado',           // Tornado
      15: 'wi-hurricane',         // Hurricane
      16: 'wi-dust',              // Dust
      17: 'wi-smoke',             // Smoke
      18: 'wi-sandstorm',         // Sandstorm
      19: 'wi-raindrops',         // Light rain
      20: 'wi-day-fog',           // Mist
      21: 'wi-night-alt-thunderstorm', // Thunderstorm at night
      45: 'wi-fog',              // Fog
      80: 'wi-showers',          // Showers
      95: 'wi-storm-showers',    // Thunderstorm with rain
      96: 'wi-thunderstorm',     // Thunderstorm with hail
    };
    return weatherIconsMap[weatherCode] || 'wi-day-sunny';
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.coordinateForm.latitude = this.latitude;
          this.coordinateForm.longitude = this.longitude;

          this.fetchWeatherData();
        },
        (error) => {
          console.error('Error obtaining location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getCurrentTimeZone() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [continent, city] = timezone.split('/');
    console.log("Continent:", continent);
    console.log("City:", city);
    console.log(timezone);
    this.continent = continent;
    this.city = city;
  }

  fetchWeatherData() {
    this.skyUxWaitService.beginBlockingPageWait()
    if (this.latitude !== null && this.longitude !== null) {
      console.log(this.latitude)
      console.log(this.longitude)
      this.coordinateForm.latitude = this.latitude;
      this.coordinateForm.longitude = this.longitude;
      this.weatherService.getDailyWeather(this.latitude, this.longitude, this.continent, this.city).pipe(finalize(() => this.skyUxWaitService.endBlockingPageWait())).subscribe({
        next: (data) => {
          this.dailyWeatherData = data;
          this.processDailyWeatherData();
          this.fetchHourlyWeatherData();
        },
        error: () => {
          this.skyUxWaitService.endBlockingPageWait()
          console.error('Error fetching daily weather data');
        }
      });
    }
  }

  fetchHourlyWeatherData() {
    if (this.latitude !== null && this.longitude !== null) {
      this.weatherService.getHourlyWeather(this.latitude, this.longitude, this.continent, this.city).subscribe(
        (data) => {
          this.processHourlyWeatherData(data);
        },
        (error) => {
          console.error('Error fetching hourly weather data', error);
        }
      );
    }
  }

  processDailyWeatherData() {
    if (this.dailyWeatherData && this.dailyWeatherData.daily) {
      console.log(this.dailyWeatherData);
      this.weeklyForecast = this.dailyWeatherData.daily.time.map((date: string, index: number) => {
        const dateObject = new Date(date);
        const isToday = new Date().toDateString() === dateObject.toDateString();
        const dayLabel = isToday ? 'Today' : dateObject.toLocaleDateString('en-US', { weekday: 'long' });
        return {
          day: dayLabel,
          tempMax: this.dailyWeatherData.daily.temperature_2m_max[index],
          tempMin: this.dailyWeatherData.daily.temperature_2m_min[index],
          apparentTempMax: this.dailyWeatherData.daily.apparent_temperature_max[index],
          apparentTempMin: this.dailyWeatherData.daily.apparent_temperature_min[index],
          precipitationHours: this.dailyWeatherData.daily.precipitation_hours[index],
          precipitationProbabilityMax: this.dailyWeatherData.daily.precipitation_probability_max[index],
          precipitationSum: this.dailyWeatherData.daily.precipitation_sum[index],
          sunrise: this.dailyWeatherData.daily.sunrise[index],
          sunset: this.dailyWeatherData.daily.sunset[index],
          weatherCode: this.dailyWeatherData.daily.weather_code[index]
        };
      });
      this.selectDay(this.selectedDayIndex);
    }
  }

  processHourlyWeatherData(hourlyData: any) {
    if (hourlyData && hourlyData.hourly) {
      console.log(hourlyData);
      const hoursPerDay = 24;
      this.hourlyForecast = this.weeklyForecast.map((_, dayIndex) => {
        const start = dayIndex * hoursPerDay;
        const end = start + hoursPerDay;
        const dailyHumidity = hourlyData.hourly.relative_humidity_2m.slice(start, end);
        const averageHumidity = dailyHumidity.reduce((sum: number, humidity: number) => sum + humidity, 0) / dailyHumidity.length;
        this.weeklyForecast[dayIndex].averageHumidity = averageHumidity.toFixed(2); // Round to 2 decimal places
        return hourlyData.hourly.time.slice(start, end).map((time: string, index: number) => ({
          hour: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temp: `${hourlyData.hourly.temperature_2m[start + index]}°C`,
          weatherCode: hourlyData.hourly.weather_code[start + index],
          humidity: `${hourlyData.hourly.relative_humidity_2m[start + index]}%` // Show humidity per hour if needed
        }));
      });
    }
  }

  toggleDayDetails(index: number) {
    this.expandedDayIndex = this.expandedDayIndex === index ? null : index;
  }
}