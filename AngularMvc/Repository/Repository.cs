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
                var personList = con.Query<DTOPerson>("uspGetAllPersons", commandType: CommandType.StoredProcedure).ToList();
                con.Close();
                return personList;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public DTOPerson UpsertPerson(DTOPerson person)
        {
            try {
                connection();
                con.Open();
                var parameters = new DynamicParameters();
                parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);
                parameters.Add("@firstName", person.firstName);
                parameters.Add("@lastName", person.lastName);
                parameters.Add("@birthDate", person.birthDate);

                con.Execute("uspUpsertPerson", parameters, commandType: CommandType.StoredProcedure);

                int insertedId = parameters.Get<int>("@Id");
                if (insertedId > 0)
                {
                    person.Id = insertedId;
                }

                return person;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void RemovePerson(int id)
        {
            try
            {
                connection();
                con.Open();
                var parameters = new DynamicParameters();
                parameters.Add("@Id", id);
                con.Execute("uspRemovePerson", parameters, commandType: CommandType.StoredProcedure);
                con.Close();
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}