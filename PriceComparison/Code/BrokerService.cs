namespace PriceComparison.Code
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using CsvHelper;
    public class BrokerService
    {
        private List<Broker> brokers;

        public BrokerService()
        {
            LoadBrokers();
        }
        
        private void LoadBrokers()
        {
            using (var reader = new StreamReader("Csv/brokers.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                brokers = csv.GetRecords<Broker>().ToList();
            }
        }

        public Broker GetBroker(string subdomainName)
        {
            return brokers.FirstOrDefault(b => b.SubdomainName == subdomainName);
        }
    }
}
