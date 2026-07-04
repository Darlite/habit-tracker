import { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase.ts';

export function Auth() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
        });

        setLoading(false);
        if (error) setError(error.message);
        else setSent(true);
    };

    if (sent) {
        return <Wrapper>Check your email for the login link.</Wrapper>;
    }

    return (
        <Wrapper>
            <h1>Habit Tracker</h1>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send magic link'}
                </Button>
                {error && <ErrorText>{error}</ErrorText>}
            </Form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  max-width: 360px;
  margin: 100px auto;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 15px;
`;

const Button = styled.button`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: #40c463;
  color: white;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ErrorText = styled.p`
  color: #d33;
  font-size: 14px;
`;