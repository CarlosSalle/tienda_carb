namespace TiendaCarbAPI.Model
{
    public class ProductModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Engine_Id { get; set; }
        public int Color_Id { get; set; }
        public int Type_Id { get; set; }
        public float Price { get; set; }
        public int Stock { get; set; }
        public string Image { get; set; }
    }
}
