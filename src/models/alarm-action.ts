export class AlarmAction
{
    actionType: number; //Mail Type=1 MailGroup Type=2 MApp Type=3 MAppGroup Type=4
    actionValue: string; //<Mail> 發送對象AD帳號, 或 &[部門代碼]; <MailGroup> 發送群組ID; <MApp> 發送對象工號; <MAppGroup> 發送群組ID
    chatName: string; //ActionType=5 時, 必填 交談室名稱
    enabled: boolean;
    name: string; //API無，畫面顯示用
    mailEmpId: string; //<Mail> 發送對象工號, 僅訂閱AlarmID使用
    isDept: boolean; //API無, 僅訂閱AlarmID使用
}