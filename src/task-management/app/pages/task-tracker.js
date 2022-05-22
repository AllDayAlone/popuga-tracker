import React from 'react';
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query'
import Icon from '../components/Icon';
import Button from '../components/Button';

function GhostButton({ children, className, ...props }) {
  return <button {...props} className={`align-center rounded-lg font-semibold text-black ${className}`}>{children}</button>
}

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return <input ref={ref} className={`h-full pl-6 py-3 bg-light rounded-lg placeholder:text-gray ${className}`} {...props} />
});

function CheckButton({ className, ...props }) {
  return <button {...props} className={`w-6 h-6 rounded border border-gray ${className}`} />
}

function Checked({ className, ...props }) {
  return <div {...props} className={`w-6 h-6 flex items-center justify-center rounded border border-gray ${className}`}>
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.00003 11.17L1.83003 7L0.410034 8.41L6.00003 14L18 2L16.59 0.589996L6.00003 11.17Z" fill="#A29CCB" />
    </svg>
  </div>
}

function Show({ when, children }) {
  if (when) {
    return children;
  }

  return null;
}

{/* <div>
        {session?.user ? <p>Session: {JSON.stringify(session)}</p> : <p>Anonymous</p>}
        {session?.user ? <a href="http://localhost:3002">Profile</a> : <a href="http://localhost:3002/api/auth/signin">Go to SSO</a>}
      </div> */}

function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3002/api/auth/session', { credentials: 'include' }).then(r => r.json()).then(setSession);

    return () => { };
  }, []);

  return session;
}

function AddTaskForm({ className }) {
  const taskTitleRef = useRef(null);

  useEffect(() => {
    taskTitleRef.current?.focus();
  }, []);

  return (
    <form action="/api/tasks" method="post" className={`flex h-full flex-grow ${className}`}>
      <Input
        className="border-none flex-grow rounded-r-none"
        placeholder="Task description"
        ref={taskTitleRef}
        type="text"
        id="title"
        name="title"
      />
      <Button className="w-52 rounded-l-none" type="submit">+ Add task</Button>
    </form>
  );
}

export default function Home() {
  const session = useSession();
  const { data } = useQuery('tasks');

  const tasks = data?.tasks;
  const todoTasks = tasks?.filter(t => !t.isCompleted);
  const doneTasks = tasks?.filter(t => t.isCompleted);

  const onShuffleTasks = () => fetch(`/api/tasks/shuffleOpen`, { method: 'post' });
  const handleTaskComplete = taskPublicId => () => fetch(`/api/tasks/${taskPublicId}/complete`, { method: 'post' });

  if (!session?.user) {
    return null;
  }

  return (
    <div className="m-10 mt-12">
      <Head>
        <title>Task tracker</title>
      </Head>
      <div className="h-12 flex items-center">
        <h1 className="font-semibold text-3xl">Task tracker</h1>
        <AddTaskForm className="ml-10" />
      </div>

      <main className="mt-12 grid grid-cols-2 gap-6">
        <Show when={todoTasks?.length > 0}>
          <div className="p-8 pt-6 h-fit rounded-2xl bg-lavender flex flex-col">
            <div className="flex justify-between items-top">
              <span className="text-black text-2xl font-semibold">To do</span>
              <GhostButton onClick={onShuffleTasks}>🔀 Shuffle tasks</GhostButton>
            </div>

            {todoTasks?.map(task => (
              <div key={task.publicId} className="flex items-center rounded-lg content-between p-6 bg-white mt-4 first:mt-0">
                <div className="flex flex-col">
                  <span className="text-black">{task.title}</span>
                  <span className="text-gray text-sm">{task.assignee.name}</span>
                </div>

                <CheckButton className="ml-auto" onClick={handleTaskComplete(task.publicId)} />
              </div>
            ))}
          </div>
        </Show>
        <Show when={doneTasks?.length > 0}>
          <div className="p-8 pt-6 h-fit rounded-2xl bg-lime flex flex-col">
            <div className="flex content-between">
              <span className="text-black text-2xl font-semibold">Done</span>
            </div>

            {doneTasks?.map(task => (
              <div key={task.publicId} className="flex items-center rounded-lg content-between p-6 bg-white mt-4 first:mt-0">
                <div className="flex flex-col">
                  <span className="text-black">{task.title}</span>
                  <span className="text-gray text-sm">{task.assignee.name}</span>
                </div>

                <Checked className="ml-auto" />
              </div>
            ))}
          </div>
        </Show>
      </main>
    </div>
  )
}
