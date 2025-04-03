
// Types for app usage data
export interface AppUsageData {
  [app: string]: {
    today: number;
    yesterday: number;
    startTime?: number;
    isActive?: boolean;
  };
}

// Local storage key
const STORAGE_KEY = 'appUsageData';

// Get usage data from localStorage
export function getAppUsageData(): AppUsageData {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Save usage data to localStorage
function saveAppUsageData(data: AppUsageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Start or stop tracking an app
export function trackAppUsage(appName: string, isActive: boolean): void {
  const data = getAppUsageData();
  
  // Initialize app data if it doesn't exist
  if (!data[appName]) {
    data[appName] = { today: 0, yesterday: 0 };
  }
  
  if (isActive) {
    // Start tracking
    data[appName].startTime = Date.now();
    data[appName].isActive = true;
  } else if (data[appName].startTime && data[appName].isActive) {
    // Stop tracking and calculate elapsed time
    const elapsedMinutes = (Date.now() - data[appName].startTime!) / (1000 * 60);
    data[appName].today = (data[appName].today || 0) + elapsedMinutes;
    data[appName].isActive = false;
    delete data[appName].startTime;
  }
  
  // Save the updated data
  saveAppUsageData(data);
}

// Reset data for a new day
export function resetDailyData(): void {
  const data = getAppUsageData();
  
  // Move today's data to yesterday
  Object.keys(data).forEach(app => {
    data[app].yesterday = data[app].today || 0;
    data[app].today = 0;
    data[app].isActive = false;
    delete data[app].startTime;
  });
  
  saveAppUsageData(data);
}

// Check if we need to reset data (if it's a new day)
export function checkAndResetDailyData(): void {
  const lastReset = localStorage.getItem('lastResetDate');
  const today = new Date().toDateString();
  
  if (lastReset !== today) {
    resetDailyData();
    localStorage.setItem('lastResetDate', today);
  }
}

// Get total time tracked for all apps today
export function getTotalTimeToday(): number {
  const data = getAppUsageData();
  return Object.values(data).reduce((total, app) => total + (app.today || 0), 0);
}

// Generate chart data for the past week (simulated for now)
export function getWeeklyData(): { name: string, productivity: number }[] {
  const data = getAppUsageData();
  
  // In a real app, you would store data for each day of the week
  // This is a simulation based on today and yesterday's data
  const today = new Date();
  
  return [
    { name: 'Sun', productivity: today.getDay() === 0 ? getTotalTimeToday() : Math.random() * 5 + 2 },
    { name: 'Mon', productivity: today.getDay() === 1 ? getTotalTimeToday() : Math.random() * 5 + 2 },
    { name: 'Tue', productivity: today.getDay() === 2 ? getTotalTimeToday() : Math.random() * 5 + 2 },
    { name: 'Wed', productivity: today.getDay() === 3 ? getTotalTimeToday() : Math.random() * 5 + 2 },
    { name: 'Thu', productivity: today.getDay() === 4 ? getTotalTimeToday() : Math.random() * 5 + 2 },
    { name: 'Fri', productivity: today.getDay() === 5 ? getTotalTimeToday() : Math.random() * 5 + 2 },
    { name: 'Sat', productivity: today.getDay() === 6 ? getTotalTimeToday() : Math.random() * 5 + 2 },
  ];
}

// Get app usage data for pie chart
export function getAppsUsageChartData(): { name: string, value: number }[] {
  const data = getAppUsageData();
  
  // Create chart data from the stored app usage
  const chartData = Object.entries(data).map(([name, appData]) => ({
    name,
    value: Math.round(appData.today || 0)
  }));
  
  // If we don't have enough real data, add some placeholder data
  if (chartData.length < 2) {
    if (!data['GitHub']) {
      chartData.push({ name: 'GitHub', value: 0 });
    }
    if (!data['LinkedIn']) {
      chartData.push({ name: 'LinkedIn', value: 0 });
    }
    if (!data['VS Code']) {
      chartData.push({ name: 'VS Code', value: Math.round(Math.random() * 120 + 60) });
    }
    if (!data['Browser']) {
      chartData.push({ name: 'Browser', value: Math.round(Math.random() * 100 + 50) });
    }
  }
  
  return chartData;
}
