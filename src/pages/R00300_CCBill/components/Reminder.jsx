import uuid from 'react-uuid';
import { CalendarIcon } from 'assets/images/icons';
import { FEIBIconButton } from 'components/elements';
import { showCustomPrompt } from 'utilities/MessageModal';
import ReminderWrapper from './Reminder.style';

const Reminder = ({ bills, deductInfo }) => {
  const handleHintText = (text) => {
    if (text.match('提')) {
      const textChanged = text.split('提');
      return [textChanged[0], `提${textChanged[1]}`];
    }
    return [text];
  };

  const downloadICS = () => {
    const context = [
      'BEGIN:VCALENDAR',
      'PRODID:-//FEIB//Bankee credit card reminder//TW',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:${uuid()}`,
      `DTSTAMP:${new Date().toISOString().replaceAll('-', '').replaceAll(':', '')
        .split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${parseInt(bills.payDueDate.replaceAll('/', ''), 10) + 19110000}`,
      'RRULE:FREQ=MONTHLY',
      'SUMMARY:Bankee信用卡繳款截止日',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([context], { type: 'text/calendar;charset=utf-8' });

    window.open(URL.createObjectURL(blob), '_blank');
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = '提醒繳款.ics';
    // link.setAttribute('download', '提醒繳款.ics');
    // link.target = '_blank';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    URL.revokeObjectURL(blob);
  };

  const handleCalendarClick = async () => {
    await showCustomPrompt({
      title: '系統訊息', message: '將帳單繳款提示加入手機行事曆？', okContent: '確認', onOk: () => downloadICS(),
    });
  };

  return (
    <ReminderWrapper>
      { bills && (
      <>
        <div className="auto">{handleHintText(deductInfo.hintToPay).map((text) => (<p key={text}>{text}</p>))}</div>
        <FEIBIconButton $fontSize={2} className="badIcon" onClick={handleCalendarClick}>
          <CalendarIcon />
        </FEIBIconButton>
      </>
      )}
    </ReminderWrapper>
  );
};

export default Reminder;
