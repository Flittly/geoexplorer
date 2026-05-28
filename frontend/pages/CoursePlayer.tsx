import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myCoursesAPI, MyCourse, CourseProgressItem } from '../api';

const CoursePlayer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [courseData, setCourseData] = useState<MyCourse | null>(null);
  const [currentCourse, setCurrentCourse] = useState<CourseProgressItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    myCoursesAPI.getMyCourses()
      .then(courses => {
        const found = courses.find(c => c.package_id === id);
        if (found) {
          setCourseData(found);
          const firstIncomplete = found.courses.find(c => c.status !== 'COMPLETED');
          setCurrentCourse(firstIncomplete || found.courses[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const selectCourse = (course: CourseProgressItem) => {
    setCurrentCourse(course);
  };

  const markComplete = async () => {
    if (!currentCourse) return;
    try {
      await myCoursesAPI.completeCourse(currentCourse.course_id);
      if (courseData) {
        const updated = { ...courseData };
        updated.courses = updated.courses.map(c =>
          c.course_id === currentCourse.course_id ? { ...c, status: 'COMPLETED' as const, progress_percent: 100 } : c
        );
        updated.completed_count = updated.courses.filter(c => c.status === 'COMPLETED').length;
        updated.progress_percent = Math.round((updated.completed_count / updated.course_count) * 100);
        setCourseData(updated);
        const nextIncomplete = updated.courses.find(c => c.status !== 'COMPLETED');
        if (nextIncomplete) setCurrentCourse(nextIncomplete);
      }
    } catch {
      alert('操作失败');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent"></div></div>;
  }

  if (!courseData || !currentCourse) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">课程不存在</div>;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[60%]">{courseData.title}</h1>
        <div className="w-10"></div>
      </header>

      <div className="aspect-video bg-black">
        <iframe
          src={currentCourse.course_id ? `https://player.bilibili.com/player.html?bvid=${currentCourse.course_id}&autoplay=0` : ''}
          className="w-full h-full"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>

      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentCourse.title}</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${courseData.progress_percent}%` }}></div>
            </div>
            <span className="text-xs text-slate-500">{courseData.progress_percent}%</span>
          </div>
          {currentCourse.status !== 'COMPLETED' && (
            <button onClick={markComplete} className="mt-3 w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors">
              标记为已完成
            </button>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">课程列表</h3>
          <div className="space-y-2">
            {courseData.courses.map((course, index) => (
              <button key={course.course_id} onClick={() => selectCourse(course)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 border text-left transition-colors ${currentCourse.course_id === course.course_id ? 'bg-primary/5 border-primary/30' : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-700/50'}`}>
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${course.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {course.status === 'COMPLETED' ? (
                    <span className="material-symbols-outlined text-green-600 text-lg">check</span>
                  ) : (
                    <span className="text-sm font-medium text-slate-500">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${currentCourse.course_id === course.course_id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{course.title}</p>
                  {course.duration && <p className="text-xs text-slate-400 mt-0.5">{course.duration}</p>}
                </div>
                {currentCourse.course_id === course.course_id && (
                  <span className="material-symbols-outlined text-primary text-lg">equalizer</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
