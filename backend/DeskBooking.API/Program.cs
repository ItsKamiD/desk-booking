using DeskBooking.API.Data;
using Microsoft.EntityFrameworkCore;
using DeskBooking.API.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ReservationService>();

// EF InMemory DB
builder.Services.AddDbContext<AppDb>(opt =>
    opt.UseInMemoryDatabase("DeskBookingDb"));

// CORS (so React can call the API)
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p =>
        p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    DbSeeder.Seed(db);
}

app.UseCors("frontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
