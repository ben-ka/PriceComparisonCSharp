using System;
using System.Globalization;
using System.IO;
using CsvHelper;
using System.Collections.Generic;
using System.Linq;

namespace PriceComparison.Code
{
    public class Prices
    {

        private InsuranceCovers InsuranceCoversMapping(string cover)
        {
            Dictionary<string, InsuranceCovers> coversMapping = new Dictionary<string, InsuranceCovers>()
            {
                {"checkbox1", InsuranceCovers.MedicalExpenses},
                {"checkbox2", InsuranceCovers.SearchAndRescue},
                {"checkbox3", InsuranceCovers.TripCancellation},
                {"checkbox4", InsuranceCovers.Baggage},
                {"checkbox5", InsuranceCovers.CellPhone},
                {"checkbox6", InsuranceCovers.LaptopOrTablet},
                {"checkbox7", InsuranceCovers.ExtremeSports},
                {"checkbox8", InsuranceCovers.WinterSports},
            };
            if (coversMapping.ContainsKey(cover))
            {
                return coversMapping[cover];
            }
            else
            {
                return InsuranceCovers.MedicalExpenses;
            }
        }


        private List<PriceRecord> ParseCsv()
        {
            using (var reader = new StreamReader("Csv/TravelCoverCosts.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                csv.Context.RegisterClassMap<PriceRecordMap>(); // Register the class map
                List<PriceRecord> records = csv.GetRecords<PriceRecord>().ToList();
                foreach (var record in records)
                {
                    
                }
                return records;
            }
        }

        public decimal CalculatePrice(PersonModel model, Companies company, Locations location)
        {
            List<PriceRecord> records = ParseCsv();
            decimal price = 0;
            List<InsuranceCovers> insuranceCovers = new List<InsuranceCovers>();
            foreach(string cover in model.Covers)
            {
                insuranceCovers.Add(InsuranceCoversMapping(cover));
            }

            foreach (InsuranceCovers cover in insuranceCovers)
            {
                List<PriceRecord> query = records.Where(r =>
                {
                    bool ageMatch = r.AgeFrom <= model.Age && r.AgeTo >= model.Age;
                    bool coverMatch = r.CoverId == (int)cover;
                    bool destinationMatch = r.DestinationIdFrom <= (int)location && r.DestinationIdTo >= (int)location;
                    bool companyMatch = r.CompanyId == (int)company;

                    

                    return ageMatch && coverMatch && destinationMatch && companyMatch;
                }).ToList();

                if (query.Count > 0)
                {
                    price += query[0].PricePerDay;
                }
                else
                {
                    throw new InvalidOperationException("No matching price record found.");
                }
                
            }
            return price;
            

            


        }
    }
}

