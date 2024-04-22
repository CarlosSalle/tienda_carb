using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TiendaCarbAPI.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TiendaCarbAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiendaCarbController : ControllerBase
    {
        private IConfiguration _configuration;
        private string _sqlDatasource;
        public TiendaCarbController(IConfiguration configuration)
        { 
            _configuration = configuration;
            _sqlDatasource = _configuration.GetConnectionString("TiendaCARB_DBCon");
        }
        // READ DATA
        [HttpGet]
        [Route("GetAllUsers")]
        public JsonResult GetAllUsers() {
            string query = "SELECT * FROM [dbo].[TBL_INV_USER] ";
            DataTable sqlTableResult = new DataTable();
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand= new SqlCommand(query,myConn))
                {
                    myReader=myCommand.ExecuteReader();
                    sqlTableResult.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
        return new JsonResult(sqlTableResult);
        }

        [HttpGet]
        [Route("GetAllProducts")]
        public JsonResult GetAllProducts()
        {
            string query = "SELECT prod.id, product_code, prod.product_name,  prod.product_description, " +
                "(SELECT category_value FROM [dbo].[TBL_INV_CATEGORY] WHERE id = prod.product_engine_id) as product_engine, " +
                "(SELECT category_value FROM [dbo].[TBL_INV_CATEGORY] WHERE id = prod.product_type_id) as product_type ," +
                "(SELECT category_value FROM [dbo].[TBL_INV_CATEGORY] WHERE id = prod.product_color_id) as product_color ," +
                "prod.product_price, prod.product_stock, prod.product_image FROM [dev_tienda_carb].[dbo].[TBL_INV_PRODUCT] prod ";
            DataTable sqlTableResult = new DataTable();
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myReader = myCommand.ExecuteReader();
                    sqlTableResult.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(sqlTableResult);
        }

        

        [HttpGet]
        [Route("GetAllOrderReports")]
        public JsonResult GetAllOrderReports()
        {
            string query = "SELECT (SELECT CONCAT(u.[user_name], ' ', u.[user_last_name]) FROM [dbo].[TBL_INV_USER] u WHERE u.id = o.id_user) AS full_user_name, " +
            "CONVERT(date, o.order_date) AS order_date, o.order_quantity AS order_quantity, o.order_amount AS order_amount, " +
            "(SELECT STRING_AGG(CONCAT(p.product_code, ''), '<br />') FROM [dbo].[TBL_RLT_ORDER_PRODUCT] rop INNER JOIN[dbo].[TBL_INV_PRODUCT] p ON rop.id_product = p.id  WHERE rop.id_order = o.id) AS product_codes," +
            "(SELECT STRING_AGG(CONCAT(rop.product_quantity, ''), '<br />') FROM [dbo].[TBL_RLT_ORDER_PRODUCT] rop WHERE rop.id_order = o.id) AS product_quantities, " +
            "(SELECT STRING_AGG(CONCAT(rop.produc_amount, ''), '<br />') FROM [dbo].[TBL_RLT_ORDER_PRODUCT] rop WHERE rop.id_order = o.id) AS product_amounts FROM [dbo].[TBL_INV_ORDER] o ORDER BY o.id";
            DataTable sqlTableResult = new DataTable();
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myReader = myCommand.ExecuteReader();
                    sqlTableResult.Load(myReader);
                    myReader.Close();
                    myConn.Close();
                }
            }
            return new JsonResult(sqlTableResult);
        }

        [HttpPost]
        [Route("GetUserLoginValidation")]
        public JsonResult GetUserLoginValidation(UserModel attemptUserLoginData)
        {
            string query = "SELECT * FROM [dbo].[TBL_INV_USER] WHERE user_email = @emailAttempt AND user_password = @DataAttempt ";
            DataTable sqlTableResult = new DataTable();
            SqlDataReader myReader;
            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.Add("@emailAttempt", SqlDbType.VarChar).Value = attemptUserLoginData.Email.TrimEnd();
                    myCommand.Parameters.Add("@DataAttempt", SqlDbType.VarChar).Value = attemptUserLoginData.Password.TrimEnd();
                    myReader = myCommand.ExecuteReader();
                    sqlTableResult.Load(myReader);
                }
                myConn.Close();
            }
          return new JsonResult(sqlTableResult);
        }

        


        // CREATE DATA
        [HttpPost]
        [Route("AddUser")]
        public void AddUser(UserModel newUser)
        {
            string query = "INSERT INTO [dbo].[TBL_INV_USER] " +
                "(user_name, user_last_name, user_age, user_email, user_password) VALUES (@name, @lastName, @age, @email, @password)";
            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.Add("@name", SqlDbType.VarChar).Value = newUser.Name.TrimEnd();
                    myCommand.Parameters.Add("@lastName", SqlDbType.VarChar).Value = newUser.LastName.TrimEnd();
                    myCommand.Parameters.Add("@age", SqlDbType.Int).Value = newUser.Age;
                    myCommand.Parameters.Add("@email", SqlDbType.VarChar).Value = newUser.Email.TrimEnd();
                    myCommand.Parameters.Add("@password", SqlDbType.VarChar).Value = newUser.Password;
                    myConn.Open();
                    myCommand.ExecuteNonQuery();
                    myConn.Close();
                }
            }
        }


        [HttpPost]
        [Route("AddOrder")]
        public void AddOrder(OrderDTO newOrder)
        {
            string query_insert_inv_order = "INSERT INTO [dbo].[TBL_INV_ORDER] " +
                "(id_user, order_date, order_quantity, order_amount) VALUES (@id_user, @order_date, @order_quantity, @order_amount); " +
                "SELECT SCOPE_IDENTITY();";

            string query_insert_rlt_order_product = "INSERT INTO [dbo].[TBL_RLT_ORDER_PRODUCT] " +
                "(id_order, id_product, product_quantity, produc_amount) VALUES (@id_order, @id_product, @product_quantity, @produc_amount)";

            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                myConn.Open();
                using (SqlCommand myCommand = new SqlCommand(query_insert_inv_order, myConn))
                {
                    myCommand.Parameters.AddWithValue("@id_user", newOrder.id_user);
                    myCommand.Parameters.AddWithValue("@order_date", newOrder.order_date);
                    myCommand.Parameters.AddWithValue("@order_quantity", newOrder.order_quantity);
                    myCommand.Parameters.AddWithValue("@order_amount", newOrder.order_amount);

                    int max_id_inv_order = Convert.ToInt32(myCommand.ExecuteScalar());

                    foreach (var product in newOrder.order_product_list)
                    {
                        using (SqlCommand productCommand = new SqlCommand(query_insert_rlt_order_product, myConn))
                        {
                            productCommand.Parameters.AddWithValue("@id_order", max_id_inv_order);
                            productCommand.Parameters.AddWithValue("@id_product", product.cart_product_id);
                            productCommand.Parameters.AddWithValue("@product_quantity", product.cart_product_quantity);
                            productCommand.Parameters.AddWithValue("@produc_amount", product.cart_product_amount);

                            productCommand.ExecuteNonQuery();
                        }
                    }
                }
                myConn.Close();
            }
        }






        // DELETE DATA
        [HttpDelete]
        [Route("DeleteUser/{userId}")]
        public void DeleteUser(int userId)
        {
            string query = "DELETE FROM [dbo].[TBL_INV_USER] WHERE id = @UserId";
            using (SqlConnection myConn = new SqlConnection(_sqlDatasource))
            {
                using (SqlCommand myCommand = new SqlCommand(query, myConn))
                {
                    myCommand.Parameters.AddWithValue("@UserId", userId);
                    myConn.Open();
                    myCommand.ExecuteNonQuery();
                    myConn.Close();
                }
            }
        }

    }
}
