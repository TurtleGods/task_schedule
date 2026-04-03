using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskSchedule.Api.Domain.Entities;
using TaskSchedule.Api.Infrastructure.Identity;

namespace TaskSchedule.Api.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<ProviderProfile> ProviderProfiles => Set<ProviderProfile>();
    public DbSet<ClientProfile> ClientProfiles => Set<ClientProfile>();
    public DbSet<AvailabilitySlot> AvailabilitySlots => Set<AvailabilitySlot>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<PortfolioItem> PortfolioItems => Set<PortfolioItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ProviderProfile>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.DisplayName).HasMaxLength(200);
            entity.HasIndex(x => x.UserId).IsUnique();
        });

        builder.Entity<ClientProfile>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.DisplayName).HasMaxLength(200);
            entity.HasIndex(x => x.UserId).IsUnique();
        });

        builder.Entity<AvailabilitySlot>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.TimeZone).HasMaxLength(100);
            entity.HasIndex(x => new { x.ProviderProfileId, x.StartAt, x.EndAt });
        });

        builder.Entity<Booking>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Status).HasMaxLength(50);
            entity.HasIndex(x => x.AvailabilitySlotId).IsUnique();
        });

        builder.Entity<PortfolioItem>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Title).HasMaxLength(200);
        });
    }
}
