import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Briefcase, Clock, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export function JobBoard() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<"entry" | "mid" | "senior" | "">("");

  const { data: jobs, isLoading } = trpc.jobboard.getJobs.useQuery({
    category: category || undefined,
    level: (level as "entry" | "mid" | "senior") || undefined,
  });

  const { data: jobDetails } = trpc.jobboard.getJobDetails.useQuery(
    { jobId: selectedJob || 0 },
    { enabled: !!selectedJob }
  );

  const { data: careerPaths } = trpc.jobboard.getCareerPaths.useQuery();
  const { data: skillDemand } = trpc.jobboard.getSkillDemand.useQuery();

  const applyForJob = trpc.jobboard.applyForJob.useMutation();

  const handleApply = async () => {
    if (!selectedJob) return;
    try {
      await applyForJob.mutateAsync({ jobId: selectedJob, resume: "resume.pdf" });
      alert("Application submitted successfully!");
    } catch (error) {
      alert("Failed to apply for job");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Board</h1>
        <p className="text-gray-600 mb-8">Find your next opportunity and advance your career</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Filters */}
            <Card className="p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Category</label>
                  <Input
                    placeholder="e.g., Frontend, Backend"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Search Jobs</Button>
                </div>
              </div>
            </Card>

            {/* Jobs List */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Positions</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedJob === job.id ? "ring-2 ring-purple-600 bg-purple-50" : "hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedJob(job.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 mt-1">{job.company}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{job.salary}</p>
                        <Badge variant={job.remote ? "default" : "outline"} className="mt-2">
                          {job.remote ? "Remote" : job.location}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{job.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {Math.floor((Date.now() - job.posted.getTime()) / 86400000)} days ago
                        </span>
                      </div>
                      <div className="text-sm font-medium text-blue-600">{job.applications} applications</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">No jobs found. Try adjusting your filters.</div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {selectedJob && jobDetails && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Salary Range</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{jobDetails.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{jobDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application Deadline</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {jobDetails.deadline.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Required Skills</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobDetails.skills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Benefits</p>
                    <ul className="mt-2 space-y-1">
                      {jobDetails.benefits.map((benefit) => (
                        <li key={benefit} className="text-sm text-gray-700">✓ {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={handleApply}
                    disabled={applyForJob.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
                  >
                    {applyForJob.isPending ? "Applying..." : "Apply Now"}
                  </Button>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top In-Demand Skills
              </h3>
              <div className="space-y-3">
                {skillDemand?.slice(0, 5).map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                      <span className="text-xs text-green-600 font-bold">+{skill.growth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${skill.demand}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Career Paths</h3>
              <div className="space-y-3">
                {careerPaths?.slice(0, 3).map((path) => (
                  <div key={path.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{path.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{path.steps.length} career levels</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
