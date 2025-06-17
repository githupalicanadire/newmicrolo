namespace Shopping.Web.Models.Basket;

public class BasketCheckoutModel
{
    // Customer Information
    public string UserName { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string EmailAddress { get; set; } = default!;

    // Billing Address
    public string AddressLine { get; set; } = default!;
    public string Country { get; set; } = default!;
    public string State { get; set; } = default!;
    public string ZipCode { get; set; } = default!;

    // Payment
    public string CardName { get; set; } = default!;
    public string CardNumber { get; set; } = default!;
    public string Expiration { get; set; } = default!;
    public string CVV { get; set; } = default!;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CreditCard;
    
    // Order
    public decimal TotalPrice { get; set; }
}

public enum PaymentMethod
{
    CreditCard = 1,
    PayPal = 2,
    BankTransfer = 3
}

// Response/Request models
public record CheckoutBasketRequest(BasketCheckoutModel BasketCheckout);
public record CheckoutBasketResponse(bool IsSuccess);
