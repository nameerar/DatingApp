using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppNew.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAppNew.Data
{
    public class AuthRespository : IAuthRepositorycs
    {
        private readonly DataContext _dataContext;
        public AuthRespository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;

        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for(int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) return false;
                }
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwrodHash, passwordSalt;
            CreatePasswordHash(password,out passwrodHash,out passwordSalt);
            user.PasswordHash = passwrodHash;
            user.PasswordSalt = passwordSalt;
            await _dataContext.Users.AddAsync(user);
            await _dataContext.SaveChangesAsync();
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));


            }
            
        }

        public async Task<bool> UserExits(string username)
        {
            if (await _dataContext.Users.AnyAsync(x => x.Username == username))
                return true;

            return false;
        }
    }
}
