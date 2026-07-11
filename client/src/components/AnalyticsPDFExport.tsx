import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import html2pdf from "html2pdf.js";

interface AnalyticsData {
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  badgesEarned: number;
  topicDistribution: Array<{ name: string; value: number }>;
  weeklyActivity: Array<{ day: string; hours: number; lessons: number }>;
  xpGrowthData: Array<{ date: string; xp: number }>;
}

interface AnalyticsPDFExportProps {
  data: AnalyticsData;
  userName: string;
  generatedAt?: Date;
}

export default function AnalyticsPDFExport({
  data,
  userName,
  generatedAt = new Date(),
}: AnalyticsPDFExportProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);

    try {
      const element = contentRef.current;
      const opt = {
        margin: 10,
        filename: `learning-analytics-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as any, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" as any, unit: "mm" as any, format: "a4" as any },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const totalTopicXP = data.topicDistribution.reduce((sum, t) => sum + t.value, 0);
  const totalWeeklyHours = data.weeklyActivity.reduce((sum, w) => sum + w.hours, 0);

  return (
    <>
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export as PDF
          </>
        )}
      </Button>

      {/* Hidden PDF Content */}
      <div ref={contentRef} style={{ display: "none" }}>
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "28px", color: "#1f2937", margin: "0 0 10px 0" }}>
              Learning Analytics Report
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Codelearnify Platform
            </p>
          </div>

          {/* User Info */}
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>User:</strong> {userName}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Generated:</strong> {generatedAt.toLocaleString()}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Report Period:</strong> Last 30 days
            </p>
          </div>

          {/* Key Metrics */}
          <h2 style={{ fontSize: "18px", color: "#1f2937", marginTop: "20px", marginBottom: "10px" }}>
            Key Metrics
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <tbody>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    fontWeight: "bold",
                  }}
                >
                  Total XP
                </td>
                <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>
                  {data.totalXP.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    fontWeight: "bold",
                  }}
                >
                  Current Level
                </td>
                <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>
                  {data.currentLevel}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    fontWeight: "bold",
                  }}
                >
                  Current Streak
                </td>
                <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>
                  {data.currentStreak} days
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    fontWeight: "bold",
                  }}
                >
                  Badges Earned
                </td>
                <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>
                  {data.badgesEarned}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Topic Distribution */}
          <h2 style={{ fontSize: "18px", color: "#1f2937", marginTop: "20px", marginBottom: "10px" }}>
            Learning by Topic
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#3b82f6", color: "white" }}>
                <th style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "left" }}>
                  Topic
                </th>
                <th style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                  XP
                </th>
                <th style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {data.topicDistribution.map((topic, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "white" }}>
                  <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>
                    {topic.name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                    {topic.value.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                    {((topic.value / totalTopicXP) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Weekly Activity */}
          <h2 style={{ fontSize: "18px", color: "#1f2937", marginTop: "20px", marginBottom: "10px" }}>
            Weekly Activity
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#3b82f6", color: "white" }}>
                <th style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "left" }}>
                  Day
                </th>
                <th style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                  Hours
                </th>
                <th style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                  Lessons
                </th>
              </tr>
            </thead>
            <tbody>
              {data.weeklyActivity.map((activity, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "white" }}>
                  <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>
                    {activity.day}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                    {activity.hours}h
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                    {activity.lessons}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#e5e7eb", fontWeight: "bold" }}>
                <td style={{ padding: "10px", border: "1px solid #d1d5db" }}>Total</td>
                <td style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                  {totalWeeklyHours}h
                </td>
                <td style={{ padding: "10px", border: "1px solid #d1d5db", textAlign: "right" }}>
                  {data.weeklyActivity.reduce((sum, w) => sum + w.lessons, 0)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #d1d5db",
              paddingTop: "20px",
              marginTop: "20px",
              fontSize: "12px",
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            <p>
              This report was automatically generated by Codelearnify Platform.
              <br />
              For more information, visit www.codelearnify.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
