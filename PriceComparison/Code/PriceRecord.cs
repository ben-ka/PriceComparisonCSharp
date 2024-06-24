namespace PriceComparison.Code
{
    public class PriceRecord
    {
        public int Id {  get; set; }

        public int CompanyId {  get; set; }
        public int CoverId { get; set; }

        public int AgeFrom { get; set; }

        public int AgeTo { get; set; }

        public int DestinationId { get; set; }

        public decimal PricePerDay { get; set; }

    }
}
