using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using WeatherForecast.BAL.Service.Interface;

namespace WeatherForecast.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;
        private readonly HttpClient _httpClient;

        public WeatherController(IWeatherService weatherService, HttpClient httpClient)
        {
            _weatherService = weatherService;
            _httpClient = httpClient;
        }

        [HttpGet("coordinatesDaily")]
        public async Task<IActionResult> GetWeatherForecastByCoordinates([FromQuery] decimal latitude, [FromQuery] decimal longitude, [FromQuery] string continent, [FromQuery] string city)
        {
            try
            {
                var weatherForecast = await _weatherService.GetWeatherForecastByCoordinatesAsync(latitude, longitude, continent, city);
                return Ok(weatherForecast);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
        [HttpGet("coordinatesHourly")]
        public async Task<IActionResult> GetWeatherForecastByCoordinatesHours([FromQuery] decimal latitude, [FromQuery] decimal longitude, [FromQuery] string continent, [FromQuery] string city)
        {
            try
            {
                var weatherForecast = await _weatherService.GetWeatherForecastByCoordinatesAsyncHourly(latitude, longitude, continent, city);
                return Ok(weatherForecast);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

       


    }
}
