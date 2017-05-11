import { Message } from '../models/message';
export const MESSAGES: Message[] = [
      {
        description: `RTQCS 運作異常 AP_fail _TFT4`,
        alarmID: 'AALL-CIM-RTQCS-AP_fail',
        alarmMessage: 'RTQCS TFT4 發生 PreInfo 運作異常，通報時間 20 分鐘 ，最後時間 : 201...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-01-02T11:00:01Z'),
        read: true
      },
      {
        description: 'RTQCS 運作異常 AP_fail _TFT3',
        alarmID: 'ATFT3-CIM-RTQCS-AP_fail',
        alarmMessage: 'RTQCS TFT3 發生 PreInfo Archive 運作異常，通報時間 20 分鐘 ，最後...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-01-02T11:30:01Z'),
        read: false
      },
      {
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EQPT',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        description: 'alarm test test test',
        alarmID: 'ACF03-CIM-COMMON-test',
        alarmMessage: 'alarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtest',
        alarmType: 'COMMON',
        eqptID: '',
        occurDT: new Date('2017-05-03T11:45:01Z'),
        read: false
      },
      {
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'COMMON',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'RTIT',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
            {
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EDC',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'SPC',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'REPORT',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      }
];