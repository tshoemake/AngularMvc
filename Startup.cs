using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AngularMvc.Startup))]
namespace AngularMvc
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
