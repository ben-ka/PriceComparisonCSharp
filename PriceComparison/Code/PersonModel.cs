namespace PriceComparison.Code
{
    public class PersonModel
    {
        public int Id { get; set; }
        public int Age { get; set; }

        public Locations Location { get; set; }

        public List<InsuranceCovers> Covers { get; set; } = new List<InsuranceCovers>();



    }
}
