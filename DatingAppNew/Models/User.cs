using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DatingAppNew.Models
{
    public class User
    {
        public int id { get; set; }
        
        public string Username { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt { get; set; }
    }
}
