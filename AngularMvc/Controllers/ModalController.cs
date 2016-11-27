using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Database;
using Database.DTO;

namespace AngularMvc.Controllers
{
    public class ModalController : Controller
    {
        public ActionResult AddEditPersonModal()
        {
            return View();
        }

        public ActionResult RemovePersonModal()
        {
            return View();
        }
    }
}