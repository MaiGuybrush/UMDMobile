import { Message } from '../models/message';
export const ARCHIVE_MESSAGES: Message[] = [
]
export const MESSAGES: Message[] = [
      {
        rowid: 1,
        id:`2017-07-25 11:01:00.000000`,
        description: `ZALL-CIM-RTQCS-AP_fail,RTQCS 運作異常 AP_fail _TFT4`,
        alarmID: 'ZALL-CIM-RTQCS-AP_fail',
        alarmMessage: 'ZALL RTQCS TFT4 發生 PreInfo 運作異常，通報時間 20 分鐘 ，最後時間 : 201...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-07-25T11:00:01Z'),
        read: false
      },
      { 
        rowid: 2,
        id:`2017-07-25 11:31:00.000000`,
        description: 'RTQCS 運作異常 AP_fail _TFT3',
        alarmID: 'ATFT3-CIM-RTQCS-AP_fail',
        alarmMessage: 'RTQCS TFT3 發生 PreInfo Archive 運作異常，通報時間 20 分鐘 ，最後...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-07-25T11:30:01Z'),
        read: false
      },
      {
        rowid: 3,
        id:`2017-07-02 12:01:00.000000`,
        description: `RTQCS 運作異常 AP_fail _TFT4`,
        alarmID: 'KALL-CIM-RTQCS-AP_fail',
        alarmMessage: 'KALL RTQCS TFT4 發生 PreInfo 運作異常，通報時間 20 分鐘 ，最後時間 : 201...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-07-02T12:00:01Z'),
        read: false
      },
      { 
        rowid: 4,
        id:`2017-07-07 11:01:00.000000`,
        description: 'RTQCS 運作異常 AP_fail _TFT3',
        alarmID: 'OTFT3-CIM-RTQCS-AP_fail',
        alarmMessage: 'RTQCS TFT3 發生 PreInfo Archive 運作異常，通報時間 20 分鐘 ，最後...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-07-06T10:30:01Z'),
        read: false
      },
      { 
        rowid: 5,
        id:`2017-07-04 11:50:00.000000`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EQP',
        eqptID: 'STCO0200',
        occurDT: new Date('2017-07-04T11:45:01Z'),
        read: false
      },
      {
        rowid: 6,
        id:`2017-05-03 12:01:00.000000`,
        description: 'alarm test test test',
        alarmID: 'ACF03-CIM-COMMON-test',
        alarmMessage: 'alarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtestalarmtest',
        alarmType: 'COMMON',
        eqptID: '',
        occurDT: new Date('2017-05-03T11:45:01Z'),
        read: false
      },
      {
        rowid: 7,
        id:`2017-07-29 12:11:00.000000`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EQP',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-07-29T11:45:01Z'),
        read: false
      },
      {
        rowid: 8,
        id:`2017-07-31 11:46:00.000000`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EQP',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-07-31T11:45:01Z'),
        read: false
      },
      {
        rowid: 9,
        id:`2017-08-01 17:51:00.000000`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EDC',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-08-01T17:45:01Z'),
        read: false
      },
      {
        rowid: 10,
        id:`2017-08-03 16:52:00.000000`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'SPC',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-08-03T16:45:01Z'),
        read: false
      },
      {
        rowid: 11,
        id:`2017-03-03 20:53:00.000000`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'REPORT',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-08-03T20:45:01Z'),
        read: false
      },
      { 
        rowid: 12,
        id:`2017-08-08 10:21:00.000000`,
        description: 'RTIT 運作異常 AP_fail _TFT5',
        alarmID: 'OTFT55-CIM-RTIT-AP_fail',
        alarmMessage: 'RTIT TFT5 發生 PreInfo Archive 運作異常，通報時間 20 分鐘 ，最後...',
        alarmType: 'RTIT',
        eqptID: '',
        occurDT: new Date('2017-08-08T10:15:01Z'),
        read: false
      }
];