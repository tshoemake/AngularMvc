using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
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
        public List<DTOPerson> GetAllPersons()
        {
            try
            {
                connection();
                con.Open();
                string sqlString = "SELECT [id], [firstname], [lastname] FROM [persons]";
                IList<DTOPerson> personList = SqlMapper.Query<DTOPerson>(
                                      con, sqlString).ToList();
                con.Close();
                return personList.ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public bool UpdatePerson(DTOPerson person)
        {
            connection();
            con.Open();
            var sqlString =
            "UPDATE [Tutorial].[dbo].[persons] " +
            "SET firstname = @firstName, " +
            " lastname = @LastName " +
            "WHERE id = @Id";
            con.Execute(sqlString, new
            {
                person.Id,
                person.firstName,
                person.lastName
            });
            //con.Close();
            return true;
        }
    }
}