namespace LEGAL.Shared.Interfaces;
public interface INotificationClient { Task<bool> SendAsync(string channel, string recipient, string message, string? botName = null, string? parseMode = "HTML"); }
