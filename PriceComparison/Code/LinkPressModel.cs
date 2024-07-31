namespace PriceComparison.Code
{
    public class LinkPressModel
    {
        public string Company { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        public string Location { get; set; } = string.Empty;

        public int PassengerNum { get; set; }

        public int AmountOfDays { get; set; }

        public decimal Price { get; set; }

        

        
    }
}
