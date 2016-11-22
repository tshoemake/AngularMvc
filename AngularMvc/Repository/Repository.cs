using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data.SqlClient;
using System.Configuration;
using Database.DTO;

namespace AngularMvc.Repository
{
    public class Repository
    {
        public SqlConnection con;
        //To Handle connection related activities      
        private void connection()
        {
            string constr = ConfigurationManager.ConnectionStrings["DapperDataEntities"].ToString();
            con = new SqlConnection(constr);
        }

        //To view employee details with generic list       
        public List<DTOPersonList> GetAllPersons()
        {
            try
            {
                connection();
                con.Open();
                string sqlString = "SELECT [id], [firstname], [lastname] FROM [persons]";
                IList<DTOPersonList> personList = SqlMapper.Query<DTOPersonList>(
                                      con, sqlString).ToList();
                con.Close();
                return personList.ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}