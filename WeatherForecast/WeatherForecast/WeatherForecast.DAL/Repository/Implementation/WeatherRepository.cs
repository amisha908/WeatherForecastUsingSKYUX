using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using WeatherForecast.DAL.Models.Dto;
using WeatherForecast.DAL.Repository.Interface;

namespace WeatherForecast.DAL.Repository.Implementation
{
    public class WeatherRepository : IWeatherRepository
    {
        private readonly HttpClient _httpClient;

        public WeatherRepository(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        
        public async Task<Object> GetWeatherForecastByCoordinatesAsync(decimal latitude, decimal longitude, string continent, string city)
        {
           
            var url = $"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max";
            if (continent != null && continent != "" && city != null && city != "")
            {
                url += $"&timezone={continent}%2F{city}";
            }
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error fetching weather data: {response.StatusCode}, Content: {errorContent}");
            }

            var content = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new Exception("Received an empty response from the API.");
            }

           
            var weatherData = JsonConvert.DeserializeObject(content);
            string formattedData=JsonConvert.SerializeObject(weatherData, Formatting.Indented);
            return formattedData;
        }

        public async Task<Object> GetWeatherForecastByCoordinatesAsyncHourly(decimal latitude, decimal longitude, string continent, string city)
        {
            var url = $"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,visibility,wind_speed_10m";
            if(continent!=null && continent!="" && city!=null && city!="")
            {
                url += $"&timezone={continent}%2F{city}";
            } 
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error fetching weather data: {response.StatusCode}, Content: {errorContent}");
            }

            var content = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new Exception("Received an empty response from the API.");
            }


            var weatherData = JsonConvert.DeserializeObject(content);
            string formattedData = JsonConvert.SerializeObject(weatherData, Formatting.Indented);
            return formattedData;
        }


    }
}

