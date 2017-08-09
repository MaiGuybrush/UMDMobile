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
    uuid?: string;
    // alarmDate: string;  //多
    // alarmTime: string;  //多
    occurDT: Date;  
    read: boolean;
    readCount?: number = 0;
    readNameList?: string = "";
    archived?: boolean = false;
    sameDate?: boolean =false;
}