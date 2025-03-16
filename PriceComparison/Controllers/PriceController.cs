using Microsoft.AspNetCore.Mvc;
using PriceComparison.Code;
using System;
using System.Collections.Generic;

namespace PriceComparison.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class PricesController : ControllerBase
    {
        private readonly Prices _priceCalculator;

        public PricesController()
        {
            _priceCalculator = new Prices();
        }

        private Locations HebrewToLocation(string location)
        {
            Dictionary<string, Locations> locationsMapping = new Dictionary<string, Locations>()
            {
                { "אירופה", Locations.Europe },
                { "ארצות הברית", Locations.USA },
                { "קנדה", Locations.Canada },
                { "אסיה", Locations.Asia },
                { "מרכז אמריקה", Locations.CentralAmerica },
                { "דרום אמריקה", Locations.SouthAmerica },
                { "אוסטרליה", Locations.Australia },
                { "אפריקה", Locations.Africa }
            };

            if (locationsMapping.ContainsKey(location))
            {
                return locationsMapping[location];
            }
            return Locations.None;
        }

        [HttpPost("calculate")]
        public IActionResult CalculatePrices([FromBody] RequestModel request)
        {
            try
            {
                if (request == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }

                Locations destination = HebrewToLocation(request.Destination);
                if (destination == Locations.None)
                {
                    return BadRequest("Invalid destination");
                }

                Dictionary<Companies, decimal> companyPrices = new Dictionary<Companies, decimal>();

                foreach (Companies company in Enum.GetValues(typeof(Companies)))
                {
                    companyPrices[company] = 0;
                }

                foreach (var passenger in request.Passengers)
                {
                    
                    foreach (Companies company in Enum.GetValues(typeof(Companies)))
                    {
                        decimal totalPrice = Math.Round(_priceCalculator.CalculatePrice(passenger, company, destination, request.DaysAbroad), 2);

                        companyPrices[company] += (totalPrice); 
                    }
                }

                return Ok(companyPrices);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
