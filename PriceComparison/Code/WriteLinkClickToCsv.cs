using CsvHelper;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Globalization;
using System.Text;

namespace PriceComparison.Code
{
    public class WriteLinkClickToCsv
    {
        public void WriteLinkClicksToCsv(LinkPressModel model, string filePath)
        {
            bool fileExists = System.IO.File.Exists(filePath);
            using (var writer = new StreamWriter(filePath, append: true, encoding: Encoding.UTF8))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                // Write the data
                csv.WriteRecord(model);
                csv.NextRecord();
            }
        }
    }
}
