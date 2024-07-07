namespace PriceComparison.Code
{
    public class RequestModel
    {
        public int daysAbroad { get; set; }

        public Locations location { get; set; }

        public List<PersonModel> passengers { get; set; }
    }
}
