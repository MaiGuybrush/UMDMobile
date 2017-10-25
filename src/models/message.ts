export class Message
{
    constructor(data: any = undefined)
    {
        if (data)
        {
            this.id = data.additionalData.alarmDt
            this.occurDT = new Date(data.additionalData.occurDT);
            this.alarmID = data.title;
            this.eqptID = data.additionalData.eqptID;
            this.alarmMessage = data.message;
            this.alarmType = data.additionalData.alarmType;
            this.description = data.additionalData.description;
            this.uuid = data.additionalData.uuid;
        }

    }
    rowid: number;
    id:string;  //tstamp UMD issued
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
    keptPushRowid?: number = undefined;
}