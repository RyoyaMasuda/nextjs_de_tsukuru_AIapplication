'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimerDisplay from "@/components/TimerDisplay";
import Controls from "@/components/Controls";
import { useState } from "react";


export default function TimerApp() {

    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft]

    const handleStart = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">作業時間</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6 flex-col">
                    <TimerDisplay 
                        minutes={25}
                        seconds={0}
                    />
                    <Controls 
                        onStart={handleStart} 
                        onReset={handleReset} 
                        isRunning={isRunning}/>
                </CardContent>
            </Card>
        </div>
    )
}