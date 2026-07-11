import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Star, Clock, Users, DollarSign } from "lucide-react";

export function MentorMatching() {
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);
  const [expertise, setExpertise] = useState("");
  const [minRating, setMinRating] = useState(4);

  const { data: mentors, isLoading } = trpc.mentor.getAvailableMentors.useQuery({
    expertise: expertise || undefined,
    minRating: minRating || undefined,
  });

  const { data: profile } = trpc.mentor.getMentorProfile.useQuery(
    { mentorId: selectedMentor || 0 },
    { enabled: !!selectedMentor }
  );

  const requestSession = trpc.mentor.requestSession.useMutation();
  const { data: getMentorMatch } = trpc.mentor.getMentorMatch.useQuery(
    {
      mentorId: selectedMentor || 0,
      userGoals: ["Career Growth", "Technical Skills"],
      userLevel: "intermediate",
    },
    { enabled: !!selectedMentor }
  );

  const handleRequestSession = async () => {
    if (!selectedMentor) return;
    try {
      await requestSession.mutateAsync({
        mentorId: selectedMentor,
        topic: "Career Development",
        duration: 60,
        preferredTime: "Evening",
      });
      alert("Session requested successfully!");
    } catch (error) {
      alert("Failed to request session");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Mentor</h1>
        <p className="text-gray-600 mb-8">Connect with experienced professionals to accelerate your learning</p>

        {/* Search Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
              <Input
                placeholder="e.g., Python, React"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={0}>Any</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Search Mentors</Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentors List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Mentors</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading mentors...</div>
            ) : mentors && mentors.length > 0 ? (
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <Card
                    key={mentor.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedMentor === mentor.id
                        ? "ring-2 ring-blue-600 bg-blue-50"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedMentor(mentor.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-gray-600 mt-1">{mentor.bio}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {mentor.expertise.map((exp) => (
                            <Badge key={exp} variant="secondary">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-900">{mentor.rating}</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">${mentor.hourlyRate}/hr</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{mentor.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{mentor.responseTime}</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">{mentor.availability}</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">No mentors found. Try adjusting your filters.</div>
            )}
          </div>

          {/* Mentor Details & Booking */}
          {selectedMentor && profile && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mentor Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(profile.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{profile.reviews} reviews</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{profile.sessions} sessions</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{profile.successRate}%</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Languages</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.languages.map((lang) => (
                        <Badge key={lang} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Certifications</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.certifications.map((cert) => (
                        <Badge key={cert} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {getMentorMatch && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Match Score</p>
                      <p className="text-3xl font-bold text-blue-600 mt-1">
                        {getMentorMatch.matchScore}%
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {getMentorMatch.compatibility} match
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleRequestSession}
                    disabled={requestSession.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {requestSession.isPending ? "Requesting..." : "Request Session"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
