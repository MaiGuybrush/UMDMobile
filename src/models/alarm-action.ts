export class AlarmAction
{
    
    ActionType: number; //Mail Type=1 MailGroup Type=2 MApp Type=3 MAppGroup Type=4
    ActionValue: string; //<Mail> 發送對象AD帳號, 或 &[部門代碼]; <MailGroup> 發送群組ID; <MApp> 發送對象工號; <MAppGroup> 發送群組ID
    Enabled: boolean;
}