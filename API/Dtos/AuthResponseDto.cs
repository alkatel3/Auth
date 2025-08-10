namespace API.Dtos
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
