import Head from 'next/head'
import Button from '../components/Button';
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query'
import * as DateFns from 'date-fns';
import { range } from 'lodash';

function toDollars(amount) {
  return Number(amount / 100).toFixed(2);
}
function monthFull(date) {
  return DateFns.format(date, 'LLLL');
}
function weekdayShort(date) {
  return DateFns.format(date, 'EEEEEE');
}
function dayInMonth(date) {
  return DateFns.format(date, 'd');
}
function endOfPreviousMonth(date) {
  return DateFns.endOfMonth(DateFns.subMonths(date, 1));
}
function startOfNextMonth(date) {
  return DateFns.startOfMonth(DateFns.addMonths(date, 1));
}
function fullDate() {
  return Date
}

const Day = React.forwardRef(({ isActive, date, ...props }, ref) => {
  const className = isActive ? 'font-semibold bg-black text-white' : 'text-gray hover:bg-light';
  return (
    <div ref={ref} className={`flex flex-col w-14 h-14 mx-2 rounded-full items-center cursor-pointer ${className}`} {...props}>
      <div className="w-14 h-14" />
      <span className="">{dayInMonth(date)}</span>
      <span className="mb-1">{weekdayShort(date)}</span>
    </div>
  );
});

function Month({ date, isActive, ...props }) {
  const className = isActive ? 'font-semibold text-black' : 'text-gray';

  return <span className={`text-xl hover:bg-light rounded-lg cursor-pointer ml-[-3px] px-3 py-2 ${className}`} {...props}>{monthFull(date)}</span>
}

function Calendar({ billingDate }) {
  const [currentDate, setCurrentDate] = useState(billingDate);
  const dayRefs = useRef({});

  useEffect(() => {
    setCurrentDate(billingDate);
  }, [billingDate]);

  useEffect(() => {
    if (!currentDate) return;

    const day = DateFns.getDate(currentDate);
    const ref = dayRefs.current[day];

    ref?.scrollIntoView({ block: "end", inline: "center" });
  }, [currentDate]);


  return (
    <div className="w-full">
      <div className='w-full flex justify-between'>
        <Month date={DateFns.subMonths(currentDate, 1)} onClick={() => setCurrentDate(endOfPreviousMonth(currentDate))} />
        <Month isActive date={currentDate} />
        <Month date={DateFns.addMonths(currentDate, 1)} onClick={() => setCurrentDate(startOfNextMonth(currentDate))} />
      </div>
      <div className='flex justify-between mt-7 overflow-auto pb-10'>
        {range(1, DateFns.getDaysInMonth(currentDate) + 1).map((day) => (
          <Day key={day} ref={(el) => (dayRefs.current[day] = el)} isActive={DateFns.getDate(currentDate) === day} date={DateFns.setDate(currentDate, day)} onClick={() => setCurrentDate(DateFns.setDate(currentDate, day))} />
        ))}
      </div>
    </div>
  )
}

function Money({ amount }) {
  return <span className="font-semibold text-xl text-black">${toDollars(amount)}</span>;
}

const auditDescription = t => console.log(t) || ({
  'payout': `Payout for day ${DateFns.format(new Date(t.billingCycle.from), 'EEEE, d LLLL y')}`,
  'bounty': `Bounty for "${t.task.title}"`,
  'assign_fee': `Assign fee for "${t.task.title}"`,
})[t.type];

function UserRow({ userPublicId, name, balance, transactions, isChosen, ...props }) {
  console.log(transactions)
  return (
    <div className="px-8 py-3 first:pt-6 last:pb-6 cursor-pointer" {...props}>
      <div className="flex justify-between ">
        <span className="text-black text-lg">{name}</span>
        <span className="text-black text-lg">{toDollars(balance)}</span>
      </div>
      {isChosen && transactions.map((t) => (
        <div className="flex justify-between ">
          <span className="text-gray text-sm">{auditDescription(t)}</span>
          <span className="text-gray text-sm">{toDollars(t.income || -t.charge)}</span>
        </div>
      ))}
    </div>
  );
}


export default function Billing() {
  const queryClient = useQueryClient();
  const { data } = useQuery('users');
  const { data: billingCycle } = useQuery('billing-cycle');
  const { data: totalBalance } = useQuery('balance');
  const [chosenUserPublicId, setChosenUserPublicId] = useState(null);
  const users = data ?? [];

  if (!users.length || !billingCycle || !totalBalance) {
    return null;
  }

  const billingDate = new Date(billingCycle.from);

  const onCloseBillingCycle = async () => {
    await fetch(`/api/billing-cycle/close`, { method: 'post' });
    queryClient.invalidateQueries('billing-cycle');
    queryClient.invalidateQueries('balance');
  }


  const handleClickUserRow = (userPublicId) => () => {
    console.log(userPublicId)
    if (userPublicId !== chosenUserPublicId) {
      setChosenUserPublicId(userPublicId)
    } else {
      setChosenUserPublicId(null);
    }
  }

  return (
    <div className="w-[728px] mx-auto my-12">
      <Head>
        <title>Billing</title>
      </Head>
      <div className="grid grid-cols-billing gap-x-10 gap-y-12">
        <h1 className="text-black text-3xl font-semibold">Billing</h1>
        <Button onClick={onCloseBillingCycle}>End day</Button>
        <Calendar billingDate={billingDate} />
        <div className="bg-dashed rounded-lg p-6">
          <p>{DateFns.format(billingDate, 'EEEE, d LLLL y')}</p>
          <p className="mt-7 text-sm text-gray">Earnings today</p>
          <p className="mt-1"><Money amount={totalBalance.amount} /></p>
        </div>
        <div className="col-span-full rounded-lg border-2 border-light">
          <div className="flex justify-between bg-light px-8 py-6">
            <span className="text-gray text-lg">Name</span>
            <span className="text-gray text-lg">Amount, $</span>
          </div>
          <div>
            {users.map((user) => <UserRow key={user.userPublicId} {...user} onClick={handleClickUserRow(user.userPublicId)} isChosen={user.userPublicId === chosenUserPublicId} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
