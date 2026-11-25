namespace StateBlazor.Services;

// Everyone, until a restart: one number in this server process's memory.
public class Everyone
{
    int count;
    public int Value => count;
    public int Add() => Interlocked.Increment(ref count);
}
