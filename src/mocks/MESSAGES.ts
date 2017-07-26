import { Message } from '../models/message';
export const ARCHIVE_MESSAGES: Message[] = [
]
export const MESSAGES: Message[] = [
      {
        rowid: 1,
        id:`123456789ASDFA`,
        description: `ZALL-CIM-RTQCS-AP_fail,RTQCS 運作異常 AP_fail _TFT4`,
        alarmID: 'ZALL-CIM-RTQCS-AP_fail',
        alarmMessage: 'ZALL RTQCS TFT4 發生 PreInfo 運作異常，通報時間 20 分鐘 ，最後時間 : 201...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-07-25T11:00:01Z'),
        read: true
      },
      { 
        rowid: 2,
        id:`123456789ASDFB`,
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
        id:`123456789ASDFA`,
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
        id:`123456789ASDFB`,
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
        id:`123456789ASDFC`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'RTQCS',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-07-04T11:45:01Z'),
        read: false
      },
      {
        rowid: 6,
        id:`123456789ASDFD`,
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
        id:`123456789ASDFE`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'COMMON',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        rowid: 8,
        id:`123456789ASDFF`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'RTIT',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        rowid: 9,
        id:`123456789ASDFG`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'EDC',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        rowid: 10,
        id:`123456789ASDFH`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'SPC',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      {
        rowid: 11,
        id:`123456789ASDFI`,
        description: 'STCO0200 alarm, code[0001]',
        alarmID: 'TFT3-PHOTO-EQP-alarm',
        alarmMessage: 'EQ alarm',
        alarmType: 'REPORT',
        eqptID: 'STCO0100',
        occurDT: new Date('2017-01-02T11:45:01Z'),
        read: false
      },
      { 
        rowid: 12,
        id:`123456789ASDFV`,
        description: 'RTQCS 運作異常 AP_fail _TFT5',
        alarmID: 'OTFT55-CIM-RTQCS-AP_fail',
        alarmMessage: 'RTQCS TFT5 發生 PreInfo Archive 運作異常，通報時間 20 分鐘 ，最後...',
        alarmType: 'RTQCS',
        eqptID: '',
        occurDT: new Date('2017-07-05T10:15:01Z'),
        read: true
      }
];