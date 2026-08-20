using Backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly CognoDbConnection _database;

        public TestController(CognoDbConnection database)
        {
            _database = database;
        }

        [HttpGet("connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                await _database.Driver.VerifyConnectivityAsync();

                return Ok(new
                {
                    message = "Successfully connected to CognoDB!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Could not connect to CognoDB.",
                    error = ex.Message
                });
            }
        }
    }
}
