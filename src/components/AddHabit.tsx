import { useState } from 'react';
import styled from 'styled-components';

type Props = {
    onAdd: (name: string, color: string) => void;
};

const COLORS = ['#40c463', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7'];

export function AddHabit({ onAdd }: Props) {
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        onAdd(trimmed, color);
        setName('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                placeholder="New habit..."
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Colors>
                {COLORS.map((c) => (
                    <Swatch
                        key={c}
                        type="button"
                        $color={c}
                        $active={c === color}
                        onClick={() => setColor(c)}
                    />
                ))}
            </Colors>
            <AddBtn type="submit">Add</AddBtn>
        </Form>
    );
}

const Form = styled.form`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 160px;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 15px;
`;

const Colors = styled.div`
  display: flex;
  gap: 6px;
`;

const Swatch = styled.button<{ $color: string; $active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ $active }) => ($active ? '#1a1a1a' : 'transparent')};
  background: ${({ $color }) => $color};
  cursor: pointer;
  padding: 0;
`;

const AddBtn = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  font-size: 15px;
  cursor: pointer;
`;