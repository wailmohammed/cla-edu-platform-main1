import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, TrendingUp, Users, DollarSign, Plus, Settings } from "lucide-react";
import { toast } from "sonner";

export default function MarketplaceCreator() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
  });

  // Marketplace mutations
  const createMutation = trpc.enhancements.marketplace.createCourse.useMutation();
  const publishMutation = trpc.enhancements.marketplace.publishCourse.useMutation();
  const { data: stats } = trpc.enhancements.marketplace.getCreatorStats.useQuery();

  const handleCreateCourse = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast.error("Please fill in all fields");
        return;
      }

      const result = await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price || undefined,
      });

      toast.success("Course created!");
      setFormData({ title: "", description: "", category: "", price: 0 });
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Failed to create course");
    }
  };

  const handlePublish = async (courseId: number) => {
    try {
      await publishMutation.mutateAsync({ courseId });
      toast.success("Course published!");
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  return (
    <div className="space-y-4">
      {/* Creator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${(stats?.totalEarnings || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(stats?.totalStudents || 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Average Rating</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(stats?.averageRating || 0).toFixed(1)} ⭐
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Course Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Create & Publish Courses
              </CardTitle>
              <CardDescription>Share your knowledge and earn</CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              className={showCreateForm ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {showCreateForm ? "Cancel" : <Plus className="w-4 h-4 mr-1" />}
              {showCreateForm ? "Cancel" : "New Course"}
            </Button>
          </div>
        </CardHeader>

        {showCreateForm && (
          <CardContent className="space-y-4 border-t border-slate-200 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title</label>
              <Input
                placeholder="Enter course title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Describe your course"
                className="w-full h-20 p-2 border border-slate-200 rounded-md text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full p-2 border border-slate-200 rounded-md text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option value="programming">Programming</option>
                  <option value="web">Web Development</option>
                  <option value="data">Data Science</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price (USD)</label>
                <Input
                  type="number"
                  placeholder="0 for free"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <Button
              onClick={handleCreateCourse}
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Creating..." : "Create Course"}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* My Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, title: "Python Basics", students: 234, rating: 4.8, status: "published" },
              { id: 2, title: "Web Development", students: 156, rating: 4.6, status: "draft" },
              { id: 3, title: "JavaScript Advanced", students: 89, rating: 4.9, status: "published" },
            ].map((course) => (
              <div key={course.id} className="p-3 border border-slate-200 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{course.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                      <span>👥 {course.students} students</span>
                      <span>⭐ {course.rating}</span>
                      <Badge
                        variant={course.status === "published" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  {course.status === "draft" && (
                    <Button
                      onClick={() => handlePublish(course.id)}
                      size="sm"
                      variant="outline"
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
