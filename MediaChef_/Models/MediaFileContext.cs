﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MediaChef_.Models
{   //контекст MediaFile
    public class MediaFileContext : DbContext
    {
        public DbSet<MediaFileModel> MediaFiles { get; set; }
    }
}