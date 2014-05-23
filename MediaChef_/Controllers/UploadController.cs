using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MediaChef_.Models;

namespace MediaChef_.Controllers
{
    public class UploadController : Controller
    {
        //
        // GET: /Upload/

        [HttpPost]
        public virtual ActionResult UploadFile()
        {
            var myFile = Request.Files["MyFile"];

            var isUploaded = false;
            var message = "File upload failed";

            if (myFile != null && myFile.ContentLength != 0)
            {
                var pathForSaving = Server.MapPath("~/MediaFiles/" + myFile.ContentType.Split('/')[1] + @"/" + User.Identity.Name + @"/" + myFile.FileName.Split('.')[0] + "(" + myFile.GetHashCode() + ")");
                if (CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        myFile.SaveAs(Path.Combine(pathForSaving, myFile.FileName));
                        isUploaded = true;
                        message = "File uploaded successfully!";
                    }
                    catch (Exception ex)
                    {
                        message = string.Format("File upload failed: {0}", ex.Message);
                    }
                }
            }

            var db = new MediaFileContext();
            db.MediaFiles.Add(new MediaFileModel
            {

                Name = myFile.FileName.Split('.')[0],
                TypeMime = myFile.ContentType,                
                Size = myFile.ContentLength,
                Path = @"MediaFiles\" + myFile.ContentType.Split('/')[1] + @"\" + User.Identity.Name + @"\" + myFile.FileName.Split('.')[0] + "(" + myFile.GetHashCode() + @")/" + myFile.FileName,
                DateAdded = DateTime.Now,
                DateModify = DateTime.Now,
                UserName = User.Identity.Name,
                Attributes = ""
            });
            db.SaveChanges();

            return Json(new { isUploaded = isUploaded, message = message }, "text/html");
        }

        private static bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                }
                catch (Exception)
                {
                    /*TODO: You must process this exception.*/
                    result = false;
                }
            }
            return result;
        }
    }
}
