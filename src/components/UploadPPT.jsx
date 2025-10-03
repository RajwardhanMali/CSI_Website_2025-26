import { useCallback, useRef, useState } from 'react';

// Configure your backend base URL via Vite env (recommended):
// VITE_API_BASE=https://your-backend.vercel.app
// Falls back to relative "/" for same-origin/proxy during local dev.
const API_BASE = import.meta?.env?.VITE_API_BASE || '';

export default function UploadPPT({ onUploaded, accept = '.ppt,.pptx,.pdf', maxSizeMB = 50 }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | creating | uploading | done | error
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const xhrRef = useRef(null);

  const reset = () => {
    setProgress(0);
    setStatus('idle');
    setError('');
    setFile(null);
  };

  const handleChoose = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/pdf'];
    const sizeLimit = maxSizeMB * 1024 * 1024;
    if (!allowed.includes(f.type)) {
      setError('Only PPT, PPTX, or PDF files are allowed');
      return;
    }
    if (f.size > sizeLimit) {
      setError(`File too large. Max ${maxSizeMB}MB`);
      return;
    }
    setError('');
    setFile(f);
  };

  const createSession = useCallback(async (f) => {
    setStatus('creating');
    const res = await fetch(`${API_BASE}/api/v1/drive/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name, mimeType: f.type || 'application/octet-stream' }),
    });
    if (!res.ok) {
      const msg = await safeError(res);
      throw new Error(msg || 'Failed to create upload session');
    }
    const data = await res.json();
    if (!data?.uploadUrl) throw new Error('No uploadUrl returned');
    return data.uploadUrl;
  }, []);

  const uploadFile = useCallback(async () => {
    if (!file) return;
    try {
      const uploadUrl = await createSession(file);
      setStatus('uploading');

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open('PUT', uploadUrl, true);
  xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setProgress(pct);
          }
        };

        xhr.onload = () => {
          // Google returns 200 OK with metadata JSON on success.
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText || '{}');
              onUploaded?.({ fileId: json.id, meta: json, file });
              setStatus('done');
              resolve();
            } catch (e) {
              setStatus('error');
              setError('Upload succeeded but parsing response failed');
              reject(e);
            }
          } else {
            setStatus('error');
            setError(`Upload failed with status ${xhr.status}`);
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          setStatus('error');
          setError('Network error during upload');
          reject(new Error('Network error'));
        };

        xhr.onabort = () => {
          setStatus('idle');
          setProgress(0);
          setError('Upload aborted');
          reject(new Error('Aborted'));
        };

        xhr.send(file);
      });
    } catch (e) {
      console.error(e);
      setStatus('error');
      setError(e.message || 'Upload failed');
    }
  }, [file, createSession, onUploaded]);

  const abortUpload = () => {
    if (xhrRef.current && status === 'uploading') {
      xhrRef.current.abort();
    }
  };

  return (
    <div className="upload-ppt flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-2">
        <button type="button" onClick={handleChoose} className="px-3 py-2 bg-gray-200 rounded">
          Choose File
        </button>
        {file ? (
          <span className="text-sm text-gray-700">
            {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        ) : (
          <span className="text-sm text-gray-500">No file selected</span>
        )}
      </div>

      {status === 'uploading' || progress > 0 ? (
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={uploadFile}
          disabled={!file || status === 'creating' || status === 'uploading'}
          className="px-3 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {status === 'creating' ? 'Starting…' : status === 'uploading' ? 'Uploading…' : 'Upload'}
        </button>

        {status === 'uploading' && (
          <button type="button" onClick={abortUpload} className="px-3 py-2 bg-red-500 text-white rounded">
            Cancel
          </button>
        )}

        {(status === 'done' || status === 'error') && (
          <button type="button" onClick={reset} className="px-3 py-2 bg-gray-100 rounded">
            Reset
          </button>
        )}
      </div>

      {status === 'done' && <p className="text-green-600 text-sm">Upload complete.</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

async function safeError(res) {
  try {
    const t = await res.text();
    return t;
  } catch {
    return '';
  }
}
