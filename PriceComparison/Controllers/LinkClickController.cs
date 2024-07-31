using Microsoft.AspNetCore.Mvc;
using PriceComparison.Code;
using CsvHelper;

namespace PriceComparison.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class LinkClickController : ControllerBase
    {
        private readonly string _filePath = "Csv/link_clicks.csv";

        private readonly WriteLinkClickToCsv _csvWriter;

        public LinkClickController()
        {
            _csvWriter = new WriteLinkClickToCsv();
        }

        [HttpPost("AddRecord")]
        public IActionResult LogClick([FromBody] LinkPressModel data)
        {
            if (data == null || string.IsNullOrEmpty(data.Company))
            {
                return BadRequest("Invalid data.");
            }

            // Ensure the Date property is set
            data.Date = DateTime.Now;

            try
            {
                _csvWriter.WriteLinkClicksToCsv(data, _filePath);
                return Ok();
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }




        }
    }
}
