namespace TiendaCarbAPI.Model
{
    public class OrderModel

    {
      public int id { get; set; }
    public int id_user { get; set; }
    public DateTime order_date { get; set; }
    public int order_quantity { get; set; }
    public float order_amount { get; set; }

}
}
