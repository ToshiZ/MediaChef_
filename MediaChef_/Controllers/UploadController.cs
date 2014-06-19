using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MediaChef_.Models;

namespace MediaChef_.Controllers
{
    //контроллер загрузки файлов пользователя на сервер
    public class UploadController : Controller
    {
        [HttpPost]
        public virtual ActionResult UploadFile()
        {
            //получает коллекцию файлов, загружаемых пользователем в формате MIME
            var myFile = Request.Files["MyFile"];
            //переменные взаимодействия с плагином Blueimp File Upload
            var isUploaded = false;
            var message = "File upload failed";
            //проверка получен ли файл
            if (myFile != null && myFile.ContentLength != 0)
            {
                //путь в файловой системе сервера для сохранения файла
                var pathForSaving = Server.MapPath("~/MediaFiles/" + myFile.ContentType.Split('/')[1] + @"/" + User.Identity.Name + @"/" + myFile.FileName.Split('.')[0] + "(" + myFile.GetHashCode() + ")");
                //создание каталога
                if (CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        //сохранение файла на сервер по указанному пути
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
            //создает контекст модели MediaFile
            var db = new MediaFileContext();
            //добавление новой записи в модель сущности MediaFile
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
            //сохранение записи в базу данных
            db.SaveChanges();
            //сообщение в формате Json для взаимодействия с плагином Blueimp
            return Json(new { isUploaded = isUploaded, message = message }, "text/html");
        }
        /* Функция:                                                   */
        /*      CreateFolderIfNeeded                                  */
        /*                                                            */
        /* Описание:                                                  */
        /*Создает каталог в файловой системе сервера                  */
        /*                                                            */
        /* Параметры:                                                 */
        /*      path                                                  */
        /* Строка, содержащая путь к каталогу от корневого каталога   */
        /* приложения                                                 */
        /*                                                            */
        /* Возвращаемое значение:                                     */
        /*       Bool-значение true/false, в зависимости от того,     */
        /* создан ли каталог                                          */
        /*------------------------------------------------------------*/

        private static bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            //если такого каталога еще не существует
            if (!Directory.Exists(path))
            {
                try
                {
                    //создает каталог по указанному пути 
                    Directory.CreateDirectory(path);
                }
                catch (Exception)
                {                    
                    result = false;
                }
            }
            return result;
        }
    }
}
