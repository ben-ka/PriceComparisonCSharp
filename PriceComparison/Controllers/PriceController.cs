using Microsoft.AspNetCore.Mvc;
using PriceComparison.Code;
using System;
using System.Collections.Generic;

namespace PriceComparison.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricesController : ControllerBase
    {
        private readonly Prices _priceCalculator;

        public PricesController()
        {
            _priceCalculator = new Prices();
        }

        [HttpPost("calculate")]
        public IActionResult CalculatePrices([FromBody] PriceRequestModel request)
        {
            try
            {
                var prices = new List<decimal>();
                var location = (Locations)Enum.Parse(typeof(Locations), request.Destination);

                foreach (var passenger in request.Passengers)
                {
                    var covers = new List<InsuranceCovers>();
                    foreach (var cover in passenger.Covers)
                    {
                        covers.Add((InsuranceCovers)Enum.Parse(typeof(InsuranceCovers), cover));
                    }

                    var personModel = _priceCalculator.CreateModel(covers, location, passenger.Age);
                    decimal totalPrice = 0;

                    foreach (var cover in covers)
                    {
                        totalPrice += _priceCalculator.CalculatePrice(personModel, cover, Companies.Harel); // Replace with actual company
                    }

                    prices.Add(totalPrice * request.NumberInput); // Assuming price is per day
                }

                return Ok(prices);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class PriceRequestModel
    {
        public int NumberInput { get; set; }
        public string Destination { get; set; }
        public List<PassengerModel> Passengers { get; set; }
    }

    public class PassengerModel
    {
        public int Age { get; set; }
        public List<string> Covers { get; set; }
    }
}
