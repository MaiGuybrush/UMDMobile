class subresult{
    alarmId: string;
    isSuccess: boolean; 
    message: string;
}

export class SubscribeCancelResult
{
    isSuccess: boolean; 
    message: string;
    subResult: subresult[] ;
}