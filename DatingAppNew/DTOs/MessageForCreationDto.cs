using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppNew.DTOs
{
    public class MessageForCreationDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime MessageSend { get; set; }
        public string Content { get; set; }

        public MessageForCreationDto()
        {
            MessageSend = DateTime.Now;
        }
    }
}
