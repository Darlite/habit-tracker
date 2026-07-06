import { useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { buildYearGrid, getMonthLabels, toISODate } from '../lib/dates';

type Props = {
    color: string;
    loggedDates: Set<string>;
};

const WEEKDAY_LABELS: Record<number, string> = {
    0: 'Mon',
    2: 'Wed',
    4: 'Fri',
};

export function Heatmap({ color, loggedDates }: Props) {
    const weeks = useMemo(() => buildYearGrid(), []);
    const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
    const todayISO = toISODate(new Date());
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, []);

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
    opacity: ${({ $future }) => ($future ? 0.4 : 1)};
`;