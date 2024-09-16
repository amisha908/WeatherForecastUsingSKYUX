using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeatherForecast.DAL.Models.Dto;

namespace WeatherForecast.BAL.Service.Interface
{
    public interface IWeatherService
    {
        Task<Object> GetWeatherForecastByCoordinatesAsyncHourly(decimal latitude, decimal longitude, string continent, string city);

        Task<Object> GetWeatherForecastByCoordinatesAsync(decimal latitude, decimal longitude, string continent, string city);
    }
}
