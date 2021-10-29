using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BulkyBook.Models
{
    public class APIProduct
    {
        [Key]
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string ProductFeatures { get; set; }
        public int ProductPrice { get; set; }
        public bool Status { get; set; }
    }
    public class Source
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class Articles
    {
        public Source Source { get; set; }
        public string author { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string url { get; set; }
        public string urlToImage { get; set; }
        public string publishedAt { get; set; }
        public string content { get; set; }
    }
    public class Resp
    {
        public string SearchBy { get; set; }
        public string SourceName { get; set; }
        public string Status { get; set; }
        public string totalResults { get; set; }
        public List<Articles> Articles { get; set; }
    }
}
