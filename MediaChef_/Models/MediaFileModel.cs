using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.Linq;
using System.Web;

namespace MediaChef_.Models
{      //Модель сущности MediaFile
        public class MediaFileModel
        {
            // ID медиа файла
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int Id { get; set; }
            // название 
            public string Name { get; set; }
            // тип MIME
            public string TypeMime { get; set; }           
            // размер
            public int Size { get; set; }
            // путь
            public string Path { get; set; }
            // дата добавления
            public DateTime DateAdded { get; set; }
            // дата изменения
            public DateTime DateModify { get; set; }
            // имя пользователя
            public string UserName { get; set; }
            // атрибуты
            public string Attributes { get; set; }


        }
    }
