import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import styled from 'styled-components';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { HabitList } from './components/HabitList';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  if (!session) return <Auth />;

  return (
      <Container>
        <Header>
          <h1>Habit Tracker</h1>
          <SignOut onClick={() => supabase.auth.signOut()}>Sign out</SignOut>
        </Header>
        <HabitList />
      </Container>
  );
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    font-size: 22px;
    margin: 0;
  }
`;

const SignOut = styled.button`
  background: none;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
`;