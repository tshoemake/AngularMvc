using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Database;
using Database.DTO;
using Dapper;

namespace AngularMvc.Controllers
{
    public class HomeController : Controller
    {
        TutorialDataEntities ef_Db = new TutorialDataEntities();
        Repository.Repository PersonRepository = new Repository.Repository();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult UpsertPerson(DTOPerson person)
        {
            //return Json(new { Id = 0, firstName = "", lastName = "" });
            var result = PersonRepository.UpsertPerson(person);
            formatDate(result.birthDate);
            return Json(result);
        }

        [HttpPost]
        //[HttpDelete]
        public JsonResult RemovePerson(int id)
        {
            //PersonRepository.RemovePerson(id);
            return Json(new { success = true });
        }

        [HttpGet]
        public JsonResult GetPersons()
        {
            //EF Version
            //var result = db.persons.ToList();
            //return Json(result, JsonRequestBehavior.AllowGet);

            var result = PersonRepository.GetAllPersons();
            foreach (var person in result)
            {
                formatDate(person.birthDate);
            }

            return Json(result, JsonRequestBehavior.AllowGet);

        }



        private DateTime formatDate(DateTime date)
        {
            return Convert.ToDateTime(date.ToString("MM/dd/yyyy"));
        }

    }
}