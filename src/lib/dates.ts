export function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function buildYearGrid(): Date[][] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() - 52 * 7);

    // Align to Monday. getDay(): Sun=0, Mon=1, ... Sat=6
    // Days to subtract to reach the previous Monday:
    const day = start.getDay();
    const diffToMonday = (day + 6) % 7; // Mon->0, Tue->1, ... Sun->6
    start.setDate(start.getDate() - diffToMonday);

    const weeks: Date[][] = [];
    const cursor = new Date(start);

    while (cursor <= today) {
        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            week.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        weeks.push(week);
    }

    return weeks;
}

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// For each week (column), decide if a month label should appear above it.
// A label is placed on the first week whose first day is in a new month.
export type MonthLabel = { weekIndex: number; name: string };

export function getMonthLabels(weeks: Date[][]): MonthLabel[] {
    const labels: MonthLabel[] = [];
    let lastMonth = -1;

    weeks.forEach((week, i) => {
        const firstDay = week[0];
        const month = firstDay.getMonth();
        if (month !== lastMonth) {
            labels.push({ weekIndex: i, name: MONTH_NAMES[month] });
            lastMonth = month;
        }
    });

    return labels;
}

export function getToday(): string {
    return toISODate(new Date());
}

export function getYesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toISODate(d);
}
