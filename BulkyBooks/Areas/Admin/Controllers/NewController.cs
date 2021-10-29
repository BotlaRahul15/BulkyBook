using BulkyBook.Models;
using BulkyBooks.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace BulkyBooks.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class NewController : Controller
    {
        private ApplicationConfigurations _applicationConfigurations { get; set; }
        public NewController(IOptions<ApplicationConfigurations> appConfig)
        {
            _applicationConfigurations = appConfig.Value;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Index(Resp res1)
        {
            Resp rep = new Resp();
            string date = DateTime.Now.ToString("yyyy-MM-dd");
            string url = "https://newsapi.org/v2/everything?q=" + res1.SearchBy + "&from=" + date + "&sortBy=publishedAt&apiKey=45fda69d97bf4c1aa509ed996d1c3a51";
            //string url = "https://newsapi.org/v2/everything?q=%22+searchstring+%22&from=%22+DateString+%22&sortBy=publishedAt&apiKey=45fda69d97bf4c1aa509ed996d1c3a51";
            HttpResponseMessage response = await APICall.HttpRequestHeaderMethod("", HttpMethod.Get, url, "");
            if (response.IsSuccessStatusCode)
            {
                string res = response.Content.ReadAsStringAsync().Result;
                rep = JsonConvert.DeserializeObject<Resp>(res);
                rep.SearchBy = res1.SearchBy;
            }
            else
            {
                Console.WriteLine("Internal server Error");
            }
            return View(rep);
        }

        [HttpGet]
        public async Task<IActionResult> GetNewsData(string searchKey, string sourceName)
        {
            Resp rep = new Resp();
            int recordCount = 0;
            string date = DateTime.Now.ToString("yyyy-MM-dd");
            string url = _applicationConfigurations.NewsApiUrl + searchKey + "&from=" + date + "&sortBy=publishedAt&apiKey=45fda69d97bf4c1aa509ed996d1c3a51";
            HttpResponseMessage response = await APICall.HttpRequestHeaderMethod("", HttpMethod.Get, url, "");
            if (response.IsSuccessStatusCode)
            {
                string res = response.Content.ReadAsStringAsync().Result;
                rep = JsonConvert.DeserializeObject<Resp>(res);
                rep.SearchBy = searchKey;
                recordCount = rep.Articles.Count();
            }
            else
            {
                Console.WriteLine("Internal server Error");
            }
            if (rep != null && rep.Articles != null && rep.Articles.Count() > 0 && !string.IsNullOrEmpty(sourceName))
            {
                rep.Articles = rep.Articles.Where(x => x.Source.Name.ToLower().Contains(sourceName.ToLower())).ToList();
            }

            return Json(new { data = rep.Articles });
        }

        [HttpGet]
        public async Task<IActionResult> GetNewsDataServerSide(string searchKey, JqueryDatatableParam param)
        {
            Resp rep = new Resp();
            int recordCount = 0;
            string date = DateTime.Now.ToString("yyyy-MM-dd");
            string url = _applicationConfigurations.NewsApiUrl + searchKey + "&from=" + date + "&sortBy=publishedAt&apiKey=45fda69d97bf4c1aa509ed996d1c3a51";
            HttpResponseMessage response = await APICall.HttpRequestHeaderMethod("", HttpMethod.Get, url, "");
            if (response.IsSuccessStatusCode)
            {
                string res = response.Content.ReadAsStringAsync().Result;
                rep = JsonConvert.DeserializeObject<Resp>(res);
                rep.SearchBy = searchKey;
                recordCount = rep.Articles.Count();
            }
            else
            {
                Console.WriteLine("Internal server Error");
            }
            if (rep != null && rep.Articles != null && rep.Articles.Count() > 0 && param != null && param.iColumns > 0)
            {
                rep.Articles = Filter(rep.Articles,param);
                //recordCount = rep.Articles.Count();
                return Json(new
                {
                    param.sEcho,
                    iTotalRecords = recordCount,
                    iTotalDisplayRecords = recordCount,
                    aaData = rep.Articles
                });
            }
            
            return Json(new { data = rep.Articles });
        }
        public async Task<IActionResult> Index2()
        {
            List<APIProduct> products = new List<APIProduct>();
            string url = "https://localhost:44384/api/Product/Get";
            HttpResponseMessage response = await APICall.HttpRequestHeaderMethod("", HttpMethod.Get, url, "");
            if (response.IsSuccessStatusCode)
            {
                var res = response.Content.ReadAsStringAsync().Result;
                products = JsonConvert.DeserializeObject<List<APIProduct>>(res);
                Console.WriteLine("Id:{0}\tName:{1}", products[0].ProductID, products[0].ProductName);
                Console.WriteLine("No of Products in Department: {0}", products.Count);
            }
            else
            {
                Console.WriteLine("Internal server Error");
            }
            return View(products);
        }
        public List<Articles> Filter(List<Articles> articles, JqueryDatatableParam param)
        {
            if (!string.IsNullOrEmpty(param.sSearch))
            {
                articles = articles.Where(x => x.Source.Name.ToLower().Contains(param.sSearch.ToLower())
                                              || x.title.ToLower().Contains(param.sSearch.ToLower())
                                              || x.description.ToLower().Contains(param.sSearch.ToLower())).ToList();
            }
            if (param.iSortCol_0 == 0)
            {
                articles = param.sSortDir_0 == "asc" ? articles.OrderBy(c => c.Source.Name).ToList() : articles.OrderByDescending(c => c.Source.Name).ToList();
            }
            else if (param.iSortCol_0 == 1)
            {
                articles = param.sSortDir_0 == "asc" ? articles.OrderBy(c => c.title).ToList() : articles.OrderByDescending(c => c.title).ToList();
            }
            else if (param.iSortCol_0 == 2)
            {
                articles = param.sSortDir_0 == "asc" ? articles.OrderBy(c => c.description).ToList() : articles.OrderByDescending(c => c.description).ToList();
            }
            articles = articles.Skip(param.iDisplayStart).Take(param.iDisplayLength).ToList();
            return articles;
        }
    }
}
