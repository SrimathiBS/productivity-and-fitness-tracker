
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Bluetooth, Heart, Flame, X } from "lucide-react";
import { connectToSmartwatch, disconnectDevice, getFitnessData, isBluetoothSupported } from "@/lib/bluetoothService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SmartWatchTracker() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | undefined>(undefined);
  const [fitnessData, setFitnessData] = useState(getFitnessData());
  const [supported, setSupported] = useState(true);
  const DAILY_STEP_GOAL = 10000;

  // Check if Web Bluetooth API is supported
  useEffect(() => {
    setSupported(isBluetoothSupported());
  }, []);

  // Setup periodic data refresh when connected
  useEffect(() => {
    if (device?.gatt?.connected) {
      const interval = setInterval(() => {
        setFitnessData(getFitnessData());
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [device]);

  // Handle connection to smartwatch
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const result = await connectToSmartwatch();
      
      if (result.success && result.device) {
        setDevice(result.device);
        toast.success(result.message);
        
        // Update with initial data
        setFitnessData(getFitnessData());
        
        // Setup disconnect handler
        result.device.addEventListener('gattserverdisconnected', () => {
          toast.info(`Disconnected from ${result.device?.name || 'smartwatch'}`);
          setDevice(undefined);
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnection from smartwatch
  const handleDisconnect = () => {
    if (device) {
      disconnectDevice(device);
      toast.info(`Disconnected from ${device.name || 'smartwatch'}`);
      setDevice(undefined);
    }
  };

  // Calculate step progress
  const stepProgress = Math.min(100, Math.round((fitnessData.stepCount / DAILY_STEP_GOAL) * 100));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Smartwatch Connectivity</CardTitle>
          {device?.gatt?.connected && (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <Bluetooth className="h-3 w-3" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!supported ? (
          <div className="rounded-md bg-yellow-50 p-4 text-yellow-700 border border-yellow-200">
            <p>Your browser does not support the Web Bluetooth API. Please use Chrome, Edge, or Opera.</p>
          </div>
        ) : device?.gatt?.connected ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step Count */}
              <div className="space-y-2 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-blue-700">Step Count</h3>
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-900">{fitnessData.stepCount.toLocaleString()}</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-blue-700">
                    <span>Daily Goal</span>
                    <span>{stepProgress}%</span>
                  </div>
                  <Progress value={stepProgress} className="h-1.5" />
                </div>
              </div>
              
              {/* Heart Rate */}
              <div className="space-y-2 bg-rose-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-rose-700">Heart Rate</h3>
                  <Heart className="h-5 w-5 text-rose-500" />
                </div>
                {fitnessData.heartRate ? (
                  <div className="text-2xl font-bold text-rose-900">{fitnessData.heartRate} <span className="text-sm font-normal">BPM</span></div>
                ) : (
                  <div className="text-rose-900">Waiting for data...</div>
                )}
                <div className="text-xs text-rose-700">
                  {fitnessData.heartRate ? (
                    fitnessData.heartRate < 60 ? "Resting" : 
                    fitnessData.heartRate < 100 ? "Normal" : 
                    fitnessData.heartRate < 140 ? "Active" : "Intense"
                  ) : "No data"}
                </div>
              </div>
              
              {/* Calories Burned */}
              <div className="space-y-2 bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-orange-700">Calories Burned</h3>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                {fitnessData.caloriesBurned ? (
                  <div className="text-2xl font-bold text-orange-900">{fitnessData.caloriesBurned}</div>
                ) : (
                  <div className="text-orange-900">Calculating...</div>
                )}
                <div className="text-xs text-orange-700">Based on activity & steps</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="text-sm font-medium mb-2">Device Information</h3>
              <div className="text-sm text-gray-700">
                <p><span className="font-medium">Name:</span> {device.name || 'Unknown Device'}</p>
                <p><span className="font-medium">ID:</span> {device.id.substring(0, 8)}...</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Bluetooth className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Smartwatch Connected</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Connect your Fitbit, Garmin, or Mi Band to track steps, heart rate, and calories in real-time.
            </p>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting} 
              className="gap-2"
              size="lg"
            >
              {isConnecting ? 'Scanning...' : 'Connect Smartwatch'}
            </Button>
          </div>
        )}
      </CardContent>
      
      {device?.gatt?.connected && (
        <CardFooter className="border-t pt-4">
          <Button 
            onClick={handleDisconnect} 
            variant="outline" 
            className="ml-auto gap-2"
          >
            <X className="h-4 w-4" /> Disconnect
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
