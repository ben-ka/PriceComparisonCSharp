namespace PriceComparison.Code
{
    public class RequestModel
    {
        public int DaysAbroad { get; set; }

        public string Destination { get; set; } = string.Empty;

        public List<PersonModel> Passengers { get; set; } = new List<PersonModel>();
    }
}
