using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppNew.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAppNew.Data
{
    public class DatingRepositorycs : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepositorycs(DataContext context)
        {
            _context = context;
        }


        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetMainPhoto(int id)
        {
            return await _context.Photos.Where(u => u.Userid == id).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
          var photo = await  _context.Photos.FirstOrDefaultAsync(u => u.Id == id);
          return photo;
        }

        public async Task<User> GetUser(int id)
        {
          var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.id == id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(x=>x.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
