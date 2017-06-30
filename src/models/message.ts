export class Message
{
    constructor()
    {

    }
    rowid: number;
    id:string;
    description: string;
    alarmID: string;
    eqptID: string;
    alarmMessage: string;
    alarmType: string;
    // alarmDate: string;  //多
    // alarmTime: string;  //多
    occurDT: Date;  
    read: boolean;
    
}