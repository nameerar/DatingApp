using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingAppNew.Data;
using DatingAppNew.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DatingAppNew.DTOs;
using DatingAppNew.Models;

namespace DatingAppNew.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        // GET: api/Messages
        [HttpGet]
        public async Task<IActionResult> GetMessageForUser(int userId,[FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.userId = userId;

            var messageFromRepo = await _repo.GetMessagesForUser(messageParams);
            var messages = _mapper.Map<MessageToReturnDto>(messageFromRepo);

            Response.AddPagination(messageFromRepo.CurrentPage, messageFromRepo.PageSize, messageFromRepo.TotalCount, messageFromRepo.TotalPages);
            return Ok(messages);
        }

        // GET: api/Messages/5
        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);

        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userid, int recipientid)
        {
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repo.GetMessageThread(userid, recipientid);

            var messageThread = _mapper.Map<MessageToReturnDto>(message);

            return Ok(messageThread);


        }

        // POST: api/Messages
        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,[FromBody] MessageForCreationDto messageForCreationDto )
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageForCreationDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

            if (recipient == null)
                return BadRequest("Could not find user");

            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            var messageToReturn = _mapper.Map<MessageForCreationDto>(message);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToReturn);

            throw new Exception("Creating the message failed on save");
        }

        // PUT: api/Messages/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
