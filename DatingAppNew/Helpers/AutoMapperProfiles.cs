﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingAppNew.DTOs;
using DatingAppNew.Models;

namespace DatingAppNew.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap <User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap <User, UserDetailDto>().ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap <Photo, PhotoForDetailsDTO>();

            CreateMap <UserForUpdateDto, User>();

            CreateMap <Photo, PhotoForReturnDto>();

            CreateMap <PhotoForCreationDto, Photo>();

            CreateMap<UserForRegisterDto, User>();
        }
    }
}
