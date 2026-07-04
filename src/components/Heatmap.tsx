import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { buildYearGrid, getMonthLabels, toISODate } from '../lib/dates';

type Props = {
    color: string;
    loggedDates: Set<string>;
    onToggle: (date: string) => void;
};

// Weekday labels shown on the left (rows 1, 3, 5 -> Mon, Wed, Fri)
const WEEKDAY_LABELS: Record<number, string> = {
    1: 'Mon',
    3: 'Wed',
    5: 'Fri',
};

export function Heatmap({ color, loggedDates, onToggle }: Props) {
    const weeks = useMemo(() => buildYearGrid(), []);
    const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
    const todayISO = toISODate(new Date());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to the most recent week on mount
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, []);

    // Map weekIndex -> month name for quick lookup in the header row
    const monthByWeek = useMemo(() => {
        const map = new Map<number, string>();
        monthLabels.forEach((l) => map.set(l.weekIndex, l.name));
        return map;
    }, [monthLabels]);

    return (
        <Scroll ref={scrollRef}>
            <Table>
                <thead>
                <tr>
                    {/* empty corner cell above the weekday labels */}
                    <CornerTh />
                    {weeks.map((_, wi) => (
                        <MonthTh key={wi}>{monthByWeek.get(wi) ?? ''}</MonthTh>
                    ))}
                </tr>
                </thead>
                <tbody>
                {[0, 1, 2, 3, 4, 5, 6].map((dow) => (
                    <tr key={dow}>
                        <WeekdayTh>{WEEKDAY_LABELS[dow] ?? ''}</WeekdayTh>
                        {weeks.map((week, wi) => {
                            const day = week[dow];
                            const iso = toISODate(day);
                            const isFuture = iso > todayISO;
                            const isDone = loggedDates.has(iso);

                            return (
                                <Td key={wi}>
                                    <Cell
                                        $done={isDone}
                                        $color={color}
                                        $future={isFuture}
                                        title={iso}
                                        onClick={() => {
                                            if (!isFuture) onToggle(iso);
                                        }}
                                    />
                                </Td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </Table>
        </Scroll>
    );
}

const Scroll = styled.div`
  overflow-x: auto;
  padding-bottom: 4px;
  max-width: 100%;
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 3px;
  /* prevent the table from stretching cells */
  table-layout: fixed;
`;

const CornerTh = styled.th`
  width: 28px;
`;

const MonthTh = styled.th`
  font-size: 10px;
  font-weight: 400;
  color: #767676;
  text-align: left;
  height: 14px;
  /* let labels overflow to the right so they aren't clipped to 12px */
  white-space: nowrap;
  overflow: visible;
`;

const WeekdayTh = styled.th`
    font-size: 10px;
    font-weight: 400;
    color: #767676;
    text-align: right;
    padding-right: 4px;
    width: 28px;
`;

const Td = styled.td`
    padding: 0;
    width: 12px;
    height: 12px;
`;

const Cell = styled.div<{ $done: boolean; $color: string; $future: boolean }>`
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: ${({ $done, $color }) => ($done ? $color : '#ebedf0')};
    cursor: ${({ $future }) => ($future ? 'default' : 'pointer')};
    opacity: ${({ $future }) => ($future ? 0.4 : 1)};

    &:hover {
        outline: ${({ $future }) => ($future ? 'none' : '1px solid #999')};
    }
`;