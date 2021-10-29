using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace BulkyBooks.Helpers
{
    public static class APICall
    {
        public static async Task<HttpResponseMessage> HttpRequestHeaderMethod<T>(string resourceId, HttpMethod httpVerb, string url, T obj)
        {
            ///Token Generation method with request header
            //AuthenticationResult BearerToken = null;

            //if (!string.IsNullOrEmpty(resourceId))
            //{
            //    AzureADAccessToken azureADAccessToken = new AzureADAccessToken(appConfiguration.Value.IdaTokenClientId, appConfiguration.Value.IdaTokenAppKey, resourceId, appConfiguration);
            //    BearerToken = await azureADAccessToken.AcquireToken();
            //    Token = BearerToken.AccessToken.ToString();
            //}

            using (var client = new System.Net.Http.HttpClient())
            {
                HttpRequestMessage request = null;
                HttpResponseMessage response = null;
                //int HttpClientTimeOut = appConfiguration.Value.HttpClientTimeout;
                //client.Timeout = System.TimeSpan.FromSeconds(HttpClientTimeOut);
                request = new HttpRequestMessage(httpVerb, url);
                request.Headers.Accept.Clear();
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Token);

                if (obj != null && obj.GetType() != typeof(int) && obj.GetType() != typeof(string) && obj.GetType() != typeof(decimal))
                {
                    var json = JsonConvert.SerializeObject(obj, Formatting.None);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");
                    request.Content = content;
                }
                response = await client.SendAsync(request);
                return response;
            }

        }

        public static async Task<HttpResponseMessage> HttpRequestHeaderMethod<T>(string clientId, string appKey, string aadInstance, string tenant, string resourceId, HttpMethod httpVerb, string url, T obj)
        {

            ///Token Generation method with request header
            //AuthenticationResult BearerToken = null;

            //if (resourceId != "")
            //{
            //    AzureADAccessToken azureADAccessToken = new AzureADAccessToken(clientId, appKey, resourceId, aadInstance, tenant);
            //    BearerToken = await azureADAccessToken.AcquireToken();
            //    Token = BearerToken.AccessToken.ToString();

            //}

            HttpRequestMessage request = null;
            HttpResponseMessage response = null;

            using (var client = new System.Net.Http.HttpClient())
            {

                request = new HttpRequestMessage(httpVerb, url);
                request.Headers.Accept.Clear();
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Token);

                if (obj.GetType() != typeof(int) && obj.GetType() != typeof(string) && obj.GetType() != typeof(decimal))

                {
                    if (obj != null)
                    {
                        var json = JsonConvert.SerializeObject(obj, Formatting.None);
                        var content = new StringContent(json, Encoding.UTF8, "application/json");
                        request.Content = content;
                    }

                }
                response = await client.SendAsync(request);
            }

            return response;
        }

        //public async Task<IActionResult> Index()
        //{
        //    string url = "https://localhost:44384/api/Product/Get";
        //    HttpResponseMessage response = await APICall.HttpRequestHeaderMethod("", HttpMethod.Get, url, "");
        //    if (response.IsSuccessStatusCode)
        //    {
        //        var res = response.Content.ReadAsStringAsync().Result;
        //        List<APIProduct> products = JsonConvert.DeserializeObject<List<APIProduct>>(res);
        //        Console.WriteLine("Id:{0}\tName:{1}", products[0].ProductID, products[0].ProductName);
        //        Console.WriteLine("No of Products in Department: {0}", products.Count);
        //    }
        //    else
        //    {
        //        Console.WriteLine("Internal server Error");
        //    }
        //    return View();
        //}
    }
}
