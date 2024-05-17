import { Barra } from "@interfaces/global";

const roundDownHour = (date: Date) => {
  const rounded = new Date(date);
  rounded.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
  return rounded;
};

const addHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export function getGroupedProduction(
  data: Barra[],
  start: Date,
  end: Date,
  hoursGroup: number
): { date: Date; nTelai: number }[] {
  // Initialize the results array
  const results: { date: Date; nTelai: number }[] = [];

  // Calculate the range of each group
  let currentStart = roundDownHour(new Date(start));
  
  let endDate = new Date(end);
  endDate.setHours(endDate.getHours() - 1);

  while (currentStart < endDate) {
    // Check if the current start falls within the weekend blackout period
    const dayOfWeek = currentStart.getDay();
    const hourOfDay = currentStart.getHours();

    if (dayOfWeek === 6 && hourOfDay >= 9) {
      // It's Saturday post 8 AM, skip to Monday at 6 AM
      currentStart = new Date(currentStart);
      currentStart.setDate(currentStart.getDate() + (8 - dayOfWeek)); // Moving to Sunday
      currentStart.setHours(6, 0, 0, 0); // Set to Monday at 6 AM
    } else if (dayOfWeek === 0) {
      // It's Sunday, skip to Monday at 6 AM
      currentStart = new Date(currentStart);
      currentStart.setDate(currentStart.getDate() + 1); // Move to Monday
      currentStart.setHours(6, 0, 0, 0); // Set to 6 AM
    } else if (dayOfWeek === 1 && hourOfDay < 6) {
      // It's Monday before 6 AM, set to 6 AM
      currentStart.setHours(6, 0, 0, 0);
    }

    const currentEnd = addHours(currentStart, hoursGroup);
    const copyStart = new Date(currentStart);
    const count = data.filter((barra) => {
      const inizioDate = new Date(barra.inizio);
      return inizioDate >= copyStart && inizioDate < currentEnd;
    }).length;

    results.push({
      date: new Date(currentStart),
      nTelai: count,
    });

    // Move to the next time block
    currentStart = currentEnd;
  }

  return results;
}


export function averageProductionPerHour(data: Barra[]): { currentWeek: number; lastWeek: number } {
  // Helper function to get Monday of the current week
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  // Set reference dates
  const today = new Date();
  const thisMonday = getMonday(today);
  thisMonday.setHours(0, 0, 0, 0);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(lastMonday.getDate() - 7);
  lastMonday.setHours(0, 0, 0, 0);

  // Count the number of barre per hour
  const counts: { [key: string]: number } = {};

  data.forEach(barra => {
    const startTime = new Date(barra.inizio);

    if (startTime > roundDownHour(new Date())) return; 
    const hour = startTime.toISOString().substring(0, 13); // Extract YYYY-MM-DDTHH

    if (startTime >= lastMonday && startTime < new Date(thisMonday.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      counts[hour] = (counts[hour] || 0) + 1;
    }
  });

  // Calculate averages for last and current week
  let totalCurrentWeek = 0, totalLastWeek = 0;
  let hoursCurrentWeek = 0, hoursLastWeek = 0;
  

  for (const hour in counts) {
    let hourFinal = hour + ":00:00.000Z";
    const dateOfHour = new Date(hourFinal);
    
    // date needs to be more than 6 hours ago
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    if (dateOfHour >= thisMonday && dateOfHour <= sixHoursAgo) {
      totalCurrentWeek += counts[hour];
      hoursCurrentWeek++;
    } else if (dateOfHour >= lastMonday && dateOfHour < thisMonday) {
      totalLastWeek += counts[hour];
      hoursLastWeek++;
    }
  }

  const averageCurrentWeek = hoursCurrentWeek > 0 ? totalCurrentWeek / hoursCurrentWeek : 0;
  const averageLastWeek = hoursLastWeek > 0 ? totalLastWeek / hoursLastWeek : 0;

  return {
    currentWeek: averageCurrentWeek,
    lastWeek: averageLastWeek
  };
}