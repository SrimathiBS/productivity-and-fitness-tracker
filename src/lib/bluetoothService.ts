
// Define the types for fitness data
export interface FitnessData {
  stepCount: number;
  heartRate: number | null;
  caloriesBurned: number | null;
}

// Storage key for fitness data
const FITNESS_DATA_KEY = 'fitnessData';

// Default fitness data
const defaultFitnessData: FitnessData = {
  stepCount: 0,
  heartRate: null,
  caloriesBurned: null,
};

// Get the stored fitness data
export function getFitnessData(): FitnessData {
  const data = localStorage.getItem(FITNESS_DATA_KEY);
  return data ? JSON.parse(data) : defaultFitnessData;
}

// Save the fitness data
export function saveFitnessData(data: Partial<FitnessData>): void {
  const currentData = getFitnessData();
  const updatedData = { ...currentData, ...data };
  localStorage.setItem(FITNESS_DATA_KEY, JSON.stringify(updatedData));
}

// Check if Web Bluetooth API is supported
export function isBluetoothSupported(): boolean {
  return navigator.bluetooth !== undefined;
}

// Connect to a smartwatch and fetch fitness data
export async function connectToSmartwatch(): Promise<{
  success: boolean;
  message: string;
  device?: BluetoothDevice;
}> {
  if (!isBluetoothSupported()) {
    return {
      success: false,
      message: "Web Bluetooth API is not supported by your browser."
    };
  }

  try {
    // Request the device with heart rate service
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['heart_rate'] },
        { services: ['fitness_machine'] },
        { namePrefix: 'Fitbit' },
        { namePrefix: 'Garmin' },
        { namePrefix: 'Mi' }
      ],
      optionalServices: ['heart_rate', 'fitness_machine']
    });

    console.log('Device selected:', device.name);

    // Connect to the device
    const server = await device.gatt?.connect();
    if (!server) {
      return {
        success: false,
        message: "Failed to connect to the device."
      };
    }

    // Try to get heart rate service if available
    try {
      const heartRateService = await server.getPrimaryService('heart_rate');
      const heartRateCharacteristic = await heartRateService.getCharacteristic('heart_rate_measurement');
      
      // Listen for heart rate notifications
      await heartRateCharacteristic.startNotifications();
      heartRateCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        // Fix the type error by properly casting the event target
        const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
        if (characteristic.value) {
          // Parse heart rate data - this is a simplified implementation
          const heartRate = characteristic.value.getUint8(1);
          saveFitnessData({ heartRate });
          console.log('Heart rate updated:', heartRate);
        }
      });
      
      console.log('Heart rate monitoring started');
    } catch (error) {
      console.log('Heart rate service not available:', error);
    }

    // Mock step count and calories data (as these are harder to access directly)
    // In a real implementation, you would fetch this from specific characteristics
    // based on the smartwatch model
    mockFitnessData(device);

    return {
      success: true,
      message: `Connected to ${device.name || 'smartwatch'}`,
      device
    };
  } catch (error) {
    console.error('Bluetooth error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to connect to the device."
    };
  }
}

// Mock fitness data updates for demonstration purposes
function mockFitnessData(device: BluetoothDevice) {
  // Get current data
  const currentData = getFitnessData();
  
  // Set initial step count to some value if it's zero
  let steps = currentData.stepCount || Math.floor(Math.random() * 3000) + 2000;
  let calories = currentData.caloriesBurned || Math.floor(steps * 0.04);
  
  // Update step count and calories every few seconds to simulate real-time data
  const interval = setInterval(() => {
    // Only continue if the device is still connected
    if (!device.gatt?.connected) {
      clearInterval(interval);
      return;
    }
    
    // Increment steps by a random number between 5-20
    const newSteps = Math.floor(Math.random() * 15) + 5;
    steps += newSteps;
    
    // Update calories (roughly 0.04 calories per step)
    calories += Math.round(newSteps * 0.04);
    
    // Save updated data
    saveFitnessData({
      stepCount: steps,
      caloriesBurned: calories
    });
    
    console.log(`Updated fitness data - Steps: ${steps}, Calories: ${calories}`);
  }, 5000); // Update every 5 seconds
}

// Disconnect from the device
export function disconnectDevice(device?: BluetoothDevice): boolean {
  if (device?.gatt?.connected) {
    device.gatt.disconnect();
    return true;
  }
  return false;
}
