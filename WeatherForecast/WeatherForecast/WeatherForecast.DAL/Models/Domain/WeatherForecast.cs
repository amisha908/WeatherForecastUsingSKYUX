using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherForecast.DAL.Models.Domain
{
    public class WeatherForecast
    {
        public DateTime Date { get; set; }
        public double TemperatureHigh { get; set; }
        public double TemperatureLow { get; set; }
        public double ApparentTemperatureHigh { get; set; }
        public double ApparentTemperatureLow { get; set; }
        public double Humidity { get; set; }
        public double PrecipitationProbability { get; set; }
        public double Precipitation { get; set; }
    }

}
