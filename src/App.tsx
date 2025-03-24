import { useState } from "react";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "Video Upload System" },
//     { name: "description", content: "Upload and manage your videos" },
//   ];
// };

interface VideoFile {
  id: string;
  name: string;
  uploadedAt: Date;
  size: number;
}

// Mock API function to simulate video upload
const mockUploadVideo = async (file: File): Promise<VideoFile> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        uploadedAt: new Date(),
        size: file.size,
      });
    }, 2000);
  });
};

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videos, setVideos] = useState<VideoFile[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    if (videoFiles.length === 0) {
      alert('Please drop video files only');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = videoFiles.map(file => mockUploadVideo(file));
      const newVideos = await Promise.all(uploadPromises);
      
      setVideos(prev => [...newVideos, ...prev].sort((a, b) => 
        b.uploadedAt.getTime() - a.uploadedAt.getTime()
      ));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload videos');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-4 border-dashed rounded-lg p-12
            flex flex-col items-center justify-center
            transition-colors duration-200
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">アップロード中...</p>
            </div>
          ) : (
            <>
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg text-gray-600">動画ファイルをドラッグ＆ドロップしてください</p>
              <p className="text-sm text-gray-500 mt-2">対応フォーマット: MP4, MOV, AVI など</p>
            </>
          )}
        </div>

        {/* Video List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">アップロード済みの動画</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {videos.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                アップロードされた動画はありません
              </div>
            ) : (
              videos.map(video => (
                <div key={video.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-800">{video.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(video.size)} • {formatDate(video.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
