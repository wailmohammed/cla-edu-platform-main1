import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakCalendarProps {
  currentStreak?: number;
  longestStreak?: number;
  freezeDaysRemaining?: number;
  activityDates?: Date[];
}

export default function StreakCalendar({
  currentStreak = 0,
  longestStreak = 0,
  freezeDaysRemaining = 2,
  activityDates = [],
}: StreakCalendarProps) {
  // Get current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create array of dates for the calendar
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // Check if a date has activity
  const hasActivity = (date: Date | null) => {
    if (!date) return false;
    return activityDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );
  };

  const monthName = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Your Streak
            </CardTitle>
            <CardDescription>Track your daily learning activity</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
            <p className="text-xs text-slate-600">days</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">Longest Streak</p>
            <p className="text-2xl font-bold text-slate-900">{longestStreak}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">Freeze Days Left</p>
            <p className="text-2xl font-bold text-blue-600">{freezeDaysRemaining}</p>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">{monthName}</h3>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const isActive = hasActivity(date);
              const isToday =
                date &&
                date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();

              return (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                    ${!date ? "bg-transparent" : ""}
                    ${isActive ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}
                    ${isToday ? "ring-2 ring-orange-500" : ""}
                  `}
                  title={date ? date.toLocaleDateString() : ""}
                >
                  {date && date.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-slate-600">Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 rounded"></div>
            <span className="text-slate-600">No activity</span>
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Complete at least one lesson daily to maintain your streak. You have{" "}
            <strong>{freezeDaysRemaining} freeze days</strong> to use if you miss a day.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
