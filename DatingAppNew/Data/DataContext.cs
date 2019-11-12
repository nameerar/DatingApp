using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingAppNew.Models;

namespace DatingAppNew.Data
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options){}

        public DbSet<Values> Values { get; set; }
        public DbSet<User> Users { get; set; }


    }
}
