
namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string UserName { set; get; }

        public byte[] PasswordHash { set; get; }

        public byte[] PasswordSalt { set; get; }

        public DateTime DateOfBirth { set; get; }

        public string? KnownAs { get; set; }

        public DateTime? Created { get; set; } = DateTime.Now;

        public DateTime? LastActive { get; set; } = DateTime.Now;

        public string? Gender { set; get; }

        public string? Introduction { set; get; }

        public string? LookingFor { set; get; }

        public string? Interests { get; set; }

        public string? City { get; set; }

        public string? Country { set; get; }

        public ICollection<Photo> Photos { set; get; }
        public ICollection<UserLike> LikedByUsers { get; set; }
        public ICollection<UserLike> LikedUsers { get; set; }


    }
}