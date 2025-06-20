export function formatDatetoISO(date : string) : string{
    const [month,day,year] = date.split("/");
    return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`; 
}