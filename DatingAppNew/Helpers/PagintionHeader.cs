using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppNew.Helpers
{
    public class PagintionHeader
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public PagintionHeader(int currentPage, int itemsPerpage, int totalItems, int totalPages)
        {
            this.CurrentPage = currentPage;
            this.ItemsPerPage = itemsPerpage;
            this.TotalItems = totalItems;
            this.TotalPages = totalPages;
        }
       
    }
}
