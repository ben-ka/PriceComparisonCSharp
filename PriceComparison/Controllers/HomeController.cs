using Microsoft.AspNetCore.Mvc;

namespace PriceComparison.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

      
    }
}
