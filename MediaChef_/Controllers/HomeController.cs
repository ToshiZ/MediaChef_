using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MediaChef_.Models;

namespace MediaChef_.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var db = new MediaFileContext();
                IEnumerable<MediaFileModel> mediaFile = db.MediaFiles;
                ViewBag.MediaFiles = mediaFile;

            
                if (User.IsInRole("Admin"))
                    return View("IndexAdmin");
                else
                    if(User.IsInRole("User"))
                        return View("IndexUser");
                    else
                        return View();
            }
        public ActionResult Editor()
        {
            var db = new MediaFileContext();
            IEnumerable<MediaFileModel> mediaFile = db.MediaFiles;
            ViewBag.MediaFiles = mediaFile;
            ViewBag.Message = "Страница редактора.";
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}

