namespace PriceComparison.Code
{
    public class PriceRecord
    {
        public int CompanyId {  get; set; }
        public int CoverId { get; set; }

        public int AgeFrom { get; set; }

        public int AgeTo { get; set; }

        public int DestinationIdFrom { get; set; }

        public int DestinationIdTo { get; set; }


        public decimal PricePerDay { get; set; }

        public decimal? MaxPrice { get; set; }

        public decimal? OverThirteeDaysPrice { get; set;}

        public decimal? UnderFourteenDaysPrice { get; set;}

    }
}
