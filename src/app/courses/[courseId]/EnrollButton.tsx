'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enrollInCourse } from '@/app/actions/enrollment';

export default function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEnroll() {
    setLoading(true);
    setError('');
    const res = await enrollInCourse(courseId);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.refresh();
    router.push('/student');
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl"
      >
        {loading ? 'جاري التسجيل...' : 'التسجيل في الدورة'}
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}