using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppNew.Helpers;
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

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
                .FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
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

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users.Include(x=>x.Photos).
                OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.id != userParams.userId);

            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.userId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.id));
            }
            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.userId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
               users =  users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.pageSize);
        }

       private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(x => x.Liker)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync(u => u.id == id);

            if (likers)
            {
                return user.Liker.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Liker.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(u => u.Photos).AsQueryable();

            switch(messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.userId);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.userId);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.userId && u.isRead == false);
                    break;
            }

            messages = messages.OrderByDescending(u => u.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.pageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages.Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(u => u.Photos)
                .Where(m => m.RecipientId == userId && m.SenderId == recipientId || m.RecipientId == recipientId && m.SenderId == userId)
                .OrderByDescending(m => m.MessageSent).ToListAsync();

            return  messages;
        }
    }
}
