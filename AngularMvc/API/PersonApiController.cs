using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Database;
using Database.DTO;

namespace AngularMvc.API
{
    public class PersonApiController : ApiController
    {
        TutorialDataEntities ef_Db = new TutorialDataEntities();
        Repository.Repository PersonRepository = new Repository.Repository();

        [Route("api/PersonApi")]
        [HttpPost]
        public HttpResponseMessage UpsertPerson(DTOPerson person)
        {
            if (ModelState.IsValid)
            {
                var result = PersonRepository.UpsertPerson(person);
                return Request.CreateResponse(HttpStatusCode.Created, result);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [Route("api/PersonApi/{id}")]
        [HttpDelete]
        public HttpResponseMessage RemovePerson([FromUri]int id)
        {
            PersonRepository.RemovePerson(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("api/PersonApi")]
        [HttpGet]
        public HttpResponseMessage GetPersons()
        {
            var result = PersonRepository.GetAllPersons();

            if (result == null)
                return Request.CreateResponse(HttpStatusCode.NotFound);

            return Request.CreateResponse(HttpStatusCode.OK, result);

        }
    }

}

