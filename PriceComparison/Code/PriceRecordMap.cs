
using CsvHelper.Configuration;
namespace PriceComparison.Code
{
    

    public class PriceRecordMap : ClassMap<PriceRecord>
    {
        public PriceRecordMap()
        {
            Map(m => m.CompanyId).Name("CompanyID");
            Map(m => m.CoverId).Name("CoverID");
            Map(m => m.AgeFrom).Name("Age_from");
            Map(m => m.AgeTo).Name("Age_to");
            Map(m => m.DestinationIdFrom).Name("DestinationIDFrom");
            Map(m => m.DestinationIdTo).Name("DestinationIDTo");
            Map(m => m.PricePerDay).Name("PricePerDay");
            Map(m => m.MaxPrice).Name("MaxPrice");
            Map(m => m.OverThirteeDaysPrice).Name("מעל 30 יום");
            Map(m => m.UnderFourteenDaysPrice).Name("עד 14 ימים");
        }
    }
}
