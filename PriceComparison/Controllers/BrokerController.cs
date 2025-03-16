using Microsoft.AspNetCore.Mvc;
using PriceComparison.Code;

namespace PriceComparison.Controllers
{
    public class BrokerController : Controller
    {
        private readonly BrokerService brokerService;

        public BrokerController()
        {
           brokerService = new BrokerService();
        }

        [Route("{brokerId}")]
        public IActionResult Index(string brokerId)
        {
            var broker = brokerService.GetBroker(brokerId);
            if (broker == null)
            {
                return NotFound("Broker not found.");
            }

            return View("BrokerPage", broker);
        }
    }
}
