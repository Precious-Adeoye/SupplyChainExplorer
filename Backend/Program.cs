using Backend.Data;
using Backend.Interfaces;
using Backend.Services;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("https://supply-chain-explorer-h2rp.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<CognoDbConnection>();

builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();


var app = builder.Build();
app.UseCors("FrontendPolicy");

// Configure the HTTP request pipeline.
if(app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


