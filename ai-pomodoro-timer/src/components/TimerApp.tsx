'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import TimerDisplay from "@/components/TimerDisplay";
import Controls from "@/components/Controls";
import MetadataUpdater from "@/components/Metadataupdater";
import { useState, useEffect } from "react";
import { useReward } from "react-rewards";
import { playNotificationSound } from "@/utils/sound";

type Mode = 'work' | 'break';

export default function TimerApp() {

    // 書き方は決まっているらしい
    const {reward: confetti, isAnimating} = useReward('confettiReward', 'confetti', {
        elementCount: 100,
        spread: 70,
        decay: 0.94,
        lifetime: 150,
    });

    const [isRunning, setIsRunning] = useState(false);

    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);

    const [timeLeft, setTimeLeft] = useState(
        { minutes: 25, seconds: 0 }
    )

    const [mode, setMode] = useState<Mode>('work');

    const [autoStart, setAutoStart] = useState(false);

    const toggleMode = () => {
        const newMode = mode === 'work' ? 'break' : 'work';
        setMode(newMode);
        setTimeLeft({
            minutes: newMode === 'work' ? workDuration : breakDuration,
            seconds: 0,
        })
        setIsRunning(false);
    }

    const handleStart = () => {
        setIsRunning(!isRunning);
    };  

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft({ 
            minutes: mode === 'work' ? workDuration : breakDuration, 
            seconds: 0 
        });

    };

    // タイマーの動作を管理するuseEffect
    // isRunningの状態が変更されるたびに実行される
    useEffect(() => {
        // インターバルIDを保持する変数（クリーンアップ時に使用）
        let intervalId: NodeJS.Timeout;

        // タイマーが動作中（isRunningがtrue）の場合のみ処理を実行
        if (isRunning) {
            // setIntervalで1秒（1000ミリ秒）ごとに処理を繰り返し実行
            intervalId = setInterval(() => {
                    // 1秒ごとに実行される処理（現在はコンソールログのみ）
                    setTimeLeft(
                        (prev) => {
                            if (prev.seconds === 0) {
                                if (prev.minutes === 0) {
                                    setIsRunning(false);
                                    toggleMode();
                                    if (mode==='work') {
                                        void confetti();
                                    }
                                    void playNotificationSound();
                                    return prev;
                                }
                                return {minutes: prev.minutes - 1, seconds: 59}
                            }
                            return {...prev, seconds:prev.seconds - 1}
                        }
                    )
                }, 1
            )
        }

        // クリーンアップ関数：コンポーネントのアンマウント時や
        // isRunningがfalseになった時に実行される
        return () => {
            // インターバルが設定されている場合、それをクリアしてメモリリークを防ぐ
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [isRunning] // 依存配列：isRunningが変更された時にuseEffectを再実行
);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            <span id="confettiReward" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {mode === 'work' ? '作業時間' : '休憩時間'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6 flex-col">
                    <TimerDisplay 
                        minutes={timeLeft.minutes}
                        seconds={timeLeft.seconds}
                        mode={mode}
                    />
                    <Controls 
                        onStart={handleStart} 
                        onReset={handleReset} 
                        onModeToggle={toggleMode}
                        isRunning={isRunning}/>
                </CardContent>
                <MetadataUpdater 
                    minutes={timeLeft.minutes}
                    seconds={timeLeft.seconds}
                    mode={mode}
                />
                <CardFooter className="flex flex-col gap-4 w-full max-w-[200px] mx-auto">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium min-w-[4.5rem]">作業時間</label>
                        <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                    const newWorkDuration = parseInt(e.target.value);
                                    setWorkDuration(newWorkDuration);
                                    if (mode === 'work' && !isRunning) {
                                    setTimeLeft({
                                        minutes: newWorkDuration,
                                        seconds: 0,
                                    })
                                }}}       
                        >
                            {[5,10,15,20,25,30].map((minutes) => {
                                return <option key={minutes} value={minutes}>{minutes}分</option>
                            })}

                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium min-w-[4.5rem]">休憩時間</label>
                        <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                    const newBreakDuration = parseInt(e.target.value);
                                    setBreakDuration(newBreakDuration);
                                    if (mode !== 'work' && !isRunning) {
                                    setTimeLeft({
                                        minutes: newBreakDuration,
                                        seconds: 0,
                                    })
                                }}}       
                        >
                            {[5,10,15].map((minutes) => {
                                return <option key={minutes} value={minutes}>{minutes}分</option>
                            })}
                        </select>
                    </div>
                   
                </CardFooter>
            </Card>
        </div>
    )
}