using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherForecast.DAL.Models.Dto
{
    public class WeatherForecastDto
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public double HighTemperature { get; set; }
        public double LowTemperature { get; set; }
        public double HighApparentTemperature { get; set; }
        public double LowApparentTemperature { get; set; }
        public double AverageHumidity { get; set; }
        public double PrecipitationProbability { get; set; }
        public double Precipitation { get; set; }
    }
}
