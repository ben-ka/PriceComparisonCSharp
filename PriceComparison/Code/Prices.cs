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
        public PersonModel CreateModel(List<InsuranceCovers> covers, Locations location, int age)
        {
            PersonModel model = new PersonModel {Location = location, Age = age };
            for (int i = 0; i < covers.Count; i++)
            {
                model.Covers[i] = covers[i];
            }
            return model;
        }

        private List<PriceRecord> ParseCsv() 
        {
            using (var reader = new StreamReader("Resources/Csv/TravelAboardInsuranceCompnies.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                List<PriceRecord> records = csv.GetRecords<PriceRecord>().ToList();
                foreach (var record in records)
                {
                    Console.WriteLine($"{record.AgeFrom}, {record.AgeTo}");
                }
                return records;
            }
        }

        public decimal CalculatePrice(PersonModel model, InsuranceCovers cover, Companies company)
        {
            List<PriceRecord> records = ParseCsv();
            List<PriceRecord> query = records.Where(r => r.AgeFrom >=  model.Age && r.AgeTo <= model.Age && (int)r.CoverId == (int)cover && (int)r.DestinationId == (int)model.Location && (int)r.CompanyId ==(int) company).ToList();

            if (query.Count > 0)
            {
                return query[0].PricePerDay;
            }

            throw new InvalidOperationException("No matching price record found.");


        }
    }
}

