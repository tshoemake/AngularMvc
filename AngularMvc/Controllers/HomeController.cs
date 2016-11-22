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
        TutorialDataEntities dapper_Db = new TutorialDataEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult GetPersons()
        {
            //EF Version
            //var result = db.persons.ToList();
            //return Json(result, JsonRequestBehavior.AllowGet);

            Repository.Repository PersonRepository = new Repository.Repository();
            var result = PersonRepository.GetAllPersons();

            return Json(result, JsonRequestBehavior.AllowGet);

        }
    }
}