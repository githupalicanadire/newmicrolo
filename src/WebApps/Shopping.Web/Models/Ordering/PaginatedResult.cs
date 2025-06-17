namespace Shopping.Web.Models.Ordering;

public class PaginatedResult<TEntity> where TEntity : class
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public long Count { get; set; }
    public IEnumerable<TEntity> Data { get; set; } = Enumerable.Empty<TEntity>();
    
    public int TotalPages => (int)Math.Ceiling((double)Count / PageSize);
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
}
