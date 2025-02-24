export function formatDate(inputDate: string): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [year, month, day] = inputDate.split('-').map(Number);

    const suffix = (n: number): string => {
        if (n >= 11 && n <= 13) return "th";
        switch (n % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return `${months[month - 1]} ${day}${suffix(day)} ${year}`;
}
export function isValidNumber(value: string): boolean {
    if (value.trim() === '') return false; // Check for empty or whitespace-only strings
    const number = Number(value);
    return !isNaN(number) && isFinite(number);
}
