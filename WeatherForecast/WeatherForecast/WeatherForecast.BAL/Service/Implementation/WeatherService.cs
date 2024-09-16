using System;
using System.Threading.Tasks;
using WeatherForecast.BAL.Service.Interface;
using WeatherForecast.DAL.Models.Dto;
using WeatherForecast.DAL.Repository.Interface;

namespace WeatherForecast.BAL.Service.Implementation
{
    public class WeatherService : IWeatherService
    {
        private readonly IWeatherRepository _weatherRepository;

        public WeatherService(IWeatherRepository weatherRepository)
        {
            _weatherRepository = weatherRepository;
        }

    

        public async Task<Object> GetWeatherForecastByCoordinatesAsync(decimal latitude, decimal longitude, string continent, string city)
        {
            if (latitude < -90 || latitude > 90)
            {
                throw new ArgumentException("Latitude must be between -90 and 90", nameof(latitude));
            }

            if (longitude < -180 || longitude > 180)
            {
                throw new ArgumentException("Longitude must be between -180 and 180", nameof(longitude));
            }

            return await _weatherRepository.GetWeatherForecastByCoordinatesAsync(latitude, longitude, continent, city);
        }

        public async Task<Object> GetWeatherForecastByCoordinatesAsyncHourly(decimal latitude, decimal longitude, string continent, string city)
        {
            if (latitude < -90 || latitude > 90)
            {
                throw new ArgumentException("Latitude must be between -90 and 90", nameof(latitude));
            }

            if (longitude < -180 || longitude > 180)
            {
                throw new ArgumentException("Longitude must be between -180 and 180", nameof(longitude));
            }

            return await _weatherRepository.GetWeatherForecastByCoordinatesAsyncHourly(latitude, longitude, continent, city);
        }


    }
}

