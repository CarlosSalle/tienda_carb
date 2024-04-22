namespace TiendaCarbAPI.Model
{
    public class OrderDTO
    {
        public int id_user { get; set; }
        public DateTime order_date { get; set; }
        public int order_quantity { get; set; }
        public float order_amount { get; set; }
        public List<CartProductDTO>? order_product_list { get; set; }

        
    }
}
