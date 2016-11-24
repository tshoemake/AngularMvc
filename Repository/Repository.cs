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
                string sqlString = "SELECT [id], [firstname], [lastname], [birthdate] FROM [persons]";
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
        

        public DTOPerson UpsertPerson(DTOPerson person)
        {
            connection();
            con.Open();
            var sqlString = (person.Id > 0) ?
                "UPDATE [Tutorial].[dbo].[persons] " +
                "SET firstname = @firstName, " +
                " lastname = @LastName, " +
                " birthdate = @birthDate " +
                "WHERE id = @Id" :
                "INSERT INTO [Tutorial].[dbo].[persons] " +
                "(firstName, lastName, birthDate) " +
                "VALUES(@firstName, @lastName, @birthDate); " +
                "SELECT CAST(SCOPE_IDENTITY() as int)";
            if (person.Id > 0)
            {
                con.Execute(sqlString, person);
            }
            else
            {
                var personId = SqlMapper.Query<int>(con, sqlString, person).Single();
                person.Id = personId;
            }

            return person;
        }
    }
}