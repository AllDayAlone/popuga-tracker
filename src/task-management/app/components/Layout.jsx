import styles from './Layout.module.css';
import Navlink from './NavLink';

export default function Layout({ children }) {
  return (
    <>
      <aside className={styles.sidebar}>
        <div className="flex flex-col pl-4">
          <span className="inline-block h-10 w-10 rounded-full bg-parrot bg-cover bg-center" />
          <span className="mt-2 text-lg text-black">Jolie Redfeather</span>
          <span className="mt-1 text-sm text-gray">Admin</span>
        </div>


        <ul className="mt-24">
          <Navlink glyph="task-tracker" href="/task-tracker">Task tracker</Navlink>
          <Navlink glyph="billing" href="/billing">Billing</Navlink>
          <Navlink glyph="analytics" href="/analytics">Analytics</Navlink>
        </ul>

        <footer className="pl-4 mt-auto">
          <span className="text-2xl font-semibold">aTES</span><br />
          <span className="text-sm font-semibold">by UberPopug Inc</span>
        </footer>
      </aside>
      <main className={styles.page}>{children}</main>
    </>
  );
}