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

        public ActionResult AddEditPersonModal()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UpdatePerson(int id, DTOPerson person)
        {
            person.Id = id;
            PersonRepository.UpdatePerson(person);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public JsonResult GetPersons()
        {
            //EF Version
            //var result = db.persons.ToList();
            //return Json(result, JsonRequestBehavior.AllowGet);

            var result = PersonRepository.GetAllPersons();

            return Json(result, JsonRequestBehavior.AllowGet);

        }
    }
}