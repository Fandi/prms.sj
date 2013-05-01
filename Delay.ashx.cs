using System.Web;

namespace Test
{
	public class Delay : IHttpHandler
	{
		public void ProcessRequest(HttpContext context)
		{
			System.Threading.Thread.Sleep(int.Parse(context.Request.QueryString["delay"] ?? "0"));

			context.Response.ContentType = "text/plain";
			context.Response.Write(context.Request.QueryString["value"] ?? "");
		}

		public bool IsReusable
		{
			get
			{
				return true;
			}
		}
	}
}